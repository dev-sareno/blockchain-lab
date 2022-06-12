const { assert } = require('chai');
const { create: axiosCreate } = require('axios');
const { NetworkNode } = require('../classes/blockchain');

class NetworkManager {
    constructor(blockchain) {
        this.blockchain = blockchain;
    }

    async connect(body) {
        try {
            const address = body.address;
            assert(address !== undefined && address !== null, 'Invalid address');
            // ping node
            const {status} = await axiosCreate({
                baseURL: `http://${address}/`,
                timeout: 1000, // 1sec
            }).get('network/ping');
            assert(status === 200, 'Node unreachable');
            // add to network
            this.blockchain.addNetworkNode(new NetworkNode(address));
            return this.blockchain.getNetwork();
        } catch (e) {
            return undefined;
        }
    }
}

module.exports = {
    NetworkManager,
}