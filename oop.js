"use strict";
// NOTE: These examples are slightly tongue-in-cheek and take these ideas to a bit of an extreme.
// They also aren't perfect, because JS is a multi-paradigm language.Í
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var prompt = require('prompt-sync')();
var readline = require("readline/promises");
var rl = readline.createInterface({ input: process.stdin, output: process.stdout });
// === Object-Oriented ===
// Main takeaways: Fully encapsulated state. Objects that self-mutate and do not permit outside access except through child functions (methods).
// Incredible verbosity, incredible organization and modularity.
// For example, this file seems over-engineered. But since the line-checking logic is all but decoupled from the game, in the future
// we can create Tic-Tac-Toe variants that use different arbitrary lines, or even extend the base class to override the win conditions easily.
// By attaching serialize methods to these objects, they can also be transmitted as data readily and reconstructed on the other side.
var LineEqualityChecker = /** @class */ (function () {
    function LineEqualityChecker(line) {
        if (line.length !== 3) {
            throw new Error("Illegal constructor call. Expected length 3, got ".concat(line.length, "."));
        }
        this._cellsToCheck = __spreadArray([], line, true);
    }
    // Check a board's line for equality
    LineEqualityChecker.prototype.check = function (board) {
        if (board.getCell(this.getCellToCheck(0)) === board.getCell(this.getCellToCheck(1))
            && board.getCell(this.getCellToCheck(1)) === board.getCell(this.getCellToCheck(2))) {
            return board.getCell(this._cellsToCheck[0]);
        }
        else {
            return '.';
        }
    };
    LineEqualityChecker.prototype.getCellToCheck = function (i) {
        return this._cellsToCheck[i];
    };
    return LineEqualityChecker;
}());
var BoardLineEqualityChecker = /** @class */ (function () {
    function BoardLineEqualityChecker(checkers) {
        this._lineEqualityCheckers = __spreadArray([], checkers, true);
    }
    BoardLineEqualityChecker.Default = function () {
        return new BoardLineEqualityChecker([
            new LineEqualityChecker([0, 1, 2]), new LineEqualityChecker([3, 4, 5]),
            new LineEqualityChecker([6, 7, 8]), new LineEqualityChecker([0, 3, 6]),
            new LineEqualityChecker([1, 4, 7]), new LineEqualityChecker([2, 5, 8]),
            new LineEqualityChecker([0, 4, 8]), new LineEqualityChecker([2, 4, 6])
        ]);
    };
    BoardLineEqualityChecker.prototype.getLineEqualityCheckers = function () {
        return this._lineEqualityCheckers;
    };
    // Check a board and return a winner or '.'
    BoardLineEqualityChecker.prototype.checkBoard = function (board) {
        var checkers = this.getLineEqualityCheckers();
        for (var i = 0; i < checkers.length; i++) {
            var result = checkers[i].check(board);
            if (result !== '.') {
                return result;
            }
        }
        return '.';
    };
    return BoardLineEqualityChecker;
}());
var TicTacToeBoard = /** @class */ (function () {
    // Generic constructor
    function TicTacToeBoard(cells) {
        if (cells.length !== 9) {
            throw new Error("Illegal constructor call. Expected length 9, got ".concat(cells.length, "."));
        }
        this._cells = __spreadArray([], cells, true);
    }
    // Create a board with default values
    TicTacToeBoard.Default = function () {
        return new TicTacToeBoard(Array(9).fill('.'));
    };
    // Return boolean indicating success
    TicTacToeBoard.prototype.setCell = function (cellIndex, newValue) {
        if (this.getCell(cellIndex) !== '.') {
            return false;
        }
        this._cells[cellIndex] = newValue;
        return true;
    };
    TicTacToeBoard.prototype.getCell = function (cellIndex) {
        return this._cells[cellIndex];
    };
    // Check if the game is tied. (Board is full.)
    TicTacToeBoard.prototype.checkTie = function () {
        for (var i = 0; i < this._cells.length; i++) {
            if (this.getCell(i) === '.') {
                return false;
            }
        }
        return true;
    };
    TicTacToeBoard.prototype.toString = function () {
        var result = '';
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                result += this.getCell(i * 3 + j) + ' ';
            }
            result += '\n';
        }
        return result;
    };
    return TicTacToeBoard;
}());
var Game = /** @class */ (function () {
    function Game(board, checker) {
        this._currentPlayer = 'x';
        this._checker = checker;
        this._board = board;
    }
    Game.Default = function () {
        return new Game(TicTacToeBoard.Default(), BoardLineEqualityChecker.Default());
    };
    Game.prototype.getCurrentPlayer = function () {
        return this._currentPlayer;
    };
    Game.prototype.setCurrentPlayer = function (value) {
        this._currentPlayer = value;
    };
    Game.prototype.toggleCurrentPlayer = function () {
        this.setCurrentPlayer(this.getCurrentPlayer() === 'x' ? 'o' : 'x');
    };
    Game.prototype.getChecker = function () {
        return this._checker;
    };
    Game.prototype.getBoard = function () {
        return this._board;
    };
    // Run the game.
    Game.prototype.start = function () {
        var board = this.getBoard();
        var checker = this.getChecker();
        while (!board.checkTie() && checker.checkBoard(board) === '.') {
            var currentPlayer = this.getCurrentPlayer();
            rl.write("Player ".concat(currentPlayer, " to move.\n"));
            rl.write(board.toString());
            var userInput = prompt('Make a move. (0-8) ');
            var position = parseInt(userInput);
            if (board.getCell(position) !== '.') {
                rl.write('That is not a valid space.\n');
            }
            else {
                board.setCell(position, currentPlayer);
                this.toggleCurrentPlayer();
            }
        }
        if (board.checkTie()) {
            rl.write('The game is a tie.\n');
            return;
        }
        var winner = checker.checkBoard(board);
        rl.write("The winner is ".concat(winner, ".\n"));
    };
    return Game;
}());
var main_oop = function () {
    var game = Game.Default();
    game.start();
};
main_oop();
