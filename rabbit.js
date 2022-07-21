require('dotenv').config();
const amqp = require('amqplib');
const log = require('./helpers/logger');

module.exports.prepareErrorQueue = async () => {

    try{
        
        let exchangeDLX = 'error-exchange';
        let queueDLX = 'error-queue';
        let routingKey = '';
        if (process.env.ELASTICIO_LISTEN_MESSAGES_ON) {
        	const componentProp = process.env.ELASTICIO_LISTEN_MESSAGES_ON.split(":");
        	if (componentProp) {
		        exchangeDLX = componentProp[0];
		        queueDLX = componentProp[0] + ':' + componentProp[1] + ':deadletter';
		        routingKey = componentProp[0] + '.' + componentProp[1] + '.deadletter';
	        }
        }
        log.info(queueDLX);

        let connection = await amqp.connect(process.env.URI_RABBITMQ);

        const ch = await connection.createChannel();

        await ch.assertExchange(exchangeDLX, 'topic', {durable: true});

        const queue = await ch.assertQueue(queueDLX, {
            exclusive: false
        });

        await ch.bindQueue(queue.queue, exchangeDLX, routingKey);

        //ch.sendToQueue(queue.queue, new Buffer.from(message.toString()),{persistent: true});

        await ch.close();
    }catch (e){
        log.error(`ERROR on rabbit: ${e}`);
    }
};

module.exports.producerMessage = async (message, queue) => {

    try{
        let exchangeDLX = 'message-exchange';
        let queueDLX = 'message-queue';
        let routingKey = '';
        if (process.env.ELASTICIO_LISTEN_MESSAGES_ON) {
        	const componentProp = process.env.ELASTICIO_LISTEN_MESSAGES_ON.split(":");
        	if (componentProp) {
		        exchangeDLX = componentProp[0];
		        queueDLX = componentProp[0] + ':' + componentProp[1] + ':deadletter';
		        routingKey = componentProp[0] + '.' + componentProp[1] + '.deadletter';
	        }
        }
        log.info(queueDLX);

        let connection = await amqp.connect(process.env.URI_RABBITMQ);

        const ch = await connection.createChannel();

        await ch.assertExchange(exchangeDLX, 'topic', {durable: true});

        const queue = await ch.assertQueue(queueDLX, {
            exclusive: false
        });

        await ch.bindQueue(queue.queue, exchangeDLX, routingKey);

        //ch.sendToQueue(queue.queue, new Buffer.from(message.toString()),{persistent: true});
        const trace = {"Message": message.toString()}
        ch.publish(exchangeDLX, routingKey, new Buffer.from(JSON.stringify(trace)),{persistent: true});

        await ch.close();
    }catch (e){
        log.error(`ERROR on rabbit: ${e}`);
    }
};

module.exports.producerErrorMessage = async (payload, error) => {

    try{
        let exchangeDLX = 'error-exchange';
        let queueDLX = 'error-queue';
        let routingKey = '';
        if (process.env.ELASTICIO_LISTEN_MESSAGES_ON) {
        	const componentProp = process.env.ELASTICIO_LISTEN_MESSAGES_ON.split(":");
        	if (componentProp) {
		        exchangeDLX = componentProp[0];
		        queueDLX = componentProp[0] + ':' + componentProp[1] + ':deadletter';
		        routingKey = componentProp[0] + '.' + componentProp[1] + '.deadletter';
	        }
        }
        log.info(queueDLX);

        let connection = await amqp.connect(process.env.URI_RABBITMQ);

        const ch = await connection.createChannel();

        await ch.assertExchange(exchangeDLX, 'topic', {durable: true});

        const queue = await ch.assertQueue(queueDLX, {
            exclusive: false
        });

        await ch.bindQueue(queue.queue, exchangeDLX, routingKey);

        //ch.sendToQueue(queue.queue, new Buffer.from(message.toString()),{persistent: true});
        const emsg = error.toString();
        const trace = {"ErrorMessage": emsg, "Payload": payload.toString()};
        ch.publish(exchangeDLX, routingKey, new Buffer.from(JSON.stringify(trace)), {persistent: true});

        await ch.close();
    }catch (e){
        log.error(`ERROR on rabbit: ${e}`);
    }
};
