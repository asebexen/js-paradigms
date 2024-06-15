// NOTE: These examples are slightly tongue-in-cheek and take these ideas to a bit of an extreme.
// They also aren't perfect, because JS is a multi-paradigm language.

const prompt = require('prompt-sync')();
import * as readline from 'readline/promises';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// === Imperative / Procedural ===
// Key points: Direct mutation of state. Issuing direct commands.
// Short, sweet, to the point. Has issues with scaling and code reusability.
const main_ip = () => {
  let board0 = ['.', '.', '.', '.', '.', '.', '.', '.', '.'];
  let currentPlayer = 'x';
  let lastAnswer = '.'

  // Game loop
  while (true) {
    // Print game state
    rl.write(`Player ${currentPlayer} to move.\n` );
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        rl.write(`${board0[i*3 + j]} `);
      }
      rl.write('\n');
    }

    // Prompt for move
    lastAnswer = prompt('Make a move. (0-8)');
    let lastPosition = parseInt(lastAnswer);

    // Check if inputted space empty
    if (board0[lastPosition] !== '.') {
      rl.write('That is not a valid space.\n');
    }
    else {
      board0[lastPosition] = currentPlayer;
      // Check for win
      if (
        (board0[0] !== '.' && board0[0] === board0[1] && board0[1] === board0[2])
          || (board0[3] !== '.' && board0[3] === board0[4] && board0[4] === board0[5])
          || (board0[6] !== '.' && board0[6] === board0[7] && board0[7] === board0[8])
          || (board0[0] !== '.' && board0[0] === board0[3] && board0[3] === board0[6])
          || (board0[1] !== '.' && board0[1] === board0[4] && board0[4] === board0[7])
          || (board0[2] !== '.' && board0[2] === board0[5] && board0[5] === board0[8])
          || (board0[0] !== '.' && board0[0] === board0[4] && board0[4] === board0[8])
          || (board0[2] !== '.' && board0[2] === board0[4] && board0[4] === board0[6])
      ) {
        rl.write(`Player ${currentPlayer} wins.`);
        break;  // End game loop.
      }
      // Check for tie
      let isTie = true;
      for (let i = 0; i <= 8; i++) {
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
}

main_ip();