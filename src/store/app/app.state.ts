import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { PortisConnector } from '@web3-react/portis-connector';
import { ChainEnum } from '../../config/chains';
import { WalletEnum } from '../../config/wallets';

export class AppState {
  connectedWallet?: WalletEnum;
  chainId?: ChainEnum;
  connector?: Web3ReactContextInterface['connector'] | PortisConnector;
  account: Web3ReactContextInterface['account'];
  currentBlockNumber?: number;
  provider?: Web3Provider;
  supportedNetworks: ChainEnum[] = [ChainEnum.RSK, ChainEnum.RSK_TESTNET];
  wrongNetworkModal: boolean = false;
  walletNotConnectedModal: boolean = false;
}
