import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { Controller } from 'react-hook-form';
import { DropdownOptions } from '../Dropdown/Dropdown.component';
import { ControlledDropdownProps } from './ControlledDropdown.types';

export const ControlledDropdown = ({
  name,
  label,
  placeholder,
  control,
  defaultValue,
  disabled,
  options,
}: ControlledDropdownProps) => (
  <FormControl fullWidth sx={{ mb: 6 }} disabled={disabled}>
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
      defaultValue={defaultValue}
    />
  </FormControl>
);
