import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { DropdownOptionType, DropdownProps } from './Dropdown.types';
import { NameWithIcon } from '../NameWithIcon/NameWithIcon.component';

export const DropdownOptions = <
  ItemSelected extends DropdownOptionType,
  ValueType
>({
  options,
  value,
  placeholder,
  onChange,
}: DropdownProps<ItemSelected, ValueType>) => (
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
    {placeholder && (
      <MenuItem disabled value="" style={{ display: 'none' }}>
        {placeholder}
      </MenuItem>
    )}
    {options.map(({ id, name, icon }) => (
      <MenuItem key={id} value={id}>
        <NameWithIcon name={name} icon={icon} />
      </MenuItem>
    ))}
  </Select>
);
