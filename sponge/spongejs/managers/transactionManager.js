const { assert } = require('chai');
const CryptoJS = require('crypto-js');
const { verifySignature } = require('../utility/cryptUtil.js');
const { Transaction } = require('../classes/blockchain.js');
const { create: axiosCreate } = require('axios');
const { PORT } = require('../app.config.js');

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

        // assert non-duplicate transaction
        assert(this.blockchain.isTransactionIncluded(hash) === false, 'Transaction already exists');
    }

    async #broadcastTransaction(txn) {
        for (const node of this.blockchain.getNetwork()) {
            const address = node.address;
            if (address !== `localhost:${PORT}`) {
                try {
                    const {status} = await axiosCreate({
                        baseURL: `http://${address}/`,
                        timeout: 5000, // 5sec
                    }).post('transaction/broadcast', txn);
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
        this.blockchain.addTransactions([txn]);

        // broadcast transaction
        await this.#broadcastTransaction(txn);
    }

    async receiveBroadcast(body) {
        try {
            this.#validateTransaction(body);
        } catch (e) {
            console.log('transaction aleady received, ignoring..');
            // probably duplicate
            return;
        }

        // add to transactions
        this.blockchain.addTransactions([body]);

        // rebroadcast transaction
        await this.#broadcastTransaction(body);
    }
}

module.exports = {
    TransactionManager
}