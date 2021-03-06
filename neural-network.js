// Send data from opencv to neural network.
var requiredPlatesNumber = 2;
var paramsNumber = 2;
var inputsNumber = paramsNumber + (2 * requiredPlatesNumber * 2)
var lastState;
function getInput(state) {
    // state = {
    //     player: {x: 110, y: 20 },
    //     plates: [
    //         {
    //             x: 10,
    //             y: 50,
    //         },
    //         {}
    //     ],
    //     score: "100",
    //     degree: 30 | 0 | 60,
    //     direct: 1 | 0
    // }

    if (lastState != null && lastState.player.y < state.player.y) {
        state.direct = -1
    } else {
        state.direct = +1;
    }

    state.plates.forEach(function (plate) {
        plate.x = plate.x - state.player.x;
        plate.y = plate.y - state.player.y;
    });


    var input = [];
    state.plates = state.plates.sort(function (a, b) {
        return a.y - b.y;
    });

    for (var i = 0; i < state.plates.length && state.plates[i].y < 0; i++) { }

    for (var j = 0; j < requiredPlatesNumber; j++) {
        if (state.plates[i + j] != null) {
            input[j * 4] = state.plates[i + j].x;
            input[j * 4 + 1] = state.plates[i + j].y;
        } else {
            input[j * 4] = 999;
            input[j * 4 + 1] = 999;
        }

        if (state.plates[i - j - 1] != null) {
            input[j * 4 + 2] = state.plates[i - j - 1].x;
            input[j * 4 + 3] = state.plates[i - j - 1].y;
        } else {
            input[j * 4 + 2] = -999;
            input[j * 4 + 3] = -999;
        }

    }

  //  input[inputsNumber - 2] = state.degree || 0;
   // input[inputsNumber - 1] = state.direct || 1;

    return input;
}

function getOutput(state) {
    if (state.degree == -30) {
        return [1, 0, 0]
    }
    if (state.degree == 0) {
        return [0, 1, 0]
    }
    if (state.degree == 30) {
        return [0, 0, 1]
    }
}

var brain = require('brain.js');
var net = new brain.NeuralNetwork();

var send = function (state) {
    console.log("send to neural network: " + JSON.stringify(state));
    var input = getInput(state);

    // if (state.score > lastState.score) {
    //     net.train([{input: getInput(lastState), output: getOutput(state)}]);
    // }

    //var output = net.run(input);

    lastState = state;

    var out;
    console.log("state.direct: " + state.direct);
    console.log("inputs: " + input);
    if (state.direct > 0) {
         if (input[0] > 30) {
            out = 30;
         } else if (input[0] > 0) {
            out = 0;
         } else {
            out = -30;
        }
    } else {
        if (input[2] > 30) {
             out = 30;
        } else if (input[2] > 0) {
            out = 0;
        } else {
            out = -30;
        }
    }
    console.log("out:" + out);
    return out;

    // if (output[0] > output[1] && output[0] > output[2]) {
    //     return -30;
    // }
    // if (output[1] > output[2] && output[1] > output[0]) {
    //     return 0;
    // }

    // return 30;
};

module.exports = {
    send: send
};
