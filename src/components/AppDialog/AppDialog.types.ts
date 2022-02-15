import React from 'react';
import { DialogProps } from '@mui/material/Dialog';
import { DialogContentProps } from '@mui/material/DialogContent';

export type AppDialogProps = {
  isOpenDialog: boolean;
  onClose: () => void;
  icon?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  dialogProps?: Partial<DialogProps>;
  dialogContentProps?: Partial<DialogContentProps>;
};

export type AppDialogTitleProps = Pick<AppDialogProps, 'title' | 'onClose'>;
