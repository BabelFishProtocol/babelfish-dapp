import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';

import { TextInputProps } from './TextInput.types';

export const TextInput = ({
  title,
  value,
  onChange,
  labelSx,
  ...inputProps
}: TextInputProps) => (
  <Box sx={{ width: '100%' }}>
    <Typography variant="h3" sx={{ mb: 1.5, ...labelSx }}>
      {title}
    </Typography>
    <OutlinedInput
      fullWidth
      value={value}
      onChange={onChange}
      {...inputProps}
    />
  </Box>
);
