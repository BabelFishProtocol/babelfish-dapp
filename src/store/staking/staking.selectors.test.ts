import { StakeListItem } from './staking.state';
import {
  combinedStakesList,
  failureStakingState,
  successStakingState,
} from './staking.mock';
import {
  combinedVotingPowerSelector,
  fishLoadingStateSelector,
  fishTokenDataSelector,
  fishTokenSelector,
  isSelectedStakeLockedSelector,
  selectedStakeSelector,
  stakesDatesSelector,
  stakesHistoryListSelector,
  stakesHistoryListStatusSelector,
  stakesListSelector,
  stakesListStatusSelector,
  stakingConstantsSelector,
} from './staking.selectors';
import { setMockDate } from '../../testUtils';
import { FiniteStates } from '../../utils/types';

afterEach(() => {
  jest.clearAllMocks();
});

describe('staking selectors', () => {
  describe('fishTokenSelector', () => {
    it('returns fishToken', async () => {
      const fishTokenResult = fishTokenSelector.resultFunc(successStakingState);

      expect(fishTokenResult).toEqual(successStakingState.fishToken);
    });
    it('returns empty object', async () => {
      const fishTokenResult = fishTokenSelector.resultFunc(failureStakingState);

      expect(fishTokenResult).toEqual(failureStakingState.fishToken);
    });
  });

  describe('fishTokenDataSelector', () => {
    it('returns fishToken data', async () => {
      const fishTokenDataResult = fishTokenDataSelector.resultFunc(
        successStakingState.fishToken
      );

      expect(fishTokenDataResult).toEqual(successStakingState.fishToken.data);
    });
    it('returns empty object', async () => {
      const fishTokenDataResult = fishTokenDataSelector.resultFunc(
        failureStakingState.fishToken
      );

      expect(fishTokenDataResult).toEqual(failureStakingState.fishToken.data);
    });
  });

  describe('fishLoadingStateSelector', () => {
    it('returns success state', async () => {
      const fishToken = {
        state: 'loading' as FiniteStates,
        data: successStakingState.fishToken.data,
      };

      const fishTokenLoadingStateResult =
        fishLoadingStateSelector.resultFunc(fishToken);

      expect(fishTokenLoadingStateResult).toEqual('loading');
    });
  });

  describe('stakingConstantsSelector', () => {
    it('returns constants data', async () => {
      const stakingConstantsResult =
        stakingConstantsSelector.resultFunc(successStakingState);

      expect(stakingConstantsResult).toEqual(
        successStakingState.constants.data
      );
    });
    it('returns empty object', async () => {
      const stakingConstantsResult =
        stakingConstantsSelector.resultFunc(failureStakingState);

      expect(stakingConstantsResult).toEqual(
        failureStakingState.constants.data
      );
    });
  });

  describe('combinedVotingPowerSelector', () => {
    it('returns constants data', async () => {
      const votingPowersResult =
        combinedVotingPowerSelector.resultFunc(successStakingState);

      expect(votingPowersResult).toEqual(
        successStakingState.combinedVotingPower
      );
    });
    it('returns undefined data and failure status', async () => {
      const votingPowersResult =
        combinedVotingPowerSelector.resultFunc(failureStakingState);

      expect(votingPowersResult).toEqual(
        failureStakingState.combinedVotingPower
      );
    });
  });

  describe('stakes List', () => {
    let stakesListsResultSuccess: StakeListItem[] = [];
    let stakesListsResultFailure: StakeListItem[] = [];

    beforeEach(() => {
      stakesListsResultSuccess =
        stakesListSelector.resultFunc(successStakingState);
      stakesListsResultFailure =
        stakesListSelector.resultFunc(failureStakingState);
    });

    describe('stakesListSelector', () => {
      it('returns stake list data', async () => {
        expect(stakesListsResultSuccess).toEqual(
          successStakingState.stakesList.data
        );
      });
      it('returns empty object', async () => {
        expect(stakesListsResultFailure).toEqual(
          failureStakingState.stakesList.data
        );
      });
    });
    describe('stakesListStatusSelector', () => {
      it('returns success state', async () => {
        const stakesListsStatusResult =
          stakesListStatusSelector.resultFunc(successStakingState);

        expect(stakesListsStatusResult).toEqual(
          successStakingState.stakesList.state
        );
      });
      it('returns failure state', async () => {
        const stakesListsStatusResult =
          stakesListStatusSelector.resultFunc(failureStakingState);

        expect(stakesListsStatusResult).toEqual(
          failureStakingState.stakesList.state
        );
      });
    });
    describe('stakesDatesSelector', () => {
      it('returns stakes list data', async () => {
        const stakesListsResult = stakesDatesSelector.resultFunc(
          successStakingState.stakesList.data
        );

        expect(stakesListsResult).toEqual([
          successStakingState.stakesList.data[0].unlockDate,
          successStakingState.stakesList.data[1].unlockDate,
        ]);
      });
      it('returns empty table', async () => {
        const stakesListsResult = stakesDatesSelector.resultFunc(
          failureStakingState.stakesList.data
        );

        expect(stakesListsResult).toEqual([]);
      });
    });

    describe('selectedStakeSelector', () => {
      it('returns selected stake', async () => {
        const selectedStakeSelectorResult = selectedStakeSelector.resultFunc(
          successStakingState,
          combinedStakesList
        );

        expect(selectedStakeSelectorResult).toEqual(combinedStakesList[0]);
      });
      it('returns undefined', async () => {
        const selectedStakeSelectorResult = selectedStakeSelector.resultFunc(
          failureStakingState,
          []
        );
        expect(selectedStakeSelectorResult).toBeUndefined();
      });
    });

    describe('isSelectedStakeLockedSelector', () => {
      it('returns true', async () => {
        setMockDate(1652585200000); // 2022-05-15

        const isSelectedStakeLockedSelectorResult =
          isSelectedStakeLockedSelector.resultFunc(combinedStakesList[0]);

        expect(isSelectedStakeLockedSelectorResult).toBeTruthy();
      });

      it('returns false', async () => {
        setMockDate(1642585200000); // 2022-01-19

        const isSelectedStakeLockedSelectorResult =
          isSelectedStakeLockedSelector.resultFunc(combinedStakesList[0]);

        expect(isSelectedStakeLockedSelectorResult).toBeFalsy();
      });
      it('returns undefined', async () => {
        const isSelectedStakeLockedSelectorResult =
          isSelectedStakeLockedSelector.resultFunc(
            failureStakingState.stakesList.data[0]
          );

        expect(isSelectedStakeLockedSelectorResult).toBeUndefined();
      });
    });
  });
  describe('stakesHistoryListSelector', () => {
    it('returns stakes history data', async () => {
      const stakesHistoryListsResult =
        stakesHistoryListSelector.resultFunc(successStakingState);

      expect(stakesHistoryListsResult).toEqual(
        successStakingState.stakesListHistory.data
      );
    });
    it('returns failure state', async () => {
      const stakesHistoryListsResult =
        stakesHistoryListSelector.resultFunc(failureStakingState);

      expect(stakesHistoryListsResult).toEqual(
        failureStakingState.stakesListHistory.data
      );
    });
  });
  describe('stakesHistoryListStatusSelector', () => {
    it('returns success state', async () => {
      const stakesHistoryListsStatusResult =
        stakesHistoryListStatusSelector.resultFunc(successStakingState);

      expect(stakesHistoryListsStatusResult).toEqual(
        successStakingState.stakesList.state
      );
    });
    it('returns failure state', async () => {
      const stakesHistoryListsStatusResult =
        stakesHistoryListStatusSelector.resultFunc(failureStakingState);

      expect(stakesHistoryListsStatusResult).toEqual(
        failureStakingState.stakesList.state
      );
    });
  });
});
