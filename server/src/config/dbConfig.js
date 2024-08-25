// config/dbConfig.js

const AWS = require('aws-sdk');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Configure the AWS SDK to interact with DynamoDB using environment variables
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDB;
