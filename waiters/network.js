import { networkInterfaces } from 'node:os';

export function network({ iface, ifaceExpr, macExpr, netMaskExpr, isInternal = null }) {
  console.log(`Waiting for network interface '${iface}'...`);

  return new Promise((resolve, reject) => {
    const interfaces = networkInterfaces();
    const found = Object.keys(interfaces).find(name => {
      return ifaceExpr.test(name) && interfaces[name].some(({ mac, netmask, internal }) =>
        macExpr.test(mac) &&
        netMaskExpr.test(netmask) &&
        (isInternal === null || !!isInternal === internal)
      );
    });
    if (found) {
      console.log(`Network interface '${found}' is connected`);
      return resolve();
    }
    setTimeout(reject, 3000);
  });
}
