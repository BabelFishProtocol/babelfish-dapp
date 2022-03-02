import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';

export class AppState {
  chainId?: Web3ReactContextInterface['chainId'];
  account: Web3ReactContextInterface['account'];
  currentBlockNumber?: number;
  provider?: Web3Provider;
}
