import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { Controller } from 'react-hook-form';
import { DropdownOptions } from '../Dropdown/Dropdown.component';
import { DropdownOptionType } from '../Dropdown/Dropdown.types';
import { ControlledDropdownProps } from './ControlledDropdown.types';

export const ControlledDropdown = <
  OptionType extends DropdownOptionType,
  FormValues
>({
  name,
  label,
  placeholder,
  control,
  disabled,
  options,
  sx,
}: ControlledDropdownProps<OptionType, FormValues>) => (
  <FormControl fullWidth disabled={disabled} sx={{ ...sx }}>
    <Typography variant="h3">{label}</Typography>
    <Controller
      render={({ field: { onChange, value } }) => (
        <DropdownOptions
          options={options}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
      name={name}
      control={control}
    />
  </FormControl>
);
