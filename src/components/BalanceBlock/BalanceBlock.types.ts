import React from 'react';
import { ContainerProps } from '@mui/material/Container';

export type BalanceBlockProps = {
  label: string;
  amount: string;
  children?: React.ReactNode;
  sx?: ContainerProps['sx'];
  asset?: string;
  isLoading?: boolean;
  aprox?: boolean;
};
