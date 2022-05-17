const path = require('path');
const fs = require('fs');
const { stdout } = process;

const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
let data = '';
readStream.on('data', chunk => data += chunk);
readStream.on('end', () => stdout.write(data));