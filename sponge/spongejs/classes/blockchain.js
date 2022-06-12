const CryptoJS = require("crypto-js");

class Block {
    constructor(previousHash, nonce, timestamp, transactions) {
        this.previousHash = previousHash;
        this.nonce = nonce;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.header = {};
    }
}

class Transaction {
    constructor(data, signature, publicKey, hash) {
        this.data = data;
        this.header = {
            signature: signature,
            publicKey: publicKey,
            hash: hash,
        }
    }
}

const genesisBlockHash = [...Array(64).keys()].map(_ => '0').join('');

const getGenesisTransaction = () => {
    const genesisTxn = new Transaction(
        '',
        'f87073772a171860b05df64e864c81afb7dc34fd6367ba7153ca38a4892499390483dc5c9970dda2e9238921cb46fa054b2a064abf32ca9905681df70ca9957d',
        '0435ff4b082a30246b1e699fd0f6fd869e682f8cffcd5fe50b5b259fe22bfcf65df3ed31c704348732ce8e6bf61135ca4814bac51bbeaa8b4bac3dd3f6c0bef8c0',
        'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
    return genesisTxn;
};

class Blockchain {
    static #DIFFICULTY = '000';
    static #TXN_PER_BLOCK = 3;
    #chain = [];
    #transactions = [];
    // to make it simple, we don't use merkle tree to validate transaction,
    // instead, we store transactions in in-memory database
    #chainTransactions = new Set();

    constructor() {
        const genesisTxn = getGenesisTransaction();
        const genesisBlock = this.mineBlock(genesisBlockHash, [genesisTxn]);
        this.#chain.push(genesisBlock);
        this.#chainTransactions.add(genesisTxn.header.hash);
    }

    debugAddInvalidBlock() {
        this.#chain.push(this.#chain[0]);
    }

    debugGetChainTransactions() {
        return Array.from(this.#chainTransactions)
            .map((v, i) => ({index: i, txnHash: v}));
    }

    mineBlock(previousHash, transactions) {
        console.log('mining new block');
        let nonce = 0;
        while (true) {
            const block = new Block(
                previousHash,
                nonce,
                new Date().getTime(),
                transactions
            );
            const blockJson = JSON.stringify(block);
            const hash = CryptoJS.SHA256(blockJson).toString();
            if (hash.startsWith(Blockchain.#DIFFICULTY)) {
                console.log('new block has been mined');
                block.header.hash = hash;
                return block;
            }
            nonce += 1;
        }
    }

    addTransactions(transactions) {
        /*
        Assumes all param:transactions here is not a duplicate
        */
        this.#transactions.push(...transactions);
        if (this.#transactions.length >= Blockchain.#TXN_PER_BLOCK) {
            // mine new block
            const lastBlock = this.getLastBlock();
            // get transactions from the queue
            const txns = this.#transactions.splice(0, Blockchain.#TXN_PER_BLOCK);
            const newBlock = this.mineBlock(lastBlock.header.hash, txns);
            this.#chain.push(newBlock);
            for (const txn of txns) {
                // add to chain's transaction
                this.#chainTransactions.add(txn.header.hash);
            }
            if (this.#transactions.length > 0) {
                this.addTransactions([]);
            }
        }
    }

    isChainValid(chain) {
        for (let i = 0; i < chain.length; i++) {
            const block = chain[i];
            const clone = Object.assign({}, block);
            clone.header = {}; //remove header
            const cloneJson = JSON.stringify(clone);
            const hash = CryptoJS.SHA256(cloneJson).toString();
            if (!hash.startsWith(Blockchain.#DIFFICULTY) || hash !== block.header.hash) {
                return false;
            }
            if (i === 0) {
                continue;
            }
            const previousBlock = chain[i - 1];
            if (previousBlock.header.hash !== block.previousHash) {
                return false;
            }
        }
        return true;
    }

    getLastBlock() {
        return this.#chain[this.#chain.length - 1];
    }

    getChain() {
        return this.#chain;
    }

    getTransactions() {
        return this.#transactions;
    }

    isTransactionIncluded(txnHash) {
        return this.#chainTransactions.has(txnHash);
    }
}

module.exports = {
    Block,
    Transaction,
    Blockchain,
}