import {
  selectedVestContractSelector,
  selectedVestSelector,
  stakesAndVestsAddressesSelector,
  vestsListSelector,
  vestsListStatusSelector,
} from './vesting.selectors';
import {
  accountAddress,
  combinedVestsList,
  createMockVestingContract,
  failureVestingState,
  successVestingState,
  vestingAddress,
} from './vesting.mock';
import { mockProvider } from '../../testUtils';
import { getVesting } from './vesting.utils';

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('./vesting.utils', () => ({
  ...jest.requireActual('./vesting.utils'),
  getVesting: jest.fn(),
}));

describe('selectors', () => {
  describe('stakesAndVestsAddressesSelector', () => {
    it('returns undefined when wallet is not connected', () => {
      const emptyAccountResult = stakesAndVestsAddressesSelector.resultFunc(
        undefined,
        combinedVestsList
      );

      expect(emptyAccountResult).toBeUndefined();
    });
    it('returns account and vesting addresses', () => {
      const addressesResult = stakesAndVestsAddressesSelector.resultFunc(
        accountAddress,
        combinedVestsList
      );

      expect(addressesResult).toEqual([
        combinedVestsList[0].address,
        combinedVestsList[1].address,
        accountAddress.toLowerCase(),
      ]);
    });
    it('returns account and no vesting addresses', () => {
      const addressesResult = stakesAndVestsAddressesSelector.resultFunc(
        accountAddress,
        []
      );

      expect(addressesResult).toEqual([accountAddress.toLowerCase()]);
    });
  });
  describe('selectedVestContractSelector', () => {
    it('returns undefined when wallet is not connected', () => {
      const emptyAccountResult = selectedVestContractSelector.resultFunc(
        undefined,
        combinedVestsList[0]
      );

      expect(emptyAccountResult).toBeUndefined();
    });
    it('returns undefined when vest is not selected', () => {
      const notSelectedVestResult = selectedVestContractSelector.resultFunc(
        mockProvider,
        undefined
      );

      expect(notSelectedVestResult).toBeUndefined();
    });
    it('returns vesting contract', () => {
      const vestingMock = createMockVestingContract(vestingAddress);
      (getVesting as jest.Mock).mockImplementation(() => vestingMock);
      const vestingResult = selectedVestContractSelector.resultFunc(
        mockProvider,
        combinedVestsList[0]
      );

      expect(vestingResult).toEqual(vestingMock);
    });
  });

  describe('vestsListSelector', () => {
    it('returns array with vest items', () => {
      const vestListResult = vestsListSelector.resultFunc(successVestingState);

      expect(vestListResult).toEqual(combinedVestsList);
    });
    it('returns empty array ', () => {
      const emptyVestListResult =
        vestsListSelector.resultFunc(failureVestingState);

      expect(emptyVestListResult).toEqual([]);
    });
  });
  describe('vestsListStatusSelector', () => {
    it('returns success status', () => {
      const successStatusResult =
        vestsListStatusSelector.resultFunc(successVestingState);

      expect(successStatusResult).toEqual('success');
    });
    it('returns failure status', () => {
      const failureStatusResult =
        vestsListStatusSelector.resultFunc(failureVestingState);

      expect(failureStatusResult).toEqual('failure');
    });
  });
  describe('selectedVestSelector', () => {
    it('returns selected vest', () => {
      const selectedVestResult = selectedVestSelector.resultFunc(
        successVestingState,
        combinedVestsList
      );
      expect(selectedVestResult).toEqual(combinedVestsList[0]);
    });
    it('returns undefined vest', () => {
      const notSelectedVestResult = selectedVestSelector.resultFunc(
        failureVestingState,
        combinedVestsList
      );
      expect(notSelectedVestResult).toBeUndefined();
    });
  });
});
