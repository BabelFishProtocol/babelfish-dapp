import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { TypographyProps } from '@mui/material/Typography';

export type CurrencyInputProps = Partial<OutlinedInputProps> & {
  title?: string;
  symbol: string;
  value: string;
  labelSx?: TypographyProps['sx'];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
