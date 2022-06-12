const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const { PORT } = require('./app.config.js');
const { Blockchain } = require('./classes/blockchain.js');

const blockchain = new Blockchain();

const app = express();
const port = PORT;

app.use(express.json());
app.use(cors());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

require('./endpoints')(app, blockchain);

app.listen(port, async () => {
  console.log(`App listening on port ${port}`);
  const network = process.env.SPNG_NETWORK;
  if (network) {
    setTimeout(async () => {
      console.log(`Joining network ${network}...`);
      const joined = await blockchain.joinNetwork(network);
      if (joined) {
        console.log('Successfully connected to the network');
      }
    }, 1000);
  }
});