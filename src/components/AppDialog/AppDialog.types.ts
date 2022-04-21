import { DialogProps } from '@mui/material/Dialog';
import { DialogContentProps } from '@mui/material/DialogContent';
import { PaperProps } from '@mui/material/Paper';

export type AppDialogProps = {
  isOpenDialog: boolean;
  onClose?: () => void;
  icon?: string;
  title?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  dialogProps?: Partial<DialogProps>;
  dialogContentProps?: Partial<DialogContentProps>;
  dialogPaperProps?: Partial<PaperProps>;
};

export type AppDialogTitleProps = Pick<AppDialogProps, 'title' | 'onClose'>;
