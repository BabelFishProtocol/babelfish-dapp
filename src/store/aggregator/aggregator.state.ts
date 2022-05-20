import { ChainEnum } from '../../config/chains';
import { DEFAULT_POOL, PoolEnum } from '../../config/pools';
import { TokenEnum } from '../../config/tokens';
import { TransactionsTableItem } from '../../pages/Dashboard/TransactionsTable/TransactionsTable.types';
import { CallState, LoadableAmount, LoadableValue } from '../types';

export type FeesAndLimitsType = {
  bridgeFee?: string;
  minTransfer?: string;
  maxTransfer?: string;
  dailyLimit?: string;
};
export type XusdLocalTransaction = Omit<TransactionsTableItem, 'id' | 'date'>;

export type TxDetails = {
  user: string;
  amount: string;
  event: 'Deposit' | 'Withdraw';
};

export type FlowState = 'deposit' | 'withdraw';

export type AggregatorCalls =
  | 'approve'
  | 'deposit'
  | 'withdraw'
  | 'reset allowance';

export class AggregatorState {
  flowState: FlowState = 'deposit';
  feesAndLimits: LoadableValue<FeesAndLimitsType> = {
    state: 'idle',
    data: {
      bridgeFee: undefined,
      minTransfer: undefined,
      maxTransfer: undefined,
      dailyLimit: undefined,
    },
  };
  fetchFeesAndLimitsErrorReason?: string;
  pool: PoolEnum = DEFAULT_POOL;
  startingToken?: TokenEnum;
  destinationChain?: ChainEnum;
  destinationToken?: TokenEnum;
  startingTokenBalance: LoadableAmount = {
    state: 'idle',
    data: undefined,
  };
  txDetails?: TxDetails;
  fetchStartingTokenBalanceErrorReason?: string;
  allowTokensAddress: LoadableAmount = {
    state: 'idle',
    data: undefined,
  };
  submitCall: CallState<AggregatorCalls> = {
    status: 'idle',
    steps: [
      { name: 'reset allowance', label: 'resetting allowance' },
      { name: 'approve', label: 'approving' },
      { name: 'deposit', label: 'depositing' },
      { name: 'withdraw', label: 'withdrawing' },
    ],
  };
}
