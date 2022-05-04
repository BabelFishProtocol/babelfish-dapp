import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  useActiveWeb3React,
  useEagerConnect,
} from '../../hooks/useActiveWeb3React';
import { appActions } from './app.slice';
import { getWalletName } from './app.updaters.utils';

export const AppUpdater = () => {
  const dispatch = useDispatch();
  const { chainId, account, library, connector } = useActiveWeb3React();

  useEagerConnect();

  useEffect(() => {
    const name = getWalletName(connector);
    if (name) {
      dispatch(appActions.setConnectedWallet(name));
    }
  }, [connector, dispatch]);

  useEffect(() => {
    if (chainId) {
      dispatch(appActions.setChainId(chainId));
    }
  }, [chainId, dispatch]);

  useEffect(() => {
    if (account) {
      dispatch(appActions.setAccount(account));
    }
  }, [account, dispatch]);

  useEffect(() => {
    if (library) {
      dispatch(appActions.walletConnected(library));
    }
  }, [library, chainId, dispatch]);

  return null;
};
