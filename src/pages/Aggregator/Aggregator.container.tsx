import { BigNumber, utils } from 'ethers';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SubmitStepsDialog } from '../../components/TxDialog/TxDialog.component';
import {
  ChainEnum,
  SUPPORTED_CHAINS,
  SUPPORTED_CHAINS_RSK,
} from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import { submitAggregatorStatusSelector } from '../../store/aggregator/aggregator.selectors';
import { aggregatorActions } from '../../store/aggregator/aggregator.slice';
import { appActions } from '../../store/app/app.slice';
import { AggregatorComponent } from './Aggregator.component';
import { AggregatorFormValues } from './Aggregator.fields';

export const AggregatorContainer = () => {
  const submitStatus = useSelector(submitAggregatorStatusSelector);
  const dispatch = useDispatch();

  const onStartingTokenChange = (token: TokenEnum) => {
    dispatch(aggregatorActions.setStartingToken(token));
  };

  const onDestinationChainChange = (chain: ChainEnum) => {
    dispatch(aggregatorActions.setDestinationChain(chain));
  };
  const onDestinationTokenChange = (token: TokenEnum) => {
    dispatch(aggregatorActions.setDestinationToken(token));
  };

  useEffect(() => {
    dispatch(appActions.setSupportedNetworks(SUPPORTED_CHAINS));
    return () => {
      dispatch(appActions.setSupportedNetworks(SUPPORTED_CHAINS_RSK));
    };
  }, [dispatch]);

  const getReceiveAmount = (sendAmount: string) =>
    // todo: implement
    utils.formatUnits(
      utils
        .parseUnits(sendAmount)
        .mul(BigNumber.from(95))
        .div(BigNumber.from(100))
    );

  const onSubmit = (data: AggregatorFormValues) => {
    dispatch(aggregatorActions.submit(data));
  };

  const onClose = () => {
    dispatch(aggregatorActions.resetSubmitCall());
  };

  return (
    <>
      <AggregatorComponent
        getReceiveAmount={getReceiveAmount}
        onSubmit={onSubmit}
        onDestinationChainChange={onDestinationChainChange}
        onStartingTokenChange={onStartingTokenChange}
        onDestinationTokenChange={onDestinationTokenChange}
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
