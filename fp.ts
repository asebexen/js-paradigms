// NOTE: These examples are slightly tongue-in-cheek and take these ideas to a bit of an extreme.
// They also aren't perfect, because JS is a multi-paradigm language.

const prompt = require('prompt-sync')();
import * as readline from 'readline/promises';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// === FUNCTIONAL ===
// Main takeaways: No mutation or state. Function chaining.
// Stable, straightforward to debug. Predictable inputs/outputs, little/no reliance on state. Sometimes tricky to read.
// This entire game, minus the impure I/O functions, is essentially one giant function that's broken up for readability.
// In fact, computeStep() could be replaced with an algorithmic source of input, such as AI, to make it a pure function.

interface GameFunctional {
  board: Array<string>
  currentPlayer: string
}

const lines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Converts a board to a formatted string
const boardToString = (board: string[]): string =>
  Array(3).fill(0).map((x, i) => board[x + i]).join(' ').concat('\n')
    .concat((Array(3).fill(3).map((x, i) => board[x + i])).join(' ')).concat('\n')
    .concat((Array(3).fill(6).map((x, i) => board[x + i])).join(' '))

// Impure function; uses I/O
const computeStep = (game: GameFunctional): GameFunctional => {
  rl.write(`Player ${game.currentPlayer} to move.\n`);
  rl.write(boardToString(game.board));
  rl.write('\n');
  const position = parseInt(prompt('Make a move. (0-8) '));
  if (game.board[position] !== '.') {
    rl.write('Invalid position.\n');
    return game;
  }
  return {
    board: game.board.map((x, i) => i === position ? game.currentPlayer : x),
    currentPlayer: game.currentPlayer === 'x' ? 'o' : 'x'
  }
}

// Finds a line that matches or returns undefined
const matchingLine = (board: string[]): number[] | undefined => 
  lines.find(line => 
    line.reduce((curr, prev) =>
      board[curr] === board[prev] ? curr : -1) !== -1
);

// Returns 'x' or 'o' if a line matches and isn't '.', undefined otherwise
const evaluateLines = (board: string[]): string | undefined => 
  !matchingLine(board)
  ? undefined
  : board[matchingLine(board)![0]] !== '.'
  ? board[matchingLine(board)![0]]
  : undefined

// Returns 't' if tied, 'x', 'o', or undefined otherwise
const evaluateWinState = (game: GameFunctional): string | undefined =>
  !game.board.some(cell => cell === '.')
  ? 't'
  : evaluateLines(game.board);

const gameLoop = (game: GameFunctional): string | GameFunctional => 
  evaluateWinState(game) 
  || gameLoop(computeStep(game));

// Impure for I/O
const main_fp = () => {
  const board: Array<string> = Array(9).fill('.');
  const currentPlayer: string = 'x';
  const game: GameFunctional = { board, currentPlayer };
  const gameResult = gameLoop(game);
  if (gameResult == 't') {
    console.log('Game is a tie.');
  }
  else {
    console.log(`Winner is player ${gameResult}.`);
  }
  process.exit();
}

main_fp();