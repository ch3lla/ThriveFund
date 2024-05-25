const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Thrive Fund API',
        version: '1.0.0',
        description: 'server side application for Thrive Fund built using Node.js',
        contact: {
            name: "Chukwuma Emmanuella",
            email: "chukwumaemmanuella03@gmail.com",
            url: "https://github.com/ch3lla/ThriveFund"
        },
    },
    servers: [
        {
          url: "http://localhost:5520/",
          description: "Local server"
        },
        {
          url: "<your live url here>",
          description: "Live server"
        },
      ]
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Path to the API routes in your Node.js application
};

console.log(`Swagger looking for API files in: ${options.apis}`);

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;