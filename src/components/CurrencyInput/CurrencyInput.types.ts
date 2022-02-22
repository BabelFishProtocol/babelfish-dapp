import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { TextInputProps } from '../TextInput/TextInput.types';

export type CurrencyInputProps = Partial<OutlinedInputProps> &
  TextInputProps & {
    symbol: string;
  };
