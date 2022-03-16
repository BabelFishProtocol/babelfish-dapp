import { BigNumber } from 'ethers';
import { ChainEnum } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import { LoadableAmount, LoadableValue } from '../types';

export type FeesAndLimitsType = {
  bridgeFee?: BigNumber;
  minTransfer?: BigNumber;
  maxTransfer?: BigNumber;
  dailyLimit?: BigNumber;
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
  startingToken?: TokenEnum;
  destinationChainId?: ChainEnum;
  allowTokensAddress: LoadableAmount = {
    state: 'idle',
    data: undefined,
  };
}
