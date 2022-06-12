const { Blockchain } = require('./classes/blockchain.js');
const { TransactionManager } = require('./managers/transactionManager.js');
const { NetworkManager } = require('./managers/networkManager.js');

const blockchain = new Blockchain();
const txnManager = new TransactionManager(blockchain);
const networkManager = new NetworkManager(blockchain);

module.exports = (app) => {
    // /debug
    app.post('/debug/chain/add-invalid-block', (req, res) => {
        blockchain.debugAddInvalidBlock();
        res.send('ok');
    });
    
    app.get('/debug/chain-transaction', (req, res) => {
        res.send(blockchain.debugGetChainTransactions());
    });
    
    // /transaction
    app.post('/transaction', (req, res) => {
        txnManager.create(req.body);
        res.send('ok');
    });
    
    app.get('/transaction', (req, res) => {
        res.send(blockchain.getTransactions());
    });
    
    // /chain
    app.get('/chain', (req, res) => {
        res.send(blockchain.getChain());
    });
    
    app.get('/chain/isvalid', (req, res) => {
        res.send(blockchain.isChainValid(blockchain.getChain()));
    });
    
    // /network
    app.get('/network/connect', (req, res) => {
        const network = networkManager.connect(req.body);
        res.send(network);
    });
}