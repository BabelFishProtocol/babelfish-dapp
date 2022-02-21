import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';

type Web3Data = Web3ReactContextInterface<Web3Provider>;

type ActiveWeb3Data = Required<Web3Data> & {
  active: true;
};
type InActiveWeb3Data = Web3Data & {
  active: false;
};

const isActive = (web3Data: Web3Data): web3Data is ActiveWeb3Data =>
  web3Data.active &&
  !!web3Data.account &&
  !!web3Data.library &&
  !!web3Data.connector;

/**
 * wrapper for useWeb3React with strict types. All properties of web3Data will become required when checked that active is true
 */
export const useActiveWeb3React = (): ActiveWeb3Data | InActiveWeb3Data => {
  const web3Data = useWeb3React<Web3Provider>();

  if (isActive(web3Data)) {
    return web3Data;
  }

  return {
    ...web3Data,
    active: false,
  };
};

/**
 * Should only be used in case of usage in context with connected wallet
 */
export const useConnectedWeb3React = () => {
  const web3Data = useActiveWeb3React();

  return web3Data as ActiveWeb3Data;
};
