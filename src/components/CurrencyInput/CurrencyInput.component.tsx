import InputAdornment from '@mui/material/InputAdornment';
import { TextInput } from '../TextInput/TextInput.component';
import { CurrencyInputProps } from './CurrencyInput.types';

export const CurrencyInput = ({
  title,
  symbol,
  value,
  disabled,
  onChange,
  ...inputProps
}: CurrencyInputProps) => (
  <TextInput
    title={title}
    value={value}
    onChange={onChange}
    endAdornment={<InputAdornment position="end">{symbol}</InputAdornment>}
    {...inputProps}
  />
);
