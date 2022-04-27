import { FieldError, UseFormSetValue } from 'react-hook-form';

import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { ControlledInputType } from '../TextInput/TextInput.types';
import { FeesAndLimitsType } from '../../store/aggregator/aggregator.state';

export type InputWithButtonPillGroupProps = Partial<
  Omit<OutlinedInputProps, 'error'>
> & {
  title?: string;
  symbol: string;
  error?: FieldError;
  totalAmount?: string;
  totalAmountDecimals?: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonChange: (newValue: string) => void;
};

export type ControlledInputWithButtonPillGroupProps<FormValues> = Omit<
  InputWithButtonPillGroupProps,
  'value' | 'onInputChange' | 'onButtonChange' | 'error'
> &
  ControlledInputType<FormValues> & {
    totalAmountDecimals?: number;
    feesAndLimits?: FeesAndLimitsType;
    setValue: UseFormSetValue<FormValues>;
  };
