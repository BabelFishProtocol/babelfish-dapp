import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { useEffect, useState } from 'react';
import { injectedConnector } from '../config/providers';

export type Web3Data = Web3ReactContextInterface<Web3Provider>;

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

export const useEagerConnect = () => {
  const { activate, active } = useWeb3React(); // specifically using useWeb3React because of what this hook does
  const [tried, setTried] = useState(false);

  useEffect(() => {
    injectedConnector.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injectedConnector, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
        // We do not support mobile rn
        // if (isMobile && window.ethereum) {
        //   activate(injectedPRovider, undefined, true).catch(() => {
        //     setTried(true)
        //   })
        // } else {
        //   setTried(true)
        // }
      }
    });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  return tried;
};

/**
 * wrapper for useWeb3React with strict types. All properties of web3Data will become required when checked that active is true
 */
export const useActiveWeb3React = (): ActiveWeb3Data | InActiveWeb3Data => {
  const web3Data = useWeb3React<Web3Provider>();

  useEagerConnect();

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
