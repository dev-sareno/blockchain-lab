const assert = require('node:assert');
const CryptoJS = require('crypto-js');
const { verifySignature } = require('../utility/cryptUtil.js');
const { Transaction } = require('../classes/blockchain.js');

class TransactionManager {
    constructor(blockchain) {
        this.blockchain = blockchain;
    }

    create(body) {
        const payload = body.payload;
        const hash = body.header.hash;
        const signature = body.header.signature;
        const publicKey = body.header.publicKey;
    
        // validate txn hash
        const createdHash = CryptoJS.SHA256(payload).toString();
        assert.equal(createdHash, hash, 'invalid hash');
    
        const verified = verifySignature(signature, hash, publicKey);
        assert.equal(verified, true, 'invalid signature');

        const txn = new Transaction(payload, signature, publicKey, hash);
        this.blockchain.addTransactions([txn]);
    }
}

module.exports = {
    TransactionManager
}