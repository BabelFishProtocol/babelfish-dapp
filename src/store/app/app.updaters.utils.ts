import { injectedConnector } from '../../config/providers';
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
      return WalletEnum.Metamask;
    }

    // if (ethereum.isPortis && connector === portisConnector) {
    //   return WalletEnum.Portis;
    // }
  }
};
