const fs = require('fs');
const globModule = require('glob');
const { promisify } = require('util');

const access = promisify(fs.access);
const glob = promisify(globModule);

const modeMap = {
  r: fs.constants.R_OK,
  w: fs.constants.W_OK,
  x: fs.constants.X_OK,
};

function getMode(mode) {
  return Array.from(mode).reduce((result, name) => result | (modeMap[name] | 0), 0);
}

module.exports = async function ({ path, mode = '', timeout }) {
  const fsMode = getMode(mode);
  console.log(`Waiting for existing path '${path}' with mode '${mode}' ...`);
  const filenames = await glob(path);
  const filename = filenames.find(filename => filename);
  if (filename) {
    await access(filename, fsMode);
    console.log(`Path '${path}' with mode '${fsMode}' exists`);
    return null;
  }
  throw new Error();
};