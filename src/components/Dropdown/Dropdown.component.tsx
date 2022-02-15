import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { DropdownOption, DropdownProps } from './Dropdown.types';
import { NameWithIcon } from '../NameWithIcon/NameWithIcon.component';

export const DropdownOptions = <ItemSelected extends DropdownOption>({
  options,
  value,
  placeholder,
  onChange,
}: DropdownProps<ItemSelected>) => (
  <Select
    value={value}
    onChange={onChange}
    displayEmpty
    SelectDisplayProps={{
      style: {
        display: 'flex',
        alignItems: 'center',
        height: 32,
        paddingTop: '12px',
        paddingBottom: '12px',
        paddingLeft: '16px',
      },
    }}
  >
    <MenuItem value="" disabled style={{ display: 'none' }}>
      {placeholder}
    </MenuItem>
    {options.map(({ id, name, icon }) => (
      <MenuItem key={id} value={id}>
        <NameWithIcon name={name} icon={icon} />
      </MenuItem>
    ))}
  </Select>
);
