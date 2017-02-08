const { createConnection } = require('net');

module.exports = function ({ address = 'localhost'}) {
  console.log(`Connecting to ${address}...`);
  const [hostname = 'localhost', port = 80] = address.split(':');

  return new Promise((resolve, reject) => {
    createConnection(parseInt(port), hostname, () => setTimeout(resolve, 3000))
      .on('data', resolve)
      .on('close', reject)
      .on('error', reject)
      .unref();
  }).then(() => console.log(`Successfully connected to ${address}`));
};