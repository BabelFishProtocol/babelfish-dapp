import { BigNumber } from 'ethers';
import { TokenAllowed } from '../../config/bridges';
import { ChainType } from '../../config/chains';
import { LoadableAmount, LoadableValue } from '../types';

type AggregatorContract = {
  bridgeFee?: BigNumber;
  minTransfer?: BigNumber;
  maxTransfer?: BigNumber;
  dailyLimit?: BigNumber;
};
export class AggregatorState {
  feesAndLimits: LoadableValue<AggregatorContract> = {
    state: 'idle',
    data: {
      bridgeFee: undefined,
      minTransfer: undefined,
      maxTransfer: undefined,
      dailyLimit: undefined,
    },
  };
  tokenFrom?: TokenAllowed;
  chainTo?: ChainType;
  allowTokensAddress: LoadableAmount = {
    state: 'idle',
    data: undefined,
  };
}
