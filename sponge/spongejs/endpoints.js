const { TransactionManager } = require('./managers/transactionManager.js');
const { NetworkManager } = require('./managers/networkManager.js');
const { BlockManager } = require('./managers/blockManager.js');

module.exports = (app, blockchain) => {
    const txnManager = new TransactionManager(blockchain);
    const networkManager = new NetworkManager(blockchain);
    const blockManager = new BlockManager(blockchain);

    // /debug
    app.post('/debug/chain/add-invalid-block', (req, res) => {
        blockchain.debugAddInvalidBlock();
        res.send('ok');
    });
    
    app.get('/debug/chain-transaction', (req, res) => {
        res.send(blockchain.debugGetChainTransactions());
    });
    
    // /transaction
    app.post('/transaction', async (req, res) => {
        await txnManager.create(req.body);
        res.send('ok');
    });
    
    app.get('/transaction', (req, res) => {
        res.send(blockchain.getTransactions());
    });
    
    app.post('/transaction/broadcast', async (req, res) => {
        await txnManager.receiveBroadcast(req.body);
        res.send('ok');
    });
    
    // /chain
    app.get('/chain', (req, res) => {
        res.send(blockchain.getChain());
    });
    
    app.get('/chain/isvalid', (req, res) => {
        res.send(blockchain.isChainValid(blockchain.getChain()));
    });
    
    app.post('/chain/new-block/broadcast', async (req, res) => {
        await blockManager.receiveBroadcast(req.body);
        res.send('ok');
    });
    
    // /network
    app.post('/network/connect', async (req, res) => {
        const network = await networkManager.connect(req.body);
        res.status(network ? 200 : 400)
            .send(network ? network : 'Node registration falied');
    });

    app.get('/network/ping', (req, res) => {
        res.send('pong');
    });

    app.get('/network', (req, res) => {
        res.send(networkManager.getNetwork());
    });

    app.post('/network/broadcast', (req, res) => {
        networkManager.receiveBroadcast(req.body);
        res.send('ok');
    });
}