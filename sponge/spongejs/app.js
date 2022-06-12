const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

require('./endpoints')(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});