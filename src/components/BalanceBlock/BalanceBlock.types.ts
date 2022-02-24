import React from 'react';
import { ContainerProps } from '@mui/material/Container';
import { LoadableAmount } from '../../store/types';

export type BalanceBlockContentProps = LoadableAmount & {
  aprox?: boolean;
  asset?: string;
};

export type BalanceBlockProps = BalanceBlockContentProps & {
  label: string;
  children?: React.ReactNode;
  sx?: ContainerProps['sx'];
};
