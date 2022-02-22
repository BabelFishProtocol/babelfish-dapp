import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { appActions } from './app.slice';

export const AppUpdater = () => {
  const dispatch = useDispatch();
  const { chainId, account } = useActiveWeb3React();

  useEffect(() => {
    dispatch(appActions.setChainId(chainId));
  }, [chainId, dispatch]);

  useEffect(() => {
    dispatch(appActions.setAccount(account));
  }, [account, dispatch]);

  return null;
};
