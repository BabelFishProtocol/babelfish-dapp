import { ChainEnum, isOnRsk } from '../../../config/chains';
import { TransactionEvent } from '../../../queries/transactionsQuery';
import { mockAccount, mockAmount, mockReceiveAmount } from '../aggregator.mock';
import { AggregatorState, TxDetails } from '../aggregator.state';

type GetTxDetails = {
  isCrossChain: string | undefined;
  event: TransactionEvent;
};

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
