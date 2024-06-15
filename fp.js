"use strict";
// NOTE: These examples are slightly tongue-in-cheek and take these ideas to a bit of an extreme.
// They also aren't perfect, because JS is a multi-paradigm language.
Object.defineProperty(exports, "__esModule", { value: true });
var prompt = require('prompt-sync')();
var readline = require("readline/promises");
var rl = readline.createInterface({ input: process.stdin, output: process.stdout });
var lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
// Converts a board to a formatted string
var boardToString = function (board) {
    return Array(3).fill(0).map(function (x, i) { return board[x + i]; }).join(' ').concat('\n')
        .concat((Array(3).fill(3).map(function (x, i) { return board[x + i]; })).join(' ')).concat('\n')
        .concat((Array(3).fill(6).map(function (x, i) { return board[x + i]; })).join(' '));
};
// Impure function; uses I/O
var computeStep = function (game) {
    rl.write("Player ".concat(game.currentPlayer, " to move.\n"));
    rl.write(boardToString(game.board));
    rl.write('\n');
    var position = parseInt(prompt('Make a move. (0-8) '));
    if (game.board[position] !== '.') {
        rl.write('Invalid position.\n');
        return game;
    }
    return {
        board: game.board.map(function (x, i) { return i === position ? game.currentPlayer : x; }),
        currentPlayer: game.currentPlayer === 'x' ? 'o' : 'x'
    };
};
// Finds a line that matches or returns undefined
var matchingLine = function (board) {
    return lines.find(function (line) {
        return line.reduce(function (curr, prev) {
            return board[curr] === board[prev] ? curr : -1;
        }) !== -1;
    });
};
// Returns 'x' or 'o' if a line matches and isn't '.', undefined otherwise
var evaluateLines = function (board) {
    return !matchingLine(board)
        ? undefined
        : board[matchingLine(board)[0]] !== '.'
            ? board[matchingLine(board)[0]]
            : undefined;
};
// Returns 't' if tied, 'x', 'o', or undefined otherwise
var evaluateWinState = function (game) {
    return !game.board.some(function (cell) { return cell === '.'; })
        ? 't'
        : evaluateLines(game.board);
};
var gameLoop = function (game) {
    return evaluateWinState(game)
        || gameLoop(computeStep(game));
};
// Impure for I/O
var main_fp = function () {
    var board = Array(9).fill('.');
    var currentPlayer = 'x';
    var game = { board: board, currentPlayer: currentPlayer };
    var gameResult = gameLoop(game);
    if (gameResult == 't') {
        console.log('Game is a tie.');
    }
    else {
        console.log("Winner is player ".concat(gameResult, "."));
    }
    process.exit();
};
main_fp();
