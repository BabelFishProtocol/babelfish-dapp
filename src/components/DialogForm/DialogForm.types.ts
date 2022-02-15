import { ReactNode } from 'react';

export type DialogFormProps = {
  open: boolean;
  txFee: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
  leftButton: ReactNode;
  rightButton: ReactNode;
};
