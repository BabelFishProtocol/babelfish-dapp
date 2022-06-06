import { ChainEnum, isOnRsk } from '../../../config/chains';
import { mockAccount, mockAmount, mockReceiveAmount } from '../aggregator.mock';
import { AggregatorState, TxDetails } from '../aggregator.state';

type GetTxDetails = Pick<TxDetails, 'event' | 'isCrossChain'>;

export const checkIsCrossChain = (destinationChain: ChainEnum) =>
  isOnRsk(destinationChain) ? 'true' : undefined;

export const getAggregatorInitialState = (
  txDetails: TxDetails
): AggregatorState => ({
  ...new AggregatorState(),
  txDetails,
});

export const getTxDetails = ({
  isCrossChain,
  event,
}: GetTxDetails): TxDetails => ({
  amount:
    event === 'Withdraw' ? mockAmount.toString() : mockReceiveAmount.toString(),
  user: mockAccount,
  event,
  status: 'Pending',
  isCrossChain,
});
