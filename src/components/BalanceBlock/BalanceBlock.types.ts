import { ContainerProps } from '@mui/material/Container';
import { TypographyVariant } from '@mui/material/styles';
import { TypographyProps } from '@mui/material/Typography';
import { LoadableAmount } from '../../store/types';

export type BalanceBlockValueProps = LoadableAmount & {
  aprox?: boolean;
  asset?: string;
};

export type BalanceBlockContentProps = BalanceBlockValueProps & {
  variant?: TypographyVariant;
  typographySx?: TypographyProps['sx'];
};

export type BalanceBlockProps = BalanceBlockContentProps & {
  centered?: boolean;
  label: string;
  children?: React.ReactNode;
  sx?: ContainerProps['sx'];
  index?: number;
};
