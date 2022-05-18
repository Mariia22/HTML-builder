const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;
const readline = require('readline');

const pathFile = path.join(__dirname, 'destination.txt');

function closeFile(readLine, message) {
  readLine.close();
  stdout.write(message);
}

fs.open(pathFile, 'w', (err) => {
  if (err) throw err;
});
stdout.write('Hello!!! Please, write your message\n');
let rl = readline.createInterface(stdin, stdout);
rl.on('line', (line) => {
  if (line === 'exit') {
    closeFile(rl, 'Bye-bye!');
  }
  else {
    fs.appendFile(pathFile, line.trim() + '\n', (err) => {
      if (err) throw err;
    });
  }
});
rl.on('SIGINT', () => {
  closeFile(rl, 'Bye-bye!');
});