import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { Vesting__factory } from '../../contracts/types/factories/Vesting__factory';

export const getVesting = (address: string, provider: Web3Provider) =>
  Vesting__factory.connect(address, provider);
