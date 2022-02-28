import { DefaultValues } from 'react-hook-form';
import { AddNewStakeFormValues } from './AddNewStake.types';

export enum AddNewStakeFields {
  stakeAmount = 'stakeAmount',
  unlockDate = 'unlockDate',
}

export const addNewStakeDefaultValues: DefaultValues<AddNewStakeFormValues> = {
  [AddNewStakeFields.stakeAmount]: '',
  [AddNewStakeFields.unlockDate]: undefined,
};
