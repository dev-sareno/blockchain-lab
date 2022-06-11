const express = require("express");
const cors = require("cors");
const { TransactionManager } = require('./managers/transactionManager.js');
const { Blockchain } = require('./classes/blockchain.js');

const blockchain = new Blockchain();
const txnManager = new TransactionManager(blockchain);

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});