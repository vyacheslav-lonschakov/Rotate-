var express = require('express')
var fileServer = require('./file-server.js')
var fileHandler = require('./file-handler.js')
var neuralNetwork = require('./neural-network.js')
var dataSender = require('./data-sender.js')

var FILE_SERVER_PORT = 8080;

dataSender.init().then(function() {
    fileServer(FILE_SERVER_PORT, function onFileRecieved(url) {
        // Send screenshot to opencv.
        var getDataPromise = fileHandler.handle(url);

        getDataPromise.then(function(data) {
            // Send opencv data to neural network.
            var result = neuralNetwork.send(data);

            if (typeof (result) != "number") {
                console.log("result is not a number.");
            }

            // Send neural network data to arduino.
            dataSender.send(result);
        })
    });
});
