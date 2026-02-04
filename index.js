import { Command } from 'commander';
import pkg from './package.json' with { type: 'json' };

import { tcp } from './waiters/tcp.js';
import { cmd } from './waiters/cmd.js';
import { exists } from './waiters/exists.js';
import { network } from './waiters/network.js';

function wait(waiter, options) {
  return waiter(options)
    .catch(() => new Promise(resolve => setTimeout(resolve, 1000)).then(() => wait(waiter, options)));
}

function negate(waiter) {
  return (...args) => waiter(...args)
    .then(() => {throw new Error()}, () => {});
}

function sequencer(waiter, targets) {
  if (targets.length === 0) return;
  return wait(waiter, targets[0])
    .then(() => sequencer(waiter, targets.slice(1)));
}

function composer(waiter, targets) {
  return Promise.all(targets.map(target => wait(waiter, target)));
}

function execute(waiter, targets, sequencedExecution, not) {
  if (not) {
    waiter = negate(waiter);
  }
  if (sequencedExecution) {
    return sequencer(waiter, targets);
  }
  return composer(waiter, targets);
}

function maskToRegexp(mask) {
  return mask.replace(/[-[\]{}().,\\^$|#\s]/g, '\\$&').replace(/([*+?])/g,'.$1');
}

const commander = new Command();

commander
  .version(pkg.version)
  .usage('[options] <command>');

commander
  .command('tcp <address> [...addresses]')
  .description('Wait for address(es) connection')
  .option('-s, --sequenced', 'Next connection waits for complete previous connection')
  .option('-t, --timeout <seconds>', 'connection timeout in seconds', 60)
  .option('--not', 'condition negation')
  .action((address, addresses = [], { timeout, sequenced, not }) => {
    const targets = [address].concat(addresses).map(address => ({ address, timeout }));
    return execute(tcp, targets, sequenced, not);
  });

commander
  .command('cmd <command> [...commands]')
  .description('Wait for command(s) complete')
  .option('-r, --retry', 'retry on non zero exit code')
  .option('-s, --sequenced', 'next command waits for complete previous command')
  .option('-t, --timeout <seconds>', 'connection timeout in seconds', 60)
  .option('--not', 'condition negation')
  .action((command, commands = [], { timeout, retry, sequenced, not }) => {
    const targets = [command].concat(commands).map(command => ({ command, retry, timeout }));
    return execute(cmd, targets, sequenced, not);
  });

commander
  .command('exists <path> [...paths]')
  .description('Wait for existing path(s)')
  .option('-s, --sequenced', 'next existing check waits for complete previous existing check')
  .option('-m, --mode <mode>', 'check for access mode (rwx)')
  .option('-t, --timeout <seconds>', 'connection timeout in seconds', 60)
  .option('--not', 'condition negation')
  .action((path, paths = [], { timeout, sequenced, mode = '', not }) => {
    const targets = [path].concat(paths).map(path => ({ path, timeout, mode }));
    return execute(exists, targets, sequenced, not);
  });

commander
  .command('network')
  .description('Wait for network interface(s)')
  .option('-f, --iface <iface>', 'interface mask')
  .option('-m, --mac <mac>', 'interface mac address mask')
  .option('-n, --net-mask <net mask>', 'net mask')
  .option('-i, --internal', 'is internal interface')
  .option('-t, --timeout <seconds>', 'connection timeout in seconds', 60)
  .option('--not', 'condition negation')
  .action(({ iface = '*', mac = '*', netMask = '*', internal: isInternal, not }) => {
    const ifaceExpr = new RegExp(maskToRegexp(iface));
    const macExpr = new RegExp(maskToRegexp(mac));
    const netMaskExpr = new RegExp(maskToRegexp(netMask));
    const waiter = not ? negate(network) : network;
    return wait(waiter, { iface, ifaceExpr, macExpr, netMaskExpr, isInternal });
  });

commander
  .command('timeout <seconds>')
  .description('Wait for specified seconds')
  .action((seconds) => {
    const ms = parseInt(seconds, 10) * 1000;
    setTimeout(() => {
      console.log(`Awaiting for ${seconds} seconds completed`);
    }, ms);
  });


commander.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ await tcp google.com:443');
  console.log('    $ await cmd wget https://google.com');
  console.log('    $ await exists /var/process.pid');
  console.log('    $ await timeout 20');
  console.log('');
});


commander.parse(process.argv);
