const { readdir, mkdir, copyFile, unlink } = require('fs/promises');
const path = require('path');

const pathToDest = path.join(__dirname, './files-copy');
const pathToSource = path.join(__dirname, './files');

mkdir(pathToDest, { recursive: true }, (error) => {
  try {
    if (error) throw error;
  }
  catch (error) {
    console.log(error);
  }
});

(async function copyFiles() {
  const filesDest = await readdir(pathToDest, { encoding: 'utf-8', withFileTypes: true });
  filesDest.forEach((file) =>
    unlink(`${pathToDest}/${file.name}`, error => {
      try {
        if (error) throw error;
      }
      catch (error) {
        console.log(error);
      }
    }));
  const files = await readdir(pathToSource, { encoding: 'utf-8', withFileTypes: true });
  files.forEach((file) => copyFile(`${pathToSource}/${file.name}`, `${pathToDest}/${file.name}`, 0, (error) => {
    try {
      if (error) throw error;
    }
    catch (error) {
      console.log(error);
    }
  }));
})();
console.log('Files were copied!');