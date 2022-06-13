import { injectedConnector } from '../../config/providers';
import { WalletEnum } from '../../config/wallets';
import { Web3DataWithPortis } from '../../hooks/useActiveWeb3React';
import { isPortis } from '../../utils/types';

export const getWalletName = (connector: Web3DataWithPortis['connector']) => {
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
  }
  if (connector && isPortis(connector)) {
    return WalletEnum.Portis;
  }
};
