import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unsupportedNetworkSelector } from '../store/app/app.selectors';
import { appActions } from '../store/app/app.slice';

export const useUnsupportedChainIdError = (): boolean => {
  const { error } = useWeb3React();
  const unsupportedNetwork = useSelector(unsupportedNetworkSelector);

  const isUnsupportedChainIdError =
    error instanceof UnsupportedChainIdError || unsupportedNetwork;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appActions.setWrongNetworkModal(isUnsupportedChainIdError));
    // console.log(
    //   'error: ',
    //   error,
    //   isUnsupportedChainIdError,
    //   unsupportedNetwork
    // );
  }, [isUnsupportedChainIdError, dispatch]);

  return isUnsupportedChainIdError;
};
