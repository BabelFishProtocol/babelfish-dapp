import { BigNumber } from 'ethers';

export function roundBN(bn: BigNumber, digits: number): BigNumber {
  const ten = BigNumber.from('10');
  const da = ten.pow(18 - digits);
  return bn.div(da).mul(da);
}

export function toBN(n: number, digits: number): BigNumber {
  return BigNumber.from(Math.round(n * Math.pow(10, digits)));
}
