import React from 'react';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import { DropdownOption, DropdownProps } from './Dropdown.types';

export const Dropdown = <ItemSelected extends DropdownOption>({
  label,
  options,
  placeholder,
  disabled,
  itemSelectedId,
  setItemSelected,
}: DropdownProps<ItemSelected>) => (
  <FormControl fullWidth sx={{ mb: 6 }} disabled={disabled}>
    <Typography variant="h3">{label}</Typography>
    <Select
      value={itemSelectedId}
      onChange={(event) => {
        setItemSelected(event.target.value);
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
          key={option.id}
          value={option.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            maxHeight: 52,
            padding: ({ spacing }) => spacing(1.5, 2),
          }}
        >
          <img
            alt={`${option.name} logo`}
            src={option.icon}
            height={30}
            width={30}
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
