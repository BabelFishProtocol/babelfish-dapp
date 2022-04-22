import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import crossIcon from '../../assets/icons/cross.svg';
import { AppDialogProps, AppDialogTitleProps } from './AppDialog.types';

export const AppDialogTitle = ({ title, onClose }: AppDialogTitleProps) => (
  <DialogTitle>
    {title}
    {onClose && (
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          background: 'transparent',
          borderRadius: '50%',
        }}
      >
        <img height={20} width={20} src={crossIcon} alt="Close" />
      </IconButton>
    )}
  </DialogTitle>
);

export const AppDialog = ({
  isOpenDialog,
  icon,
  title,
  description,
  onClose,
  children,
  dialogProps,
  dialogContentProps,
  dialogPaperProps,
}: AppDialogProps) => (
  <Dialog
    onClose={onClose}
    open={isOpenDialog}
    PaperProps={dialogPaperProps}
    {...dialogProps}
  >
    {title && <AppDialogTitle title={title} onClose={onClose} />}

    <DialogContent {...dialogContentProps}>
      {icon && <img src={icon} height={100} width={100} alt="" />}

      {description && (
        <Typography component="div" sx={{ my: 5 }} variant="body2">
          {description}
        </Typography>
      )}

      {children}
    </DialogContent>
  </Dialog>
);
