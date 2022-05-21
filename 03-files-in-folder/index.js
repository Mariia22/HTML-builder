const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');
const bytesToKb = 1024;

const dir = path.join(__dirname, './secret-folder');
(async function (pathToDir) {
  try {
    const files = await readdir(pathToDir, { encoding: 'utf-8', withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const name = path.basename(file.name).split('.')[0];
        const ext = path.extname(file.name).replace(/\./g, '');
        fs.stat(path.join(__dirname, './secret-folder', file.name), (err, stats) => {
          try {
            if (err) throw err;
            const size = (stats.size / bytesToKb).toFixed(3);
            console.log(`${name} - ${ext} - ${size}kB`);
          }
          catch (error) {
            console.log(error);
          }
        });
      }
    }
  }
  catch (error) {
    console.log(error);
  }
})(dir);
