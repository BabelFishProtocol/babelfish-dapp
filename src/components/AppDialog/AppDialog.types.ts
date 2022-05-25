import { SxProps, Theme } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { DialogContentProps } from '@mui/material/DialogContent';
import { PaperProps } from '@mui/material/Paper';

export type AppDialogProps = {
  isOpenDialog: boolean;
  onClose?: () => void;
  icon?: string;
  iconSx?: SxProps<Theme>;
  title?: string;
  titleSx?: SxProps<Theme>;
  description?: React.ReactNode;
  children?: React.ReactNode;
  topContent?: React.ReactNode;
  dialogProps?: Partial<DialogProps>;
  dialogContentProps?: Partial<DialogContentProps>;
  dialogPaperProps?: Partial<PaperProps>;
};

export type AppDialogTitleProps = Pick<
  AppDialogProps,
  'title' | 'titleSx' | 'onClose'
>;
