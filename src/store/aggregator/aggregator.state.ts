import { ChainEnum } from '../../config/chains';
import { DEFAULT_POOL, PoolEnum } from '../../config/pools';
import { TokenEnum } from '../../config/tokens';
import { FiniteStates } from '../../utils/types';
import { LoadableAmount, LoadableValue } from '../types';

export type FeesAndLimitsType = {
  bridgeFee?: string;
  minTransfer?: string;
  maxTransfer?: string;
  dailyLimit?: string;
};

export type FlowState = 'deposit' | 'withdraw';
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
  pool: PoolEnum = DEFAULT_POOL;
  startingToken?: TokenEnum;
  destinationChain?: ChainEnum;
  destinationToken?: TokenEnum;
  startingTokenBalance: LoadableAmount = {
    state: 'idle',
    data: undefined,
  };
  allowTokensAddress: LoadableAmount = {
    state: 'idle',
    data: undefined,
  };
  transferTokensState: FiniteStates = 'idle';
  transferTokensErrorReason?: string;
}
