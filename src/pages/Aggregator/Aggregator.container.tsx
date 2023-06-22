import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { SubmitStepsDialog } from '../../components/TxDialog/TxDialog.component';
import {
  ChainEnum,
  SUPPORTED_CHAINS,
  SUPPORTED_CHAINS_RSK,
} from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import {
  pausedTokensSelector,
  startingTokenAddressSelector,
  startingTokenBridgeAddressSelector,
  submitAggregatorStatusSelector,
} from '../../store/aggregator/aggregator.selectors';
import { aggregatorActions } from '../../store/aggregator/aggregator.slice';
import { appActions } from '../../store/app/app.slice';
import { AggregatorComponent } from './Aggregator.component';
import { AggregatorFormValues } from './Aggregator.fields';
import maintenanceModeIcon from '../../assets/icons/maintenance-mode.svg';

const MaintenanceModeOverlay = () => (
  <Box
    sx={{
      position: 'absolute',
      width: '100%',
      height: '75%',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <img
      src={maintenanceModeIcon}
      alt="Convert is currently under maintenance"
      width={600}
    />
  </Box>
);

const inMaintenance = true;

export const AggregatorContainer = () => {
  const submitStatus = useSelector(submitAggregatorStatusSelector);
  const dispatch = useDispatch();

  const pausedTokens = useSelector(pausedTokensSelector);
  const startingTokenAddress = useSelector(startingTokenAddressSelector);

  const startingTokenBridgeAddress = useSelector(
    startingTokenBridgeAddressSelector
  );

  const isStartingTokenPaused = useMemo(
    () =>
      !!startingTokenAddress &&
      pausedTokens &&
      (pausedTokens.some(
        (item) => item === startingTokenAddress.toLowerCase()
      ) ||
        pausedTokens.some(
          (item) => item === startingTokenBridgeAddress?.toLowerCase()
        )),
    [pausedTokens, startingTokenAddress, startingTokenBridgeAddress]
  );

  const onStartingTokenChange = (token: TokenEnum | undefined) => {
    dispatch(aggregatorActions.setStartingToken(token));
  };

  const onDestinationChainChange = (chain: ChainEnum) => {
    dispatch(aggregatorActions.setDestinationChain(chain));
  };
  const onDestinationTokenChange = (token: TokenEnum | undefined) => {
    dispatch(aggregatorActions.setDestinationToken(token));
  };

  useEffect(() => {
    dispatch(appActions.setSupportedNetworks(SUPPORTED_CHAINS));
    return () => {
      dispatch(appActions.setSupportedNetworks(SUPPORTED_CHAINS_RSK));
    };
  }, [dispatch]);

  const onSubmit = (data: AggregatorFormValues) => {
    dispatch(aggregatorActions.submit(data));
  };

  const onClose = () => {
    dispatch(aggregatorActions.resetSubmitCall());
  };

  return (
    <div>
      {inMaintenance ? (
        <MaintenanceModeOverlay />
      ) : (
        <>
          <AggregatorComponent
            onSubmit={onSubmit}
            onDestinationChainChange={onDestinationChainChange}
            onStartingTokenChange={onStartingTokenChange}
            onDestinationTokenChange={onDestinationTokenChange}
            isStartingTokenPaused={isStartingTokenPaused}
          />
          {submitStatus.status !== 'idle' && (
            <SubmitStepsDialog
              onClose={onClose}
              steps={submitStatus.steps}
              status={submitStatus.status}
              summary={submitStatus.summary}
              currentStep={submitStatus.currentStep}
            />
          )}
        </>
      )}
    </div>
  );
};
