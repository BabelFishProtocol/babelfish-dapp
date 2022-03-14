import { BigNumber } from 'ethers';

export class AggregatorState {
  bridgeFee?: BigNumber;
  minTransfer?: BigNumber;
  maxTransfer?: BigNumber;
  dailyLimit?: BigNumber;
}
