// NOTE: These examples are slightly tongue-in-cheek and take these ideas to a bit of an extreme.
// They also aren't perfect, because JS is a multi-paradigm language.Í

const prompt = require('prompt-sync')();
import * as readline from 'readline/promises';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// === Object-Oriented ===
// Main takeaways: Fully encapsulated state. Objects that self-mutate and do not permit outside access except through child functions (methods).
// Incredible verbosity, incredible organization and modularity.
// For example, this file seems over-engineered. But since the line-checking logic is all but decoupled from the game, in the future
// we can create Tic-Tac-Toe variants that use different arbitrary lines, or even extend the base class to override the win conditions easily.
// By attaching serialize methods to these objects, they can also be transmitted as data readily and reconstructed on the other side.
class LineEqualityChecker {

  _cellsToCheck: number[];

  constructor(line: number[]) {
    if (line.length !== 3) {
      throw new Error(`Illegal constructor call. Expected length 3, got ${line.length}.`);
    }
    this._cellsToCheck = [...line];
  }

  // Check a board's line for equality
  check(board: TicTacToeBoard): string {
    if (board.getCell(this.getCellToCheck(0)) === board.getCell(this.getCellToCheck(1))
        && board.getCell(this.getCellToCheck(1)) === board.getCell(this.getCellToCheck(2))
    ) {
      return board.getCell(this._cellsToCheck[0]);
    } else {
      return '.';
    }
  }

  getCellToCheck(i: number): number {
    return this._cellsToCheck[i];
  }
}

class BoardLineEqualityChecker {  

  _lineEqualityCheckers: LineEqualityChecker[]

  constructor(checkers: LineEqualityChecker[]) {
    this._lineEqualityCheckers = [...checkers];
  }

  static Default () {
    return new BoardLineEqualityChecker([
      new LineEqualityChecker([0, 1, 2]), new LineEqualityChecker([3, 4, 5]),
      new LineEqualityChecker([6, 7, 8]), new LineEqualityChecker([0, 3, 6]),
      new LineEqualityChecker([1, 4, 7]), new LineEqualityChecker([2, 5, 8]),
      new LineEqualityChecker([0, 4, 8]), new LineEqualityChecker([2, 4, 6])
    ]);
  }

  getLineEqualityCheckers() {
    return this._lineEqualityCheckers;
  }

  // Check a board and return a winner or '.'
  checkBoard(board: TicTacToeBoard): string {
    const checkers = this.getLineEqualityCheckers();
    for (let i = 0; i < checkers.length; i++) {
      const result = checkers[i].check(board);
      if (result !== '.') {
        return result;
      }
    }
    return '.';
  }

}

class TicTacToeBoard {

  _cells: Array<string>

  // Generic constructor
  constructor(cells: string[]) {
    if (cells.length !== 9) {
      throw new Error(`Illegal constructor call. Expected length 9, got ${cells.length}.`);
    }
    this._cells = [...cells];
  }

  // Create a board with default values
  static Default(): TicTacToeBoard {
    return new TicTacToeBoard(Array(9).fill('.'));
  }

  // Return boolean indicating success
  setCell(cellIndex: number, newValue: string): boolean {
    if (this.getCell(cellIndex) !== '.') {
      return false;
    }
    this._cells[cellIndex] = newValue;
    return true;
  }

  getCell(cellIndex: number): string {
    return this._cells[cellIndex];
  }

  // Check if the game is tied. (Board is full.)
  checkTie(): boolean {
    for (let i = 0; i < this._cells.length; i++) {
      if (this.getCell(i) === '.') {
        return false;
      }
    }
    return true;
  }

  toString(): string {
    let result = '';
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result += this.getCell(i*3 + j) + ' ';
      }
      result += '\n';
    }
    return result;
  }
}

class Game {
  _currentPlayer: string
  _checker: BoardLineEqualityChecker
  _board: TicTacToeBoard

  constructor(board: TicTacToeBoard, checker: BoardLineEqualityChecker) {
    this._currentPlayer = 'x';
    this._checker = checker;
    this._board = board;
  }

  static Default(): Game {
    return new Game(TicTacToeBoard.Default(), BoardLineEqualityChecker.Default());
  }

  getCurrentPlayer(): string {
    return this._currentPlayer;
  }

  setCurrentPlayer(value: string) {
    this._currentPlayer = value;
  }

  toggleCurrentPlayer() {
    this.setCurrentPlayer(this.getCurrentPlayer() === 'x' ? 'o' : 'x');
  }

  getChecker(): BoardLineEqualityChecker {
    return this._checker;
  }

  getBoard(): TicTacToeBoard {
    return this._board;
  }

  // Run the game.
  start() {
    const board = this.getBoard();
    const checker = this.getChecker();

    while (!board.checkTie() && checker.checkBoard(board) === '.') {
      const currentPlayer = this.getCurrentPlayer();
      rl.write(`Player ${currentPlayer} to move.\n`);
      rl.write(board.toString());
      const userInput = prompt('Make a move. (0-8) ');
      const position = parseInt(userInput);
      if (board.setCell(position, this.getCurrentPlayer())) {
        this.toggleCurrentPlayer()
      }
      else {
        rl.write('That is not a valid move.\n');
      }
    }
    if (board.checkTie()) {
      rl.write('The game is a tie.\n');
      return;
    }
    const winner = checker.checkBoard(board);
    rl.write(`The winner is ${winner}.\n`);
  }
}

const main_oop = () => {
  const game = Game.Default();
  game.start();
  process.exit();
}

main_oop();