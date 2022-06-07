import { Web3Provider } from '@ethersproject/providers';
import { ChainEnum } from '../../config/chains';
import { AppState } from './app.state';

export const appState: AppState = {
  connectedWallet: undefined,
  chainId: ChainEnum.RSK,
  account: '0x0x84e907f6B903A393E14FE549113137CA6483b5ef',
  currentBlockNumber: 123,
  provider: {} as Web3Provider,
  supportedNetworks: [ChainEnum.RSK, ChainEnum.RSK_TESTNET],
  wrongNetworkModal: false,
  walletNotConnectedModal: false,
  errorMessage: undefined,
};
