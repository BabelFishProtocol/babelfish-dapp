import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import { DropdownProps } from './Dropdown.types';

export const Dropdown = ({ label, options, placeholder }: DropdownProps) => {
  const [value, setValue] = useState('');
  return (
    <FormControl fullWidth sx={{ mb: 6 }}>
      <Typography variant="h3">{label}</Typography>
      <Select
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        displayEmpty
        SelectDisplayProps={{
          style: {
            display: 'flex',
            alignItems: 'center',
            height: 38,
            paddingTop: '12px',
            paddingBottom: '12px',
            paddingLeft: '16px',
          },
        }}
      >
        <MenuItem value="" disabled style={{ display: 'none' }}>
          {placeholder}
        </MenuItem>
        {options.map((option) => (
          <MenuItem
            value={option.name}
            sx={{
              display: 'flex',
              alignItems: 'center',
              maxHeight: 52,
              padding: ({ spacing }) => spacing(1.5, 2),
            }}
          >
            <img
              alt="ethereum"
              src={option.icon}
              height={30}
              style={{
                marginRight: 12,
              }}
            />
            <Typography>{option.name}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
