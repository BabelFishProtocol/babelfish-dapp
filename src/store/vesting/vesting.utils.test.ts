import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { VestingRegistry__factory } from '../../contracts/types';
import {
  mockSigner,
  mockProvider,
  createMockedContract,
  mockMulticallProvider,
} from '../../testUtils';
import {
  accountSelector,
  vestingRegistrySelector,
  multicallProviderSelector,
} from '../app/app.selectors';
import { convertForMulticall } from '../utils/utils.sagas';
import { UserVestings } from './vesting.types';
import { getUserVestings, getVesting } from './vesting.utils';

jest.mock('../../contracts/types/factories/Vesting__factory', () => ({
  Vesting__factory: {
    connect: jest.fn().mockReturnValue('mock connect'),
  },
}));

jest.mock('../utils/utils.sagas', () => ({
  ...jest.requireActual('../utils/utils.sagas'),
  convertForMulticall: jest.fn(),
}));

const mockVestingRegistry = createMockedContract(
  VestingRegistry__factory.connect(
    '0x0000000000000000000000000000000000000123',
    mockSigner
  ),
  true
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('vesting utils', () => {
  describe('getVesting', () => {
    const vestingAddress = '0x03444';

    it('returns connect method output', async () => {
      const result = getVesting(vestingAddress, mockProvider);
      expect(result).toEqual('mock connect');
    });
  });

  describe('getUserVestings', () => {
    it('returns addresses of both vesting and teamVesting', async () => {
      const multicallResultVesting = { name: 'mocked args to get vesting' };
      const multicallResultTeamVesting = { name: 'mocked args teamVesting' };

      (convertForMulticall as jest.Mock)
        .mockImplementationOnce(() => multicallResultVesting)
        .mockImplementationOnce(() => multicallResultTeamVesting);

      const userAccount = '0x01';

      const vestAddress = '0x0100';
      const teamVestAddress = '0x0101';

      const expectedResult: UserVestings = {
        vestAddress,
        teamVestAddress,
      };

      const runResult = await expectSaga(getUserVestings)
        .select(vestingRegistrySelector)
        .select(multicallProviderSelector)
        .select(accountSelector)
        .provide([
          [matchers.select(vestingRegistrySelector), mockVestingRegistry],
          [matchers.select(multicallProviderSelector), mockMulticallProvider],
          [matchers.select(accountSelector), userAccount],
          [
            matchers.call(
              [mockMulticallProvider, mockMulticallProvider.all],
              [multicallResultVesting, multicallResultTeamVesting]
            ),
            [vestAddress, teamVestAddress],
          ],
        ])
        .call(
          [mockMulticallProvider, mockMulticallProvider.all],
          [multicallResultVesting, multicallResultTeamVesting]
        )
        .run();

      expect(runResult.effects).toEqual({});
      expect(runResult.returnValue).toEqual(expectedResult);
    });
  });
});
