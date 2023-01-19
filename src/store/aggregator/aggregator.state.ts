import { ChainEnum } from '../../config/chains';
import { DEFAULT_POOL, PoolEnum } from '../../config/pools';
import { TokenEnum } from '../../config/tokens';
import {
  TransactionsTableItem,
  TransactionStatus,
} from '../../pages/Dashboard/TransactionsTable/TransactionsTable.types';
import { CallState, LoadableAmount, LoadableValue } from '../types';

export type FeesAndLimitsType = {
  bridgeFee?: string;
  minTransfer?: string;
  maxTransfer?: string;
  dailyLimit?: string;
};

export enum IncentiveType {
  none,
  reward,
  penalty
};

export type IncentivesType = {
  type?: IncentiveType;
  amount?: string ;
};

export type XusdLocalTransaction = Omit<TransactionsTableItem, 'id'>;

export type UpdateTxStatus = {
  txHash: TransactionsTableItem['txHash'];
  newStatus: TransactionStatus;
};

export type TxDetails = Pick<
  TransactionsTableItem,
  'user' | 'amount' | 'event' | 'status' | 'isCrossChain'
>;

export type FlowState = 'deposit' | 'withdraw';

export type AggregatorCalls =
  | 'approve'
  | 'deposit'
  | 'withdraw'
  | 'reset allowance';

export class AggregatorState {
  feesAndLimits: LoadableValue<FeesAndLimitsType> = {
    state: 'idle',
    data: {
      bridgeFee: undefined,
      minTransfer: undefined,
      maxTransfer: undefined,
      dailyLimit: undefined,
    },
  };
  incentives: LoadableValue<IncentivesType> = {
    state: 'idle',
    data: {
      type: undefined,
      amount: undefined
    }
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
  pausedTokens: string[] = [];
  txDetails?: TxDetails;
  fetchStartingTokenBalanceErrorReason?: string;
  allowTokensAddress: LoadableAmount = {
    state: 'idle',
    data: undefined,
  };
  sendAmount?: string = undefined;
  submitCall: CallState<AggregatorCalls> = {
    status: 'idle',
    steps: [
      { name: 'reset allowance', label: 'resetting allowance' },
      { name: 'approve', label: 'approving' },
      { name: 'deposit', label: 'depositing' },
      { name: 'withdraw', label: 'withdrawing' },
    ],
  };
  receiveAmount?: string = undefined;
}
