import { FormEventHandler, ReactNode } from 'react';

export type DialogFormProps = {
  open: boolean;
  txFee: string;
  title: string;
  isValid: boolean;
  onClose: () => void;
  children: ReactNode;
  leftButtonText: ReactNode;
  rightButtonText?: ReactNode;
  handleSubmit?: FormEventHandler<HTMLFormElement>;
};
