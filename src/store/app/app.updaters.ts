import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { appActions } from './app.slice';
import { useAccount } from '../../hooks/useAccount';
import { WalletEnum } from '../../config/wallets';

export const AppUpdater = () => {
  const dispatch = useDispatch();

  const {
    account: newAccount,
    type,
    provider,
    chainId: newChainId,
  } = useAccount();

  useEffect(() => {
    if (type) {
      dispatch(appActions.setConnectedWallet(type as WalletEnum));
    }
  }, [dispatch, type]);

  useEffect(() => {
    if (newChainId) {
      dispatch(appActions.setChainId(newChainId));
    }
  }, [newChainId, dispatch]);

  useEffect(() => {
    if (newAccount) {
      dispatch(appActions.setAccount(newAccount));
    }
  }, [newAccount, dispatch]);

  useEffect(() => {
    if (provider) {
      dispatch(appActions.walletConnected(provider));
    }
  }, [provider, dispatch]);

  return null;
};
