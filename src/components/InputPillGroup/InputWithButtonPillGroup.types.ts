import { BigNumber } from 'ethers';
import React from 'react';
import { FieldValues, SetFieldValue } from 'react-hook-form';

export type InputWithButtonPillGroupProps = {
  name: string;
  title?: string;
  symbol: string;
  disabled?: boolean;
  availableBalance?: BigNumber;
  value: string;
  setValue: SetFieldValue<FieldValues>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
