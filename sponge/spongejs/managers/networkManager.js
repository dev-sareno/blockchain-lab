const { assert } = require('chai');
const http = require('../http.js');
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
            const {status} = await http.get(
                `http://${address}/`,
                'network/ping',
                1000,
            );
            assert(status === 200, 'Node unreachable');
            // add to network
            this.blockchain.addNetworkNode(new NetworkNode(address));

            // brodcast network
            const data = {
                network: this.getNetwork(),
                exclude: [
                    address,
                    this.blockchain.getNodeAddress(),
                ]
            };
            this.#broadcastNetwork(data);
            return this.blockchain.getNetwork();
        } catch (e) {
            return undefined;
        }
    }

    getNetwork() {
        return this.blockchain.getNetwork();
    }

    async #broadcastNetwork(data) {
        const {exclude} = data;
        for (const node of this.blockchain.getNetwork()) {
            const {address} = node;
            const shouldSend = exclude.find(i => i === address) === undefined;
            if (shouldSend) {
                try {
                    const {status} = await http.post(
                        `http://${address}/`,
                        'network/broadcast',
                        data,
                    );
                    if (status < 200 || status > 299) {
                        console.log(`failed to broadcast network to ${address}; status=${status}`);
                    }
                } catch (e) {
                    console.log(`failed to broadcast network to ${address}; error=${e}`);
                }
            }
        }
    }

    receiveBroadcast(body) {
        const {network, exclude} = body;
        // validate if we already received this broadcast
        const alreadyReceived = exclude.find(i => i === this.blockchain.getNodeAddress()) !== undefined;
        if (alreadyReceived) {
            console.log('netword broadcast already received; ignoring...');
            return;
        }

        for (const node of network) {
            const {address} = node;
            const notExist = this.getNetwork()
                .find(i => i.address === address) === undefined;
            if (notExist) {
                const nn = new NetworkNode(address);
                this.blockchain.addNetworkNode(nn);
            }
        }
        
        // rebroacast
        const data = {
            network: this.getNetwork(),
            exclude: [...exclude, this.blockchain.getNodeAddress()]
        }
        this.#broadcastNetwork(data);
    }
}

module.exports = {
    NetworkManager,
}