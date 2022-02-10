import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import { CurrencyInputProps } from './CurrencyInput.types';

export const CurrencyInput = ({
  title,
  symbol,
  value,
  onChange,
}: CurrencyInputProps) => (
  <>
    <Typography variant="h3">{title}</Typography>
    <OutlinedInput
      fullWidth
      endAdornment={<InputAdornment position="end">{symbol}</InputAdornment>}
      value={value}
      onChange={onChange}
    />
  </>
);
