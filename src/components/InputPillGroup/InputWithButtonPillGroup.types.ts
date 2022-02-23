import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { BigNumber } from 'ethers';
import React from 'react';

export type InputWithButtonPillGroupProps = Partial<OutlinedInputProps> & {
  title?: string;
  symbol: string;
  totalAmount?: BigNumber;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonChange: (newValue: string) => void;
};
