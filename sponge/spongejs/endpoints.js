const { TransactionManager } = require('./managers/transactionManager.js');
const { Blockchain } = require('./classes/blockchain.js');

const blockchain = new Blockchain();
const txnManager = new TransactionManager(blockchain);

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.send({
            message: 'Hello World!'
        });
    });
    
    app.post('/transaction', (req, res) => {
        txnManager.create(req.body);
        res.send('ok');
    });
    
    app.get('/transaction', (req, res) => {
        res.send(blockchain.getTransactions());
    });
    
    app.get('/chain', (req, res) => {
        res.send(blockchain.getChain());
    });
    
    app.get('/chain/isvalid', (req, res) => {
        res.send(blockchain.isChainValid(blockchain.getChain()));
    });
    
    app.post('/debug/chain/add-invalid-block', (req, res) => {
        blockchain.debugAddInvalidBlock();
        res.send('ok');
    });
    
    app.get('/debug/chain-transaction', (req, res) => {
        res.send(blockchain.debugGetChainTransactions());
    });
}