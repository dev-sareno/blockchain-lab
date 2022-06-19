const { assert } = require('chai');
const CryptoJS = require('crypto-js');
const { verifySignature } = require('../utility/cryptUtil.js');
const { Transaction } = require('../classes/blockchain.js');
const http = require('../http.js');

class TransactionManager {
    constructor(blockchain) {
        this.blockchain = blockchain;
    }

    #validateTransaction(txn) {
        const data = txn.data;
        const hash = txn.header.hash;
        const signature = txn.header.signature;
        const publicKey = txn.header.publicKey;
    
        // validate txn hash
        const createdHash = CryptoJS.SHA256(data).toString();
        assert(createdHash === hash, 'invalid hash');

        const verified = verifySignature(signature, hash, publicKey);
        assert(verified === true, 'invalid signature');

        // assert non-duplicated transaction in block
        assert(this.blockchain.isTransactionIncluded(hash) === false, 'Transaction already exists in block');

        // assert non-duplicate transaction in queue
        assert(this.blockchain.getTransactions().find(i => i.header.hash === hash) === undefined, 'Transaction already exists in queue');
    }

    async #broadcastTransaction(body) {
        const {exclude} = body;
        for (const node of this.blockchain.getNetwork()) {
            const address = node.address;
            const shouldSend = exclude.find(i => i === address) === undefined;
            if (shouldSend) {
                try {
                    const {status} = await http.post(
                        `http://${address}/`,
                        'transaction/broadcast',
                        body,
                    );
                    if (status < 200 || status > 299) {
                        console.log(`failed to broadcast transaction to ${address}; status=${status}`);
                    }
                } catch (e) {
                    console.log(`failed to broadcast transaction to ${address}; error=${e}`);
                }
            }
        }
    }

    async create(body) {
        this.#validateTransaction(body);
        const txn = new Transaction(
            body.data,
            body.header.signature,
            body.header.publicKey,
            body.header.hash
        );
        const latestBlock = this.blockchain.addTransactions([txn]);

        // broadcast transaction
        const data = {
            exclude: [this.blockchain.getNodeAddress()],
            transaction: txn,
        };
        await this.#broadcastTransaction(data);

        if (latestBlock) {
            // broadcast latest block
            this.#broacastLatestBlock(latestBlock);
        }
    }

    async receiveBroadcast(body) {
        try {
            this.#validateTransaction(body.transaction);
        } catch (e) {
            console.log('transaction aleady received, ignoring..');
            // probably duplicate
            return;
        }

        // add to transactions
        const latestBlock = this.blockchain.addTransactions([body.transaction]);

        // rebroadcast transaction
        const data = {
            ...body,
            exclude: [
                ...body.exclude,
                this.blockchain.getNodeAddress(),
            ]
        };
        await this.#broadcastTransaction(data);

        if (latestBlock) {
            // broadcast latest block
            this.#broacastLatestBlock(latestBlock);
        }
    }

    #broacastLatestBlock(block) {
        for (const {address} of this.blockchain.getNetwork()) {
            try {
                (async () => {
                    await http.post(
                        `http://${address}/`,
                        'chain/new-block/broadcast',
                        {
                            address: this.blockchain.getNodeAddress(),
                            chainLength: this.blockchain.getChain().length,
                        }
                    );
                })();
            } catch (e) {
                console.log(`failed to brodcast block to ${address}. ${e}`);
            }
        }
    }
}

module.exports = {
    TransactionManager
}