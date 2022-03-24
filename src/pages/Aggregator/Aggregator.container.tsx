import { BigNumber, utils } from 'ethers';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ChainEnum } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import { aggregatorActions } from '../../store/aggregator/aggregator.slice';
import { AggregatorComponent } from './Aggregator.component';
import { AggregatorFormValues } from './Aggregator.fields';

const mockAvailableBalance = '81.123';

export const AggregatorContainer = () => {
  const dispatch = useDispatch();

  const onStartingTokenChange = (token: TokenEnum) => {
    dispatch(aggregatorActions.setStartingToken(token));
  };

  const onDestinationChainChange = (chain: ChainEnum) => {
    dispatch(aggregatorActions.setDestinationChain(chain));
  };

  const getTokenAvailableBalance = useCallback(
    () =>
      // todo: implement
      utils.parseEther(mockAvailableBalance),
    [mockAvailableBalance]
  );

  const getReceiveAmount = (sendAmount: string) =>
    // todo: implement
    utils.formatUnits(
      utils
        .parseUnits(sendAmount)
        .mul(BigNumber.from(95))
        .div(BigNumber.from(100))
    );

  const onSubmit = (data: AggregatorFormValues) => {
    // TODO: implement
    // eslint-disable-next-line no-console
    console.log(data);
  };
  return (
    <AggregatorComponent
      getTokenAvailableBalance={getTokenAvailableBalance}
      getReceiveAmount={getReceiveAmount}
      onSubmit={onSubmit}
      onDestinationChainChange={onDestinationChainChange}
      onStartingTokenChange={onStartingTokenChange}
    />
  );
};
