import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { WalletEnum } from '../../config/wallets';

export class AppState {
  connectedWallet?: WalletEnum;
  chainId?: Web3ReactContextInterface['chainId'];
  account: Web3ReactContextInterface['account'];
  currentBlockNumber?: number;
  provider?: Web3Provider;
}
