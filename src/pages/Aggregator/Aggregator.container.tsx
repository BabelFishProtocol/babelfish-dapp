import { BigNumber, utils } from 'ethers';
import { useDispatch } from 'react-redux';
import { ChainEnum } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import { aggregatorActions } from '../../store/aggregator/aggregator.slice';
import { AggregatorComponent } from './Aggregator.component';
import { AggregatorFormValues } from './Aggregator.fields';

export const AggregatorContainer = () => {
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
      getReceiveAmount={getReceiveAmount}
      onSubmit={onSubmit}
      onDestinationChainChange={onDestinationChainChange}
      onStartingTokenChange={onStartingTokenChange}
      onDestinationTokenChange={onDestinationTokenChange}
    />
  );
};
