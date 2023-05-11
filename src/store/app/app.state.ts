import { Web3Provider } from '@ethersproject/providers';
import { ChainEnum } from '../../config/chains';
import { WalletEnum } from '../../config/wallets';
import { XusdLocalTransaction } from '../aggregator/aggregator.state';

type XusdLocalTransactions = {
  [chainId: number]: {
    [account: string]: XusdLocalTransaction[];
  };
};

export class AppState {
  connectedWallet?: WalletEnum;
  chainId?: ChainEnum;
  account: string | undefined = undefined;
  currentBlockNumber?: number;
  provider?: Web3Provider;
  supportedNetworks: ChainEnum[] = [ChainEnum.RSK, ChainEnum.RSK_TESTNET];
  wrongNetworkModal: boolean = false;
  walletNotConnectedModal: boolean = false;
  xusdLocalTransactions: XusdLocalTransactions = {};
  errorMessage: string | undefined = undefined;
}
