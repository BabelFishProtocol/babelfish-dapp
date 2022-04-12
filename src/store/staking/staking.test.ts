import { StakeListItem, StakingState } from './staking.state';
import { failureStakingState, successStakingState } from './staking.mock';
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

afterEach(() => {
  jest.clearAllMocks();
});

const getFishToken = (stakingState: StakingState) =>
  fishTokenSelector.resultFunc(stakingState);

const getSelectedStake = (
  stakingState: StakingState,
  stakeList: StakeListItem[]
) => selectedStakeSelector.resultFunc(stakingState, stakeList);

describe('staking selectors', () => {
  describe('fishTokenSelector', () => {
    it('returns fishToken', async () => {
      const fishTokenResult = getFishToken(successStakingState);

      expect(fishTokenResult).toEqual(successStakingState.fishToken);
    });
    it('returns empty object', async () => {
      const fishTokenResult = getFishToken(failureStakingState);

      expect(fishTokenResult).toEqual(failureStakingState.fishToken);
    });
  });

  describe('fishTokenDataSelector', () => {
    it('returns fishToken data', async () => {
      const fishTokenResult = getFishToken(successStakingState);
      const fishTokenDataResult =
        fishTokenDataSelector.resultFunc(fishTokenResult);

      expect(fishTokenDataResult).toEqual(successStakingState.fishToken.data);
    });
    it('returns empty object', async () => {
      const fishTokenResult = getFishToken(failureStakingState);
      const fishTokenDataResult =
        fishTokenDataSelector.resultFunc(fishTokenResult);

      expect(fishTokenDataResult).toEqual(failureStakingState.fishToken.data);
    });
  });

  describe('fishLoadingStateSelector', () => {
    it('returns success state', async () => {
      const fishTokenResult = fishTokenSelector.resultFunc(successStakingState);
      const fishTokenLoadingStateResult =
        fishLoadingStateSelector.resultFunc(fishTokenResult);

      expect(fishTokenLoadingStateResult).toEqual(
        successStakingState.fishToken.state
      );
    });
    it('returns failure state', async () => {
      const fishTokenResult = fishTokenSelector.resultFunc(failureStakingState);
      const fishTokenLoadingStateResult =
        fishLoadingStateSelector.resultFunc(fishTokenResult);

      expect(fishTokenLoadingStateResult).toEqual(
        failureStakingState.fishToken.state
      );
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
          stakesListsResultSuccess
        );

        expect(stakesListsResult).toEqual([
          successStakingState.stakesList.data[0].unlockDate,
          successStakingState.stakesList.data[1].unlockDate,
        ]);
      });
      it('returns stakes list data', async () => {
        const stakesListsResult = stakesDatesSelector.resultFunc(
          stakesListsResultFailure
        );

        expect(stakesListsResult).toEqual([]);
      });
    });

    describe('selectedStakeSelector', () => {
      it('returns selected stake', async () => {
        const selectedStakeSelectorResult = getSelectedStake(
          successStakingState,
          stakesListsResultSuccess
        );
        expect(selectedStakeSelectorResult).toEqual(
          successStakingState.stakesList.data[0]
        );
      });
      it('returns undefined', async () => {
        const selectedStakeSelectorResult = getSelectedStake(
          failureStakingState,
          stakesListsResultFailure
        );
        expect(selectedStakeSelectorResult).toBeUndefined();
      });
    });

    describe('isSelectedStakeLockedSelector', () => {
      // it('returns true', async () => {
      //   const selectedStakeSelectorResult = getSelectedStake(
      //     successStakingState,
      //     stakesListsResultSuccess
      //   );
      //   const isSelectedStakeLockedSelectorResult =
      //     isSelectedStakeLockedSelector.resultFunc(selectedStakeSelectorResult);

      //   expect(isSelectedStakeLockedSelectorResult).toBeTruthy();
      // });
      // it('returns false', async () => {
      //   const test = getCurrentTimestamp() + 1000000;

      //   const selectedStakeSelectorResult = getSelectedStake(
      //     {
      //       ...successStakingState,
      //       stakesList: {
      //         state: 'success',
      //         data: [
      //           {
      //             ...combinedStakesList[0],
      //             unlockDate: test,
      //           },
      //         ],
      //       },
      //       selectedStake: combinedStakesList[0].unlockDate,
      //     },
      //     stakesListsResultSuccess
      //   );
      //   const isSelectedStakeLockedSelectorResult =
      //     isSelectedStakeLockedSelector.resultFunc(selectedStakeSelectorResult);

      //   expect(isSelectedStakeLockedSelectorResult).toBeFalsy();
      // });
      it('returns undefined', async () => {
        const selectedStakeSelectorResult = getSelectedStake(
          failureStakingState,
          stakesListsResultFailure
        );
        const isSelectedStakeLockedSelectorResult =
          isSelectedStakeLockedSelector.resultFunc(selectedStakeSelectorResult);

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
