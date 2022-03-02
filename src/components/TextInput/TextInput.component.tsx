import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';

import { TextInputProps } from './TextInput.types';
import { FieldErrorMessage } from '../FieldErrorMessage/FieldErrorMessage.component';

export const TextInput = ({
  title,
  value,
  onChange,
  labelSx,
  error,
  ...inputProps
}: TextInputProps) => (
  <Box sx={{ width: '100%' }}>
    <Typography variant="h3" sx={{ mb: 1.5, ...labelSx }}>
      {title}
    </Typography>
    <OutlinedInput
      error={!!error}
      fullWidth
      value={value}
      onChange={onChange}
      {...inputProps}
    />
    <FieldErrorMessage error={error} />
  </Box>
);
