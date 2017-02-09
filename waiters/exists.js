const {access, constants} = require('fs');

const modeMap = {
  r: constants.R_OK,
  w: constants.W_OK,
  x: constants.X_OK,
};

function getMode(mode) {
  return Array.from(mode).reduce((result, name) => result|(modeMap[name]|0), 0);
}

module.exports = function ({path, mode = '', timeout}) {
  const fsMode = getMode(mode);
  console.log(`Waiting for existing path '${path}' with mode '${mode}' ...`);

  return new Promise((resolve, reject) => {
    access(path, fsMode, error => {
      if (error) {
        return reject();
      }
      console.log(`Path '${path}' with mode '${fsMode}' exists`);
      resolve();
    });
  });
};