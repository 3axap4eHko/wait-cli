const { networkInterfaces } = require('os');

module.exports = function ({ iface, ifaceExpr, timeout, macMask, macExpr, netMask, netMaskExpr, isInternal = null }) {
  console.log(`Waiting for network interface ${iface} connection ...`);

  return new Promise((resolve, reject) => {
    const interfacesData = networkInterfaces();
    const interfaceName = Object.keys(interfacesData)
      .find(name => {
        return ifaceExpr.test(name) && interfacesData[name].some(({ mac, netmask, internal }) =>
            macExpr.test(mac) &&
            netMaskExpr.test(netmask) &&
            (isInternal === null || !!isInternal === internal)
        );
      });
    if (interfaceName) {
      console.log(`Network interface ${interfaceName} is connected`);
      return resolve();
    }
    setTimeout(reject, 3000);
  });
};