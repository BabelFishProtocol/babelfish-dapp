import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { DropdownOptionType, DropdownProps } from './Dropdown.types';
import { NameWithIcon } from '../NameWithIcon/NameWithIcon.component';
import { FieldErrorMessage } from '../FieldErrorMessage/FieldErrorMessage.component';

export const DropdownOptions = <
  ItemSelected extends DropdownOptionType,
  ValueType
>({
  title,
  options,
  value,
  placeholder,
  sx,
  error,
  autoFocus,
  onChange,
}: DropdownProps<ItemSelected, ValueType>) => (
  <FormControl fullWidth disabled={options.length <= 1} sx={sx}>
    <Typography variant="h3" sx={{ mb: 1.5 }}>
      {title}
    </Typography>
    <Select
      value={value}
      error={!!error}
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
      inputProps={{
        autoFocus,
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
      <FieldErrorMessage error={error} />
    </Select>
  </FormControl>
);
