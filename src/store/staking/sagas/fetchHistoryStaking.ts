import { put, call, select } from 'typed-redux-saga';
import { historyStakesQuery } from '../../../queries/historyStakeListQuery';
import { subgraphClientSelector } from '../../app/app.selectors';
import { stakesAndVestsAddressesSelector } from '../../vesting/vesting.selectors';
import { stakingActions } from '../staking.slice';

export function* fetchHistoryStaking() {
  try {
    const subgraphClient = yield* select(subgraphClientSelector);
    const contractAddresses = yield* select(stakesAndVestsAddressesSelector);

    if (!subgraphClient || !contractAddresses?.length)
      throw new Error('Wallet not connected');

    const { stakeEvents } = yield* call(historyStakesQuery, subgraphClient, {
      contractAddresses,
    });

    const stakesHistory = stakeEvents.map((stake) => ({
      asset: 'FISH',
      stakedAmount: stake.amount,
      unlockDate: stake.lockedUntil,
      totalStaked: stake.totalStaked,
      txHash: stake.transactionHash,
    }));

    yield* put(stakingActions.setHistoryStakesList(stakesHistory));
  } catch (e) {
    yield* put(stakingActions.fetchHistoryStakesListFailure());
  }
}
