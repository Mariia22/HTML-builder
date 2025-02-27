const { mkdir, readdir, unlink, copyFile, writeFile } = require('fs/promises');
const fs = require('fs');
const path = require('path');

const pathToDest = path.join(__dirname, './project-dist');
const pathToSource = path.join(__dirname);
const pathToComponents = path.join(__dirname, './components');
const pathToStyles = path.join(__dirname, './styles');
const pathToAssets = path.join(__dirname, './assets');
const pathToDestAssets = path.join(__dirname, './project-dist', './assets');
const extensionTemplate = '.html';
const extensionStyle = '.css';

async function createFolder(path) {
  mkdir(path, { recursive: true }, (error) => {
    try {
      if (error) throw error;
    }
    catch (error) {
      console.log(error);
    }
  });
}

async function deleteFiles(path) {
  const arr = await readdir(path, { encoding: 'utf-8', withFileTypes: true });
  if (arr.length !== 0) {
    arr.forEach((file) => {
      if (file.isFile()) {
        unlink(`${path}/${file.name}`, error => {
          try {
            if (error) throw error;
          }
          catch (error) {
            console.log(error);
          }
        });
      }
      else {
        deleteFiles(path + '/' + file.name);
      }
    });
  }
}

const readFileAsync = async (path) => {
  return new Promise((resolve, reject) => fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      return reject(err.message);
    }
    resolve(data);
  }));
};

const writeFileAsync = async (path, data) => {
  return new Promise((resolve, reject) => writeFile(path, data, (err) => {
    if (err) {
      return reject(err.message);
    }
    resolve();
  }));
};

const openFileForWriting = (file) => {
  fs.open(file, 'w', (error) => {
    if (error) throw error;
  });
};

const copyFiles = async (files, name) => {
  if (Array.isArray(files)) {
    files.forEach((file) => copyFile(`${pathToAssets}/${name}/${file.name}`, `${pathToDestAssets}/${name}/${file.name}`, 0, (error) => {
      try {
        if (error) throw error;
      }
      catch (error) {
        console.log(error);
      }
    }));
  }
  else {
    copyFile(`${pathToAssets}/${files}`, `${pathToDestAssets}/${files}`, 0, (error) => {
      try {
        if (error) throw error;
      }
      catch (error) {
        console.log(error);
      }
    });
  }
};

(async function bundleWeb() {
  await createFolder(pathToDest);
  await deleteFiles(pathToDest);
  const bundleHTML = path.join(__dirname, './project-dist', 'index.html');
  const bundleCSS = path.join(__dirname, './project-dist', 'style.css');
  await createFolder(pathToDestAssets);

  const files = await readdir(pathToSource, { encoding: 'utf-8', withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === extensionTemplate) {
      openFileForWriting(bundleHTML);
      const templateStream = fs.createReadStream(path.join(__dirname, file.name), 'utf-8');
      let data = '';
      templateStream.on('data', chunk => data += chunk);
      templateStream.on('end', () => {
        const arrRegEx = data.match(/\{{([^}]+)\}}/g);
        for (const item of arrRegEx) {
          readFileAsync(`${pathToComponents}/${item.slice(2, -2)}${extensionTemplate}`)
            .then((result) => data = data.replace(item, result))
            .then((data) => writeFileAsync(bundleHTML, data))
            .catch(error => console.log(error));
        }
      });
    }
    else if (file.isDirectory() && file.name === 'styles') {
      const filesCSS = await readdir(pathToStyles, { encoding: 'utf-8', withFileTypes: true });
      openFileForWriting(bundleCSS);
      const resultCSSArr = [];
      for (const fileCSS of filesCSS) {
        if (fileCSS.isFile() && path.extname(fileCSS.name) === extensionStyle) {
          readFileAsync(`${pathToStyles}/${fileCSS.name}`)
            .then(data => { resultCSSArr.push(data); })
            .then(() => writeFileAsync(bundleCSS, resultCSSArr.join('\n')))
            .catch((err) => console.log(err));
        }
      }
    }
    else if (file.isDirectory() && file.name === 'assets') {
      const filesAssets = await readdir(pathToAssets, { encoding: 'utf-8', withFileTypes: true });
      for (let asset of filesAssets) {
        if (asset.isDirectory()) {
          await createFolder(path.join(__dirname, './project-dist', './assets', asset.name));
          const files = await readdir(path.join(__dirname, './assets', asset.name), { encoding: 'utf-8', withFileTypes: true });
          copyFiles(files, asset.name);
        }
        else {
          copyFiles(asset.name);
        }
      }
    }
  }
})();

