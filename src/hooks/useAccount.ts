import { ethers } from 'ethers';

import { useWalletConnect } from './useWalletConnect';

export const useAccount = () => {
  const { wallets } = useWalletConnect();

  const web3provider = wallets[0]?.provider
    ? new ethers.providers.Web3Provider(wallets[0]?.provider)
    : undefined;
  const signer = web3provider?.getSigner();

  const chainId = wallets?.[0]?.chains?.[0]?.id;

  return {
    account: wallets[0]?.accounts[0]?.address || '',
    type: wallets[0]?.label,
    eip1193Provider: wallets[0]?.provider,
    provider: web3provider,
    signer,
    chainId: parseInt(chainId, 16),
  };
};
