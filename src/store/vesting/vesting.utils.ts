import { select } from 'typed-redux-saga';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { Vesting__factory } from '../../contracts/types/factories/Vesting__factory';
import {
  accountSelector,
  multicallProviderSelector,
  vestingRegistrySelector,
} from '../app/app.selectors';
import { convertForMulticall, multiCall } from '../utils';
import { UserVestings } from './vesting.types';

export const getVesting = (address: string, provider: Web3Provider) =>
  Vesting__factory.connect(address, provider.getSigner());

export function* getUserVestings() {
  const account = yield* select(accountSelector);
  const vestingRegistry = yield* select(vestingRegistrySelector);
  const multicallProvider = yield* select(multicallProviderSelector);

  if (!account || !vestingRegistry || !multicallProvider) {
    throw new Error('Wallet not connected');
  }

  const getVestingCall = convertForMulticall(
    vestingRegistry,
    'getVesting',
    'getVesting(address)',
    account
  );

  const getTeamVestingCall = convertForMulticall(
    vestingRegistry,
    'getTeamVesting',
    'getTeamVesting(address)',
    account
  );

  const [vestAddress, teamVestAddress] = yield* multiCall(
    multicallProvider,
    getVestingCall,
    getTeamVestingCall
  );

  const vestings: UserVestings = {
    vestAddress,
    teamVestAddress,
  };

  return vestings;
}
