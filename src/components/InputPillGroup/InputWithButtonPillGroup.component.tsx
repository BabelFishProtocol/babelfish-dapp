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
  availableBalance,
  value,
  disabled,
  onInputChange,
  onButtonChange,
}: InputWithButtonPillGroupProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentValue(undefined);
    onInputChange(e);
  };

  const [percentValue, setPercentValue] = useState<string>();

  const handleButtonChange = (
    e: React.MouseEvent<HTMLElement>,
    newPercentValue: string
  ) => {
    if (!availableBalance) {
      return;
    }
    const newValue = utils.formatUnits(
      availableBalance
        ?.mul(BigNumber.from(newPercentValue))
        .div(BigNumber.from('100'))
    );

    setPercentValue(newPercentValue);
    onButtonChange(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <CurrencyInput
        title={title}
        value={value}
        symbol={symbol}
        disabled={disabled}
        onChange={handleInputChange}
      />
      <ButtonPillGroup
        availableValues={availablePercentValues}
        disabled={disabled}
        value={percentValue}
        handleChange={handleButtonChange}
      />
    </Box>
  );
};
