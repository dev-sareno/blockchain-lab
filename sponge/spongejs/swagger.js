const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
      title: 'SpongeJS Blockchain 🧱⛓',
      description: 'General purpose blockchain',
    },
    host: 'localhost:5001',
    schemes: ['http'],
  };

const outputFile = './swagger_output.json';
const endpointsFiles = ['./endpoints.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    // require('./app.js');
});