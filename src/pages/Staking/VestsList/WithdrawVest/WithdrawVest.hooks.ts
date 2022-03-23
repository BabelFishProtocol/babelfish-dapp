import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FOUR_WEEKS, selectorsErrors } from '../../../../constants';
import {
  currentBlockSelector,
  stakingContractSelector,
} from '../../../../store/app/app.selectors';
import { selectedVestSelector } from '../../../../store/vesting/vesting.selectors';

export const useGetUnlockedVesting = () => {
  const staking = useSelector(stakingContractSelector);
  const currentBlockNumber = useSelector(currentBlockSelector);
  const selectedVestData = useSelector(selectedVestSelector);
  const [amount, setAmount] = useState('0');

  useEffect(() => {
    const getUnlockedStaking = async () => {
      if (!selectedVestData || !staking || !currentBlockNumber) {
        throw new Error(selectorsErrors.missingData);
      }
      let value = '0';
      const {
        stakingPeriodStart: startDate,
        cliff,
        unlockDate,
        address,
      } = selectedVestData;
      const allUnlocked = await staking.allUnlocked();

      const end = allUnlocked ? unlockDate : new Date().getTime() / 1e3;
      /* eslint-disable no-await-in-loop */
      for (let i = startDate + cliff; i < end; i += FOUR_WEEKS) {
        const stake = await staking.getPriorUserStakeByDate(
          address,
          i,
          currentBlockNumber - 1
        );
        value = BigNumber.from(value).add(stake).toString();
      }
      setAmount(value);
    };

    getUnlockedStaking();
  }, [selectedVestData, staking, currentBlockNumber]);

  return { amount };
};
