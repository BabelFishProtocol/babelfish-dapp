import React, { Ref, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { DropdownOptionType, DropdownProps } from './Dropdown.types';
import { NameWithIcon } from '../NameWithIcon/NameWithIcon.component';

export const DropdownOptions = <
  ItemSelected extends DropdownOptionType,
  ValueType
>({
  title,
  options,
  value,
  placeholder,
  disabled,
  sx,
  error,
  autoFocus,
  dropdownRef,
  onChange,
  setValueWhenOneOption,
}: DropdownProps<ItemSelected, ValueType> & {
  dropdownRef?: Ref<HTMLDivElement>; // I use a custom ref prop because it's not possible to use forwardRef with generic props, see https://9to5answer.com/react-with-typescript-generics-while-using-react-forwardref
}) => {
  useEffect(() => {
    setValueWhenOneOption?.();
  }, [setValueWhenOneOption]);

  const isDisabled = disabled || !options.length;

  return (
    <FormControl fullWidth disabled={isDisabled} sx={sx}>
      <Typography variant="h3" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      <Select
        ref={dropdownRef}
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
            <>
              {icon && <NameWithIcon name={name} icon={icon} />}
              {!icon && name}
            </>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
