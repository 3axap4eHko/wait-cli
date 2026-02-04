import { createConnection } from 'node:net';

export function tcp({ address = 'localhost:80' }) {
  const [hostname, port = '80'] = address.split(':');
  console.log(`Connecting to ${hostname}:${port}...`);

  return new Promise((resolve, reject) => {
    const socket = createConnection(parseInt(port, 10), hostname);
    socket.once('connect', () => {
      socket.destroy();
      resolve();
    });
    socket.once('error', reject);
    socket.unref();
  }).then(() => console.log(`Successfully connected to ${address}`));
}
