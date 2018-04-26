var SolPubSub = function () {
    'use strict';
    var solPubSub = {};
    solPubSub.session = null;
    solPubSub.subscribed = false;

    // Logger
    solPubSub.log = function (line) {
        var now = new Date();
        var time = [('0' + now.getHours()).slice(-2), ('0' + now.getMinutes()).slice(-2),
            ('0' + now.getSeconds()).slice(-2)];
        var timestamp = '[' + time.join(':') + '] ';
        console.log(timestamp + line);
    };

    solPubSub.log('\n*** solPubSub is ready to connect ***');

    // Establishes connection to Solace router
    solPubSub.connect = function () {
        // extract params
        if (solPubSub.session !== null) {
            solPubSub.log('Already connected and ready to subscribe.');
            return;
        }

        solPubSub.log('Connecting to Solace message router using url: ' + hostUrl);
        solPubSub.log('Client username: ' + username);
        solPubSub.log('Solace message router VPN name: ' + msgVpn);
        // create session
        try {
            solPubSub.session = solace.SolclientFactory.createSession({
                // solace.SessionProperties
                url:      hostUrl,
                vpnName:  msgVpn,
                userName: username,
                password: password,
            });
        } catch (error) {
            solPubSub.log(error.toString());
        }
        // define session event listeners
        solPubSub.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
            solPubSub.log('=== Successfully connected. ===');
        });
        solPubSub.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
            solPubSub.log('Connection failed to the message router: ' + sessionEvent.infoStr +
                ' - check correct parameter values and connectivity!');
        });
        solPubSub.session.on(solace.SessionEventCode.DISCONNECTED, function (sessionEvent) {
            solPubSub.log('Disconnected.');
            solPubSub.subscribed = false;
            if (solPubSub.session !== null) {
                solPubSub.session.dispose();
                solPubSub.session = null;
            }
        });
        solPubSub.session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, function (sessionEvent) {
            solPubSub.log('Cannot subscribe to topic: ' + sessionEvent.correlationKey);
        });
        solPubSub.session.on(solace.SessionEventCode.SUBSCRIPTION_OK, function (sessionEvent) {
            if (solPubSub.subscribed) {
                solPubSub.subscribed = false;
                solPubSub.log('Successfully unsubscribed from topic: ' + sessionEvent.correlationKey);
            } else {
                solPubSub.subscribed = true;
                solPubSub.log('Successfully subscribed to topic: ' + sessionEvent.correlationKey);
                solPubSub.log('=== Ready to receive messages. ===');
            }
        });
        // define message event listener
        solPubSub.session.on(solace.SessionEventCode.MESSAGE, function (message) {
            solPubSub.log('Received message: "' + message.getBinaryAttachment() + '", details:\n' +
                message.dump());
            updatePlayers(message.getBinaryAttachment());                        
        });

        solPubSub.connectToSolace();
    };

    solPubSub.connectToSolace = function () {
        try {
            solPubSub.session.connect();
        } catch (error) {
            solPubSub.log(error.toString());
        }
    };

    // Subscribes to topic on Solace message router
    solPubSub.subscribe = function (topicName) {
        if (solPubSub.session !== null) {
            if (solPubSub.subscribed) {
                solPubSub.log('Already subscribed to and ready to receive messages.');
            } else {
                try {
                    solPubSub.session.subscribe(
                        solace.SolclientFactory.createTopicDestination(topicName),
                        true, // generate confirmation when subscription is added successfully
                        topicName, // use topic name as correlation key
                        10000 // 10 seconds timeout for this operation
                    );
                } catch (error) {
                    solPubSub.log(error.toString());
                }
            }
        } else {
            solPubSub.log('Cannot subscribe because not connected to Solace message router.');
        }
    };

    // Unsubscribes from topic on Solace message router
    solPubSub.unsubscribe = function (topicName) {
        if (solPubSub.session !== null) {
            if (solPubSub.subscribed) {
                try {
                    solPubSub.session.unsubscribe(
                        solace.SolclientFactory.createTopicDestination(topicName),
                        true, // generate confirmation when subscription is removed successfully
                        topicName, // use topic name as correlation key
                        10000 // 10 seconds timeout for this operation
                    );
                } catch (error) {
                    solPubSub.log(error.toString());
                }
            } else {
                solPubSub.log('Cannot unsubscribe because not subscribed to the topic');
            }
        } else {
            solPubSub.log('Cannot unsubscribe because not connected to Solace message router.');
        }
    };

    solPubSub.publish = function (msg, topicName) {
        if (solPubSub.session !== null) {
            var messageText = msg;
            var message = solace.SolclientFactory.createMessage();
            message.setDestination(solace.SolclientFactory.createTopicDestination(topicName));
            message.setBinaryAttachment(messageText);
            message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
            solPubSub.log('Publishing message "' + messageText + '" to topic "' + topicName + '"...');
            try {
                solPubSub.session.send(message);
                solPubSub.log('Message published.');
            } catch (error) {
                solPubSub.log(error.toString());
            }
        } else {
            solPubSub.log('Cannot publish because not connected to Solace message router.');
        } 
    };

    // sends one request
    solPubSub.request = function (topicName, operation) {
        if (solPubSub.session !== null) {
            var requestText = operation;
            var request = solace.SolclientFactory.createMessage();
            solPubSub.log('Sending request "' + requestText + '" to topic "' + topicName + '"...');
            request.setDestination(solace.SolclientFactory.createTopicDestination(topicName));
            request.setBinaryAttachment(requestText);
            request.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT);
            try {
                solPubSub.session.sendRequest(
                    request,
                    5000, // 5 seconds timeout for this operation
                    function (session, message) {
                        solPubSub.replyReceivedCb(session, message);
                    },
                    function (session, event) {
                        solPubSub.requestFailedCb(session, event);
                    },
                    null // not providing correlation object
                );
            } catch (error) {
                solPubSub.log(error.toString());
            }
        } else {
            solPubSub.log('Cannot send request because not connected to Solace message router.');
        }
    };

    // Callback for replies
    solPubSub.replyReceivedCb = function (session, message) {
        solPubSub.log('Received reply: "' + message.getBinaryAttachment() + '"' +
            ' details:\n' + message.dump());
        let response = message.getBinaryAttachment();
        if (response === 'SUCCESS') {
            console.log('redirect');
            document.location.href = 'dd-lobby.html';
        } else if (response == 'DUP_NAME') {
            console.log('dup');
            document.getElementById("playerName").classList.add('uk-form-danger');
            UIkit.notification('That name is already taken. Choose another.', {status: 'danger'});
        } else {
            updatePlayers(response);
        }
    };

    // Callback for request failures
    solPubSub.requestFailedCb = function (session, event) {
        solPubSub.log('Request failure: ' + event.toString());
        UIkit.notification('Cannot contact game lobby. Please try again later.', {status: 'danger'});
    };

    // Gracefully disconnects from Solace message router
    solPubSub.disconnect = function () {
        solPubSub.log('Disconnecting from Solace message router...');
        if (solPubSub.session !== null) {
            try {
                solPubSub.session.disconnect();
            } catch (error) {
                solPubSub.log(error.toString());
            }
        } else {
            solPubSub.log('Not connected to Solace message router.');
        }
    };

    return solPubSub;
};