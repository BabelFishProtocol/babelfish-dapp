import { FieldError } from 'react-hook-form';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { BigNumber } from 'ethers';
import React from 'react';

export type InputWithButtonPillGroupProps = Partial<
  Omit<OutlinedInputProps, 'error'>
> & {
  title?: string;
  symbol: string;
  error?: FieldError;
  totalAmount?: BigNumber;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonChange: (newValue: string) => void;
};
