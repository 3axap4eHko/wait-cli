const {exec} = require('child_process');

module.exports = function ({command, retry, timeout}) {
  console.log(`Waiting for execution '$ ${command}'...`);
  return new Promise((resolve, reject) => {
    exec(command)
      .on('exit', code => {
        if (code === 0 || !retry) {
          console.log(`Execution '$ ${command}' completed`);
          return resolve();
        }
        reject();
      });
  });
};