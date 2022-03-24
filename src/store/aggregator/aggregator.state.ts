import { ChainEnum } from '../../config/chains';
import { PoolEnum } from '../../config/pools';
import { TokenEnum } from '../../config/tokens';
import { LoadableAmount, LoadableValue } from '../types';

export type FeesAndLimitsType = {
  bridgeFee?: string;
  minTransfer?: string;
  maxTransfer?: string;
  dailyLimit?: string;
};
export class AggregatorState {
  flowState: 'deposit' | 'withdraw' = 'deposit';
  feesAndLimits: LoadableValue<FeesAndLimitsType> = {
    state: 'idle',
    data: {
      bridgeFee: undefined,
      minTransfer: undefined,
      maxTransfer: undefined,
      dailyLimit: undefined,
    },
  };
  pool: PoolEnum = PoolEnum.mainnet;
  startingToken?: TokenEnum;
  destinationChain?: ChainEnum;
  startingTokenBalance: LoadableAmount = {
    state: 'idle',
    data: undefined,
  };
  allowTokensAddress: LoadableAmount = {
    state: 'idle',
    data: undefined,
  };
}
