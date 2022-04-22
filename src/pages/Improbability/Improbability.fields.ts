import { DefaultValues } from 'react-hook-form';
import { ChainEnum } from '../../config/chains';
import { Coin } from './Improbability.types';

export enum ImprobabilityInputs {
  Network = 'Network',
}

export type ImprobabilityFormValues = {
  [ImprobabilityInputs.Network]: ChainEnum | '';
};

export const improbabilityDefaultValues: DefaultValues<ImprobabilityFormValues> =
  {
    [ImprobabilityInputs.Network]: '',
  };

export type ImprobabilityRowData = Omit<Coin, 'addresses'>;
