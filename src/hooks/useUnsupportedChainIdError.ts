import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { appActions } from '../store/app/app.slice';

export const useUnsupportedChainIdError = (): boolean => {
  const { error } = useWeb3React();

  const isUnsupportedChainIdError = error instanceof UnsupportedChainIdError;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appActions.setWrongNetworkModal(isUnsupportedChainIdError));
  }, [isUnsupportedChainIdError, dispatch]);

  return isUnsupportedChainIdError;
};
