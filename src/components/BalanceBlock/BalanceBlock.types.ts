import React from 'react';
import { ContainerProps } from '@mui/material/Container';
import { TypographyVariant } from '@mui/material/styles';
import { TypographyProps } from '@mui/material/Typography';
import { LoadableAmount } from '../../store/types';

export type BalanceBlockContentProps = LoadableAmount & {
  aprox?: boolean;
  asset?: string;
  variant?: TypographyVariant;
  typographySx?: TypographyProps['sx'];
};

export type BalanceBlockProps = BalanceBlockContentProps & {
  label: string;
  children?: React.ReactNode;
  sx?: ContainerProps['sx'];
};
