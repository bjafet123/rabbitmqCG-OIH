require('dotenv').config();
const amqp = require('amqplib');
const log = require('../helpers/logger');

module.exports.prepareErrorQueue = async () => {

    try {
        
        log.info("Rabbitmq test excecuted");
        
    } catch (e) {
        log.error(`ERROR on rabbit: ${e}`);
    }
};

module.exports.producerMessage = async (message) => {

    try {
        
        log.info("Rabbitmq test excecuted " + message);
        
    } catch (e) {
        log.error(`ERROR on rabbit: ${e}`);
    }
};