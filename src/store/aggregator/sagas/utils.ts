import { parseUnits } from 'ethers/lib/utils';
import { ChainEnum, isOnRsk } from '../../../config/chains';
import { TransactionEvent } from '../../../queries/transactionsQuery';
import {
  depositMockValues,
  mockAccount,
  mockAmount,
  mockTokenDecimals,
} from '../aggregator.mock';
import { AggregatorState, TxDetails } from '../aggregator.state';

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
}: {
  isCrossChain: string | undefined;
  event: TransactionEvent;
}): TxDetails => ({
  amount:
    event === 'Withdraw'
      ? mockAmount.toString()
      : parseUnits(
          depositMockValues.receiveAmount,
          mockTokenDecimals
        ).toString(),
  user: mockAccount,
  event,
  status: 'Pending',
  isCrossChain,
});
