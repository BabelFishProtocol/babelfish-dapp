import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SubmitStepsDialog } from '../../components/TxDialog/TxDialog.component';
import {
  ChainEnum,
  SUPPORTED_CHAINS,
  SUPPORTED_CHAINS_RSK,
} from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import {
  destinationChainSelector,
  destinationTokenSelector,
  pausedTokensSelector,
  receiveAmountSelector,
  sendAmountSelector,
  startingChainSelector,
  startingTokenAddressSelector,
  startingTokenBridgeAddressSelector,
  startingTokenSelector,
  submitAggregatorStatusSelector,
} from '../../store/aggregator/aggregator.selectors';
import { aggregatorActions } from '../../store/aggregator/aggregator.slice';
import { appActions } from '../../store/app/app.slice';
import { AggregatorComponent } from './Aggregator.component';
import { AggregatorFormValues } from './Aggregator.fields';
import { select } from 'redux-saga/effects';

export const AggregatorContainer = () => {
  const submitStatus = useSelector(submitAggregatorStatusSelector);
  const dispatch = useDispatch();

  const pausedTokens = useSelector(pausedTokensSelector);
  const startingChain = useSelector(startingChainSelector);
  const startingToken = useSelector(startingTokenSelector);
  const startingTokenAddress = useSelector(startingTokenAddressSelector);

  const destinationChain = useSelector(destinationChainSelector);
  const destinationToken = useSelector(destinationTokenSelector);

  const sendAmount = useSelector(sendAmountSelector);
  const receiveAmount = useSelector(receiveAmountSelector);

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

  const onStartingChainChange = (chain: ChainEnum) => {
    console.log('onStartingChainChange');
    if(startingChain !== chain) {
      dispatch(aggregatorActions.setStartingChain(chain));
    }
  };

  const onStartingTokenChange = (token: TokenEnum | undefined) => {
    console.log('onStartingTokenChange');
    if(token !== startingToken) {
      dispatch(aggregatorActions.setStartingToken(token));
    }
  };

  const onDestinationChainChange = (chain: ChainEnum) => {
    console.log('onDestinationChainChange');
    if(destinationChain !== chain) {
      dispatch(aggregatorActions.setDestinationChain(chain));
    }
  };

  const onDestinationTokenChange = (token: TokenEnum | undefined) => {
    console.log('onDestinationTokenChange');
    if(destinationToken !== token) {
      dispatch(aggregatorActions.setDestinationToken(token));
    }
  };

  const onSendAmountChange = (amount: string) => {
    console.log('onSendAmountChange');
    if(sendAmount !== amount) {
      dispatch(aggregatorActions.setSendAmount(amount));
    }
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
    <>
      <AggregatorComponent
        onSubmit={onSubmit}
        onStartingChainChange={onStartingChainChange}
        onDestinationChainChange={onDestinationChainChange}
        onStartingTokenChange={onStartingTokenChange}
        onDestinationTokenChange={onDestinationTokenChange}
        isStartingTokenPaused={isStartingTokenPaused}
        onSendAmountChange={onSendAmountChange}
        receiveAmount={receiveAmount}
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
  );
};
