import Box from '@mui/material/Box';
import React from 'react';
import { ButtonPill } from './ButtonPill.component';
import { ButtonPillGroupProps } from './ButtonPillGroup.types';

export const ButtonPillGroup = ({
  selected,
  availableValues,
  onChangeSelected,
}: ButtonPillGroupProps) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      py: 1.5,
      gap: 0.5,
      width: '100%',
    }}
  >
    {availableValues.map((value) => (
      <ButtonPill
        key={value}
        value={value}
        isSelected={value === selected}
        onClick={() => onChangeSelected(selected !== value ? value : 0)}
      />
    ))}
  </Box>
);
