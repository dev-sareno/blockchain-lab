const { assert } = require('chai');
const http = require('../http.js');

class BlockManager {
    constructor(blockchain) {
        this.blockchain = blockchain;
    }

    async #validateBlock(body) {
        const {
            address,
            chainLength,
        } = body;
        
        // compare chain length
        assert(
            chainLength > this.blockchain.getChain().length,
            `chain must be greater than current so that it can be accepted; them=${chainLength}; mine=${this.blockchain.getChain().length}`
        );

        // validate genesis/first block if match
        const {data: chain} = await http.get(`http://${address}/`, 'chain');
        assert(chain.length > 0, 'chain cannot be empty');
        const firstBlock = chain[0];
        assert(firstBlock.header.hash === this.blockchain.getChain()[0].header.hash, 'first block did not match');

        // validate sender's blockchain
        assert(this.blockchain.isChainValid(chain) === true, 'invalid chain');
    }

    async receiveBroadcast(body) {
        const {
            address,
        } = body;

        try {
            await this.#validateBlock(body);
        } catch (e) {
            console.log(`the received new block from ${address} is invalid. ${e}`);
            return;
        }

        // stop current mining
        this.blockchain.abortCurrentMining('CHAIN_REPLACE');

        // replace current chain
        this.blockchain.replaceChain(chain);

        // filter and retain only transactions that are not included in the the latest chain
        this.blockchain.syncTransactions();

        // resume mining
        this.blockchain.addTransactions([]);

        // rebroadcast latest block
        await http.post(
            `http://${address}/`,
            'chain/new-block/broadcast',
            {
                address: this.blockchain.getNodeAddress(),
                chainLength: this.getChain().length,
            }
        );
    }
}

module.exports = {
    BlockManager,
}