const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');

const pathToSource = path.join(__dirname, './styles');
const extension = '.css';
const resultArray = [];

const readFileAsync = async (path) => {
  return new Promise((resolve, reject) => fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      return reject(err.message);
    }
    resolve(data);
  }));
};

const writeFileAsync = async (path, data) => {
  return new Promise((resolve, reject) => fs.writeFile(path, data, (err) => {
    if (err) {
      return reject(err.message);
    }
    resolve();
  }));
};

(async function grabDataFromStyles() {
  const files = await readdir(pathToSource, { encoding: 'utf-8', withFileTypes: true });
  const bundle = path.join(__dirname, './project-dist', 'bundle.css');
  fs.open(bundle, 'w', (error) => {
    if (error) throw error;
  });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === extension) {
      readFileAsync(`${pathToSource}/${file.name}`)
        .then(data => resultArray.push(data))
        .then(() => writeFileAsync(bundle, resultArray.join('\n')))
        .catch((err) => console.log(err));
    }
  }
})();