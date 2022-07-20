# rabbitmqCG-OIH

1. Introduction

This code has the objective to send messages to a rabbitmq queues for the Open Integration Hub (OIH). This messages primarily will send an error message from OIH components to be handled.

This library is useful to add into the OIH components developed by their owners in order to have information for errors at flows execution time.

As components are used in the OIH flows regardless that the library should be added on component code, when the flow is running, an exchange and some queues are created using the ID flow (assigned from OIH). In the case of the queues, two queues are created for each step in the OIH flow.

The queue naming structure is as follows:

flow – flowID : stepName : messages
flow – flowID : stepName : rebounds



Using the same structure for the OIH error handler queue (for each step) the next queue is created, internally, by the rabbitmqCG-OIH library.

flow – flowID : stepName : deadletter

And it is configured an exchange (the same used by the other queues).



Once this configuration is created by the library, messages can be sent to this queue.





2. Library Methods

The library can be installed from npm page with the next:

npm install rabbitmqcg-oih or npm i rabbitmqcg-oih

2.1. prepareErrorQueue

Args:No arguments are required.Description:This method prepares the queue (deadletter) and the relation to the exchange, creating the queues and/or exchange if do not exist.

Once the code is set, at run time each time it occurs an error, a message is sent to the configured queue.
Sample://Sample applied into a component function for OIH

module.exports.process = async function processTrigger(msg, cfg, snapshot = {}) {
      try {
            await rabbitmq.prepareErrorQueue();
            //Your code here...
      } catch (e) {
        console.error(`ERROR: ${e}`);
        this.emit(‘error’, trace);
    }
};

Resultant sample:






2.2. producerMessage

Args:Message: A String that contains the message to be sent to the deadletter queue.
Description:This method prepares the queue (deadletter) and the relation to the exchange, creating the queues and/or exchange if do not exist.

Once the code is set, at the time the code line is executed, the message content is sent to the queue.
Sample://Sample applied into a component function for OIH

module.exports.process = async function processTrigger(msg, cfg, snapshot = {}) {
      try {
            await rabbitmq.producerMessage();
            //Your code here...
      } catch (e) {
        console.error(`ERROR: ${e}`);
        this.emit(‘error’, trace);
    }
};




test
