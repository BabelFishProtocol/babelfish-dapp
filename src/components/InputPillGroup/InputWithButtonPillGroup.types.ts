import { FieldError, UseFormSetValue } from 'react-hook-form';

import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { ControlledInputType } from '../TextInput/TextInput.types';

export type InputWithButtonPillGroupProps = Partial<
  Omit<OutlinedInputProps, 'error'>
> & {
  title?: string;
  symbol: string;
  error?: FieldError;
  totalAmount?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonChange: (newValue: string) => void;
};

export type ControlledInputWithButtonPillGroupProps<FormValues> = Omit<
  InputWithButtonPillGroupProps,
  'value' | 'onInputChange' | 'onButtonChange' | 'error'
> &
  ControlledInputType<FormValues> & {
    totalAmountDecimals?: number;
    setValue: UseFormSetValue<FormValues>;
  };
