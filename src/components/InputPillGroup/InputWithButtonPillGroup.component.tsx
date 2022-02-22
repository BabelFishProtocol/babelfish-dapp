import React, { useState } from 'react';
import { BigNumber, utils } from 'ethers';
import Box from '@mui/material/Box';
import { CurrencyInput } from '../CurrencyInput/CurrencyInput.component';
import { ButtonPillGroup } from './ButtonPillGroup/ButtonPillGroup.component';
import { InputButtonPillGroupProps } from './InputWithButtonPillGroup.types';
import { availablePercentValues } from './InputWithButtonPillGroup.constants';

export const InputWithButtonPillGroup = ({
  title,
  symbol,
  totalAmount,
  ...inputProps
}: InputButtonPillGroupProps) => {
  // WIP: Should move value outside of this component
  const [value, setValue] = useState('0.00');
  const [percentSelected, setPercentSelected] = useState<number>();
  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentSelected(undefined);
    setValue(e.target.value);
  };

  const onChangePercent = (percentValue: number) => {
    setPercentSelected(percentValue);

    const formattedValue = utils.formatUnits(
      totalAmount.mul(BigNumber.from(percentValue)).div(BigNumber.from(100))
    );

    setValue(formattedValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <CurrencyInput
        title={title}
        value={value}
        symbol={symbol}
        onChange={onChangeInput}
        {...inputProps}
      />
      <ButtonPillGroup
        availableValues={availablePercentValues}
        selected={percentSelected}
        onChangeSelected={onChangePercent}
      />
    </Box>
  );
};
