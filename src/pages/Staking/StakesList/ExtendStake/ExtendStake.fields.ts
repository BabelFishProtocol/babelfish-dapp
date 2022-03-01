import { DefaultValues } from 'react-hook-form';

export enum ExtendStakeFields {
  unlockDate = 'unlockDate',
}

export type ExtendStakeValues = {
  [ExtendStakeFields.unlockDate]: number;
};

export const extendStakeDefaultValues: DefaultValues<ExtendStakeValues> = {
  [ExtendStakeFields.unlockDate]: undefined,
};
