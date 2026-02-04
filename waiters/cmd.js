import { exec } from 'node:child_process';

export async function cmd({ command, retry, timeout = 60 }) {
  console.log(`Waiting for execution '$ ${command}'...`);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), timeout * 1000);
    exec(command)
      .on('exit', code => {
        clearTimeout(timer);
        if (code === 0 || !retry) {
          console.log(`Execution '$ ${command}' completed`);
          return resolve();
        }
        reject(new Error(`Command exited with code ${code}`));
      });
  });
}
