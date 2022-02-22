import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { BigNumber } from 'ethers';
import React from 'react';

export type InputWithButtonPillGroupProps = Partial<
  Omit<OutlinedInputProps, 'value'>
> & {
  title?: string;
  symbol: string;
  disabled?: boolean;
  value: string;
  availableBalance?: BigNumber;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonChange: (newValue: string) => void;
};
