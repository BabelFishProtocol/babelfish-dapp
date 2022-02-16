import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { Controller } from 'react-hook-form';
import { ControlledInputProps } from './ControlledInput.types';

export const ControlledInput = ({
  name,
  label,
  placeholder,
  control,
  defaultValue,
  disabled,
}: ControlledInputProps) => (
  <FormControl fullWidth sx={{ mb: 6 }} disabled={disabled}>
    <Typography variant="h3">{label}</Typography>
    <Controller
      render={({ field: { onChange, value } }) => (
        <OutlinedInput
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
      )}
      name={name}
      control={control}
      defaultValue={defaultValue}
    />
  </FormControl>
);
