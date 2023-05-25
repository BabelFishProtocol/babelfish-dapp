import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { appActions } from './app.slice';
import { useAccount } from '../../hooks/useAccount';
import { WalletEnum } from '../../config/wallets';

export const AppUpdater = () => {
  const dispatch = useDispatch();

  const { account, type, provider, chainId } = useAccount();

  useEffect(() => {
    if (type) {
      dispatch(appActions.setConnectedWallet(type as WalletEnum));
    }
  }, [dispatch, type]);

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
    if (provider) {
      dispatch(appActions.walletConnected(provider));
    }
  }, [provider, dispatch]);

  return null;
};
