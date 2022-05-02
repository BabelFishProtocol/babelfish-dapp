import { BigNumber, constants } from 'ethers';
import { act, renderHook } from '@testing-library/react-hooks';

import { Staking__factory } from '../../../../contracts/types';
import { StakeListItem } from '../../../../store/staking/staking.state';
import { selectedStakeSelector } from '../../../../store/staking/staking.selectors';
import {
  createMockedContract,
  mockSigner,
  TestStoreProvider,
} from '../../../../testUtils';
import { useWithdrawCalculations } from './WithdrawStake.hooks';

const mockStaking = createMockedContract(
  Staking__factory.connect(constants.AddressZero, mockSigner),
  false
);

jest.mock('../../../../store/app/app.selectors', () => ({
  ...jest.requireActual('../../../../store/app/app.selectors'),
  stakingContractSelector: () => mockStaking,
  accountSelector: () => '0x01',
}));

jest.mock('../../../../store/staking/staking.selectors', () => ({
  ...jest.requireActual('../../../../store/staking/staking.selectors'),
  selectedStakeSelector: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('withdraw stake  hooks', () => {
  describe('useWithdrawCalculations', () => {
    it('calculates amounts correctly', async () => {
      (selectedStakeSelector as unknown as jest.Mock).mockImplementation(
        () => ({ unlockDate: 1010, lockedAmount: '100000' } as StakeListItem)
      );

      const mockEstimatedGas = BigNumber.from('100');
      mockStaking.estimateGas.withdraw.mockImplementation(
        async () => mockEstimatedGas
      );

      const { result } = renderHook(() => useWithdrawCalculations(), {
        wrapper: TestStoreProvider,
      });

      expect(result.current.forfeitPercent).toBe('0');
      expect(result.current.forfeitWithdraw).toBe('0');

      await act(async () => {
        const mockPunishment = '50000';
        mockStaking.getWithdrawAmounts.mockImplementationOnce(async () => [
          BigNumber.from(0),
          BigNumber.from(mockPunishment),
        ]);

        const estimatedGas = await result.current.calculateFeeAndForfeit(
          '2000000',
          1010
        );

        expect(estimatedGas).toEqual(mockEstimatedGas);
        expect(result.current.forfeitPercent).toBe('50.0');
        expect(result.current.forfeitWithdraw).toBe(mockPunishment);
      });

      await act(async () => {
        const mockPunishment = '10000';
        mockStaking.getWithdrawAmounts.mockImplementationOnce(async () => [
          BigNumber.from(0),
          BigNumber.from(mockPunishment),
        ]);

        await result.current.calculateFeeAndForfeit('100000', 1010);
        expect(result.current.forfeitPercent).toBe('10.0');
      });
    });
  });
});
