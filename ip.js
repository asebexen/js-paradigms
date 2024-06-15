"use strict";
// NOTE: These examples are slightly tongue-in-cheek and take these ideas to a bit of an extreme.
// They also aren't perfect, because JS is a multi-paradigm language.
Object.defineProperty(exports, "__esModule", { value: true });
var prompt = require('prompt-sync')();
var readline = require("readline/promises");
var rl = readline.createInterface({ input: process.stdin, output: process.stdout });
// === Imperative / Procedural ===
// Key points: Direct mutation of state. Issuing direct commands.
// Short, sweet, to the point. Has issues with scaling and code reusability.
var main_ip = function () {
    var board0 = ['.', '.', '.', '.', '.', '.', '.', '.', '.'];
    var currentPlayer = 'x';
    var lastAnswer = '.';
    // Game loop
    while (true) {
        // Print game state
        rl.write("Player ".concat(currentPlayer, " to move.\n"));
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                rl.write("".concat(board0[i * 3 + j], " "));
            }
            rl.write('\n');
        }
        // Prompt for move
        lastAnswer = prompt('Make a move. (0-8)');
        var lastPosition = parseInt(lastAnswer);
        // Check if inputted space empty
        if (board0[lastPosition] !== '.') {
            rl.write('That is not a valid space.\n');
        }
        else {
            board0[lastPosition] = currentPlayer;
            // Check for win
            if ((board0[0] !== '.' && board0[0] === board0[1] && board0[1] === board0[2])
                || (board0[3] !== '.' && board0[3] === board0[4] && board0[4] === board0[5])
                || (board0[6] !== '.' && board0[6] === board0[7] && board0[7] === board0[8])
                || (board0[0] !== '.' && board0[0] === board0[3] && board0[3] === board0[6])
                || (board0[1] !== '.' && board0[1] === board0[4] && board0[4] === board0[7])
                || (board0[2] !== '.' && board0[2] === board0[5] && board0[5] === board0[8])
                || (board0[0] !== '.' && board0[0] === board0[4] && board0[4] === board0[8])
                || (board0[2] !== '.' && board0[2] === board0[4] && board0[4] === board0[6])) {
                rl.write("Player ".concat(currentPlayer, " wins."));
                break; // End game loop.
            }
            // Check for tie
            var isTie = true;
            for (var i = 0; i <= 8; i++) {
                if (board0[i] === '.') {
                    isTie = false;
                    break;
                }
            }
            if (isTie) {
                rl.write('This game is a tie.');
                break;
            }
            // Toggle player
            if (currentPlayer === 'x') {
                currentPlayer = 'o';
            }
            else {
                currentPlayer = 'x';
            }
        }
    }
    process.exit();
};
main_ip();
