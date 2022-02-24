import InputAdornment from '@mui/material/InputAdornment';
import React from 'react';
import { decimalRegex } from '../../constants';
import { TextInput } from '../TextInput/TextInput.component';
import { CurrencyInputProps } from './CurrencyInput.types';

export const CurrencyInput = ({
  title,
  symbol,
  value,
  onChange,
  ...inputProps
}: CurrencyInputProps) => {
  const validateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (newValue.match(decimalRegex)) {
      onChange!(e);
    }
  };

  return (
    <TextInput
      title={title}
      value={value}
      onChange={onChange && validateChange}
      endAdornment={<InputAdornment position="end">{symbol}</InputAdornment>}
      {...inputProps}
    />
  );
};
