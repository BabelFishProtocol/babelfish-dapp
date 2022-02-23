import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { appActions } from './app.slice';

export const AppUpdater = () => {
  const dispatch = useDispatch();
  const { chainId, account, library } = useActiveWeb3React();

  useEffect(() => {
    dispatch(appActions.setChainId(chainId));
  }, [chainId, dispatch]);

  useEffect(() => {
    dispatch(appActions.setAccount(account));
  }, [account, dispatch]);

  useEffect(() => {
    if (!library) {
      dispatch(appActions.walletDisconnected());
      return;
    }
    dispatch(appActions.walletConnected(library));
  }, [library, chainId, dispatch]);

  return null;
};
