import { TypographyProps } from '@mui/material/Typography';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';

export type TextInputProps = Partial<OutlinedInputProps> & {
  title?: string;
  value: string;
  labelSx?: TypographyProps['sx'];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
