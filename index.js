const commander = require('commander');
const pkg = require('./package.json');

const tcp = require('./waiters/tcp');
const cmd = require('./waiters/cmd');

function wait(waiter, options) {
  return waiter(options)
    .catch(() => setTimeout(wait, 1000, waiter, options));
}

function sequencer(waiter, targets) {
  if (targets.length === 0) return;
  return wait(waiter, targets[0])
    .then(() => sequencer(waiter, targets.slice(1)));
}

function composer(waiter, targets) {
  return Promise.all(targets.map(target => wait(waiter, target)));
}

function execute(waiter, targets, sequencedExecution) {
  if (sequencedExecution) {
    return sequencer(waiter, targets);
  }
  return composer(waiter, targets);
}

commander
  .version(pkg.version)
  .usage('[options] <command>');

commander
  .command('tcp <address> [...addresses]')
  .description('Wait for url connection')
  .option('-s, --sequenced', 'Next connection waits for complete previous connection')
  .option('-t, --timeout', 'connection timeout seconds', parseInt, 60)
  .action((address, addresses = [], { timeout, sequenced }) => {
    const targets = [address].concat(addresses).map(address => ({address, timeout}));
    return execute(tcp, targets, sequenced);
  });

commander
  .command('cmd <command> [...commands]')
  .description('Wait for command complete')
  .option('-r, --retry', 'retry on non zero exit code')
  .option('-s, --sequenced', 'next command waits for complete previous command')
  .option('-t, --timeout', 'connection timeout seconds', parseInt, 60)
  .action((command, commands = [], { timeout, retry, sequenced }) => {
    const targets = [command].concat(commands).map(command => ({command, retry, timeout}));
    return execute(cmd, targets, sequenced);
  });

commander
  .command('sleep <seconds>')
  .description('Wait for timeout complete', parseInt, 10)
  .action((seconds) => setTimeout(() => {}, seconds));


commander.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ wait tcp google.com:443');
  console.log('    $ wait cmd wget https://google.com');
  console.log('    $ wait sleep 20');
  console.log('');
});


commander.parse(process.argv);