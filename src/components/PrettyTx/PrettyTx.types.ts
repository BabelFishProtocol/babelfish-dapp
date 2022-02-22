import { TypographyProps } from '@mui/material/Typography';
import { ButtonProps } from '../Button/Button.types';

export type PrettyTxProps = {
  value: string | number;
  color?: ButtonProps['color'];
  variant?: TypographyProps['variant'];
};
