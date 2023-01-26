const bn = require('ethers').BigNumber;
const a = bn.from('7');
const b = bn.from('3');
console.log(a.div(b).toString());
