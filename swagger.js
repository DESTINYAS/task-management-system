const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API for managing tasks',
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = {
    serveSwaggerUI: swaggerUi.serve,
    setupSwaggerUI: () => swaggerUi.setup(specs),
  };
