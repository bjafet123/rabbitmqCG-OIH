[![N|Solid](https://cloudgensys.com/cg-demo/wp-content/uploads/2019/05/CG-Logo-01.png)](https://www.cloudgensys.com/)

# rabbitmqCG-OIH

[![N|Solid](https://raw.githubusercontent.com/bjafet123/rabbitmqCG-OIH/033df3857df6792644c714314019dd2e6b4d44bd/rm-files/rabbitmqCG-OIH.svg)](https://github.com/bjafet123/rabbitmqCG-OIH.git)

## _1. Introduction_

This code has the objective to send messages to a rabbitmq queues for the Open Integration Hub (OIH). This messages primarily will send an error message from OIH components to be handled.

This library is useful to add into the OIH components developed by their owners in order to have information for errors at flows execution time.

As components are used in the OIH flows regardless that the library should be added on component code, when the flow is running, an exchange and some queues are created using the ID flow (assigned from OIH). In the case of the queues, two queues are created for each step in the OIH flow.

The queue naming structure is as follows:

```
flow – flowID : stepName : messages
flow – flowID : stepName : rebounds
```

![](https://github.com/bjafet123/rabbitmqCG-OIH/blob/main/rm-files/rm-img-01.png?raw=true)

Using the same structure for the OIH error handler queue (for each step) the next queue is created, internally, by the rabbitmqCG-OIH library.

```
flow – flowID : stepName : deadletter
```

And it is configured an exchange (the same used by the other queues).

![](https://github.com/bjafet123/rabbitmqCG-OIH/blob/main/rm-files/rm-image-02.png?raw=true)

Once this configuration is created by the library, messages can be sent to this queue.

## _2.	Library Methods_

The library can be installed from npm page with the next:

**npm install rabbitmqcg-oih** or **npm i rabbitmqcg-oih**

### _2.1. prepareErrorQueue_

- **Args:** No arguments are required.
- **Description:** This method prepares the queue (deadletter) and the relation to the exchange, creating the queues and/or exchange if do not exist.
Once the code is set, at run time each time it occurs an error, a message is sent to the configured queue.
- **Sample:**
```js
//Sample applied into a component function for OIH

module.exports.process = async function processTrigger(msg, cfg, snapshot = {}) {
      try {
            await rabbitmq.prepareErrorQueue();
            //Your code here...
      } catch (e) {
        console.error(`ERROR: ${e}`);
        this.emit(‘error’, e);
    }
};
```

Resultant sample:

![](https://github.com/bjafet123/rabbitmqCG-OIH/blob/main/rm-files/rm-img-03.png?raw=true)

### _2.2. producerMessage_

- **Args:** Message: A String that contains the message to be sent to the deadletter queue.
- **Description:** This method prepares the queue (deadletter) and the relation to the exchange, creating the queues and/or exchange if do not exist. 
Once the code is set, at the time the code line is executed, the message content is sent to the queue.
- **Sample:**
```js
//Sample applied into a component function for OIH

module.exports.process = async function processTrigger(msg, cfg, snapshot = {}) {
      try {
            await rabbitmq.producerMessage();
            //Your code here...
      } catch (e) {
        console.error(`ERROR: ${e}`);
        this.emit(‘error’, e);
    }
};
```

Resultant sample:

![](https://github.com/bjafet123/rabbitmqCG-OIH/blob/main/rm-files/rm-img-04.png?raw=true)

### _2.3. producerErrorMessage_

- **Args:** 
    - Payload: The content of a request.
    - Error: The error message.
- **Description:** This method prepares the queue (deadletter) and the relation to the exchange, creating the queues and/or exchange if do not exist. 
Once the code is set, at the time an error is catched a message is sent to the queue with the payload content and with the error message.
- **Sample:**
```js
//Sample applied into a component function for OIH

module.exports.process = async function processTrigger(msg, cfg, snapshot = {}) {
      try {
            let {data} = msg;
            //Your code here...
      } catch (e) {
        console.error(`ERROR: ${e}`);
        this.emit(‘error’, e);
        await rabbit.producerErrorMessage(data, e);
    }
};
```

Resultant sample:

![](https://github.com/bjafet123/rabbitmqCG-OIH/blob/main/rm-files/rm-img-05.png?raw=true)