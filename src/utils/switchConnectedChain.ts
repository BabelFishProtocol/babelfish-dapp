import { Web3Provider } from '@ethersproject/providers';
import { ChainEnum, chains } from '../config/chains';
import { isErrorWithCode, WindowWithEthereum } from './types';

export const switchConnectedChainUsingWindow = async (
  startingChain: ChainEnum
) => {
  const ethereum = (window as WindowWithEthereum)?.ethereum;
  if (!ethereum || !ethereum.request) {
    return new Error('No Ethereum in window.');
  }

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: `0x${startingChain.toString(16)}`,
        },
      ],
    });
  } catch (switchError) {
    if (isErrorWithCode(switchError) && switchError.code === 4902) {
      try {
        const chain = chains[startingChain];

        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${startingChain.toString(16)}`,
              chainName: chain.name,
              rpcUrls: chain.rpcUrls,
            },
          ],
        });
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${startingChain.toString(16)}` }],
        });
        return;
      } catch (addError) {
        return addError;
      }
    }
    return switchError;
  }
};

export const switchConnectedChainUsingProvider = async (
  provider: Web3Provider,
  chain: ChainEnum
) => {
  try {
    await provider.send('wallet_switchEthereumChain', [
      { chainId: `0x${chain.toString(16)}` },
    ]);
  } catch (switchError) {
    if (isErrorWithCode(switchError) && switchError.code === 4902) {
      try {
        const chainData = chains[chain];

        await provider.send('wallet_addEthereumChain', [
          {
            chainId: `0x${chain.toString(16)}`,
            chainName: chainData.name,
            rpcUrls: chainData.rpcUrls,
          },
        ]);
        await provider.send('wallet_switchEthereumChain', [
          { chainId: `0x${chain.toString(16)}` },
        ]);
        return;
      } catch (addError) {
        return addError;
      }
    }
    return switchError;
  }
};

export const switchConnectedChain = (
  chain: ChainEnum,
  provider?: Web3Provider
) => {
  if (!provider) {
    return switchConnectedChainUsingWindow(chain);
  }
  return switchConnectedChainUsingProvider(provider, chain);
};
