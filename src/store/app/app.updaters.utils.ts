import { injectedConnector, portisConnector } from '../../config/providers';
import { WalletEnum } from '../../config/wallets';
import { Web3Data } from '../../hooks/useActiveWeb3React';

export const getWalletName = (connector: Web3Data['connector']) => {
  if ('ethereum' in window) {
    // @ts-ignore
    const { ethereum } = window;
    const isMetaMask = !!(ethereum && ethereum.isMetaMask);

    if (isMetaMask && connector === injectedConnector) {
      if (ethereum.isLiquality) {
        return WalletEnum.Liquality;
      }
      if (ethereum.isNiftyWallet) {
        return WalletEnum.Nifty;
      }
      return WalletEnum.Metamask;
    }

    if (connector === portisConnector) {
      return WalletEnum.Portis;
    }
  }
};
