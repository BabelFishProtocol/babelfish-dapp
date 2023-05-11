import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unsupportedNetworkSelector } from '../store/app/app.selectors';
import { appActions } from '../store/app/app.slice';

export const useUnsupportedChainIdError = (): boolean => {
  const unsupportedNetwork = useSelector(unsupportedNetworkSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appActions.setWrongNetworkModal(unsupportedNetwork));
  }, [dispatch, unsupportedNetwork]);

  return unsupportedNetwork;
};
