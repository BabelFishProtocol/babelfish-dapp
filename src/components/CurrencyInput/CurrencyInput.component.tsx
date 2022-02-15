import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import { CurrencyInputProps } from './CurrencyInput.types';

export const CurrencyInput = ({
  title,
  symbol,
  value,
  onChange,
  labelSx,
  ...inputProps
}: CurrencyInputProps) => (
  <>
    <Typography variant="h3" sx={{ mb: 1.5, ...labelSx }}>
      {title}
    </Typography>
    <OutlinedInput
      fullWidth
      endAdornment={<InputAdornment position="end">{symbol}</InputAdornment>}
      value={value}
      onChange={onChange}
      {...inputProps}
    />
  </>
);
