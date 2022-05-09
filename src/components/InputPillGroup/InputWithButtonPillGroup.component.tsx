import React, { useState } from 'react';
import { BigNumber, utils } from 'ethers';
import Box from '@mui/material/Box';
import { CurrencyInput } from '../CurrencyInput/CurrencyInput.component';
import { ButtonPillGroup } from './ButtonPillGroup/ButtonPillGroup.component';
import { InputWithButtonPillGroupProps } from './InputWithButtonPillGroup.types';
import { availablePercentValues } from './InputWithButtonPillGroup.constants';

export const InputWithButtonPillGroup = ({
  title,
  symbol,
  totalAmount,
  totalAmountDecimals,
  value,
  error,
  disabled,
  onInputChange,
  onButtonChange,
  ...inputProps
}: InputWithButtonPillGroupProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentValue(undefined);
    onInputChange(e);
  };

  const [percentValue, setPercentValue] = useState<number>();

  const handleButtonChange = (
    e: React.MouseEvent<HTMLElement>,
    newPercentValue: number | null
  ) => {
    if (!totalAmount || !Number.isFinite(newPercentValue)) {
      return;
    }

    const calculatedAmount = BigNumber.from(totalAmount)
      ?.mul(BigNumber.from(newPercentValue))
      .div(BigNumber.from('100'));
    const newValue = utils.formatUnits(calculatedAmount, totalAmountDecimals);

    setPercentValue(newPercentValue as number);
    onButtonChange(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <CurrencyInput
        title={title}
        value={value}
        symbol={symbol}
        disabled={disabled}
        error={error}
        onChange={handleInputChange}
        {...inputProps}
      />
      {totalAmount && (
        <ButtonPillGroup
          availableValues={availablePercentValues}
          disabled={disabled}
          value={percentValue}
          handleChange={handleButtonChange}
        />
      )}
    </Box>
  );
};
