import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import { CurrencyInputProps } from './CurrencyInput.types';

export const CurrencyInput = ({
  label,
  symbol,
  value,
  disabled,
  onChange,
}: CurrencyInputProps) => (
  <>
    <Typography variant="h3">{label}</Typography>
    <OutlinedInput
      fullWidth
      endAdornment={<InputAdornment position="end">{symbol}</InputAdornment>}
      value={value}
      disabled={disabled}
      onChange={onChange}
    />
  </>
);
