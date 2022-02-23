import { ControlledInputType } from '../ControlledInput/ControlledInput.types';
import { CurrencyInputProps } from '../CurrencyInput/CurrencyInput.types';

export type ControlledCurrencyInputProps<FormValues> =
  ControlledInputType<FormValues> & CurrencyInputProps;
