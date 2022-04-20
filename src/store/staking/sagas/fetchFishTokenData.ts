import { put, select } from 'typed-redux-saga';
import {
  accountSelector,
  fishTokenSelector,
  multicallProviderSelector,
  stakingContractSelector,
} from '../../app/app.selectors';
import { convertForMulticall, multiCall } from '../../utils';
import { stakingActions } from '../staking.slice';

export function* fetchFishTokenData() {
  try {
    const account = yield* select(accountSelector);
    const staking = yield* select(stakingContractSelector);
    const fishToken = yield* select(fishTokenSelector);
    const multicallProvider = yield* select(multicallProviderSelector);

    if (!staking || !account || !fishToken || !multicallProvider) {
      throw new Error('Wallet not connected');
    }

    const totalStakedCall = convertForMulticall(
      staking,
      'balanceOf',
      'balanceOf(address)',
      account
    );

    const totalBalanceCall = convertForMulticall(
      fishToken,
      'balanceOf',
      'balanceOf(address)',
      account
    );

    const allowanceForStakingCall = convertForMulticall(
      fishToken,
      'allowance',
      'allowance(address,address)',
      account,
      staking.address
    );

    const [totalStaked, totalBalance, allowanceForStaking] = yield* multiCall(
      multicallProvider,
      totalStakedCall,
      totalBalanceCall,
      allowanceForStakingCall
    );

    yield* put(
      stakingActions.setFishTokenData({
        totalStaked: totalStaked.toString(),
        fishBalance: totalBalance.toString(),
        allowanceForStaking: allowanceForStaking.toString(),
      })
    );
  } catch (e) {
    yield* put(stakingActions.fetchFishTokenDataFailure());
  }
}
