const { should } = require('chai');

class NetworkManager {
    constructor(blockchain) {
        this.blockchain = blockchain;
    }

    connect(body) {
        const address = body.address;
        should(address).exist();
    }
}

module.exports = {
    NetworkManager,
}