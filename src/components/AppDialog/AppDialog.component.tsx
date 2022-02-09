import { IconButton, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import { AppDialogProps } from './AppDialog.types';
import crossIcon from '../../assets/icons/cross.svg';

export default function AppDialog({
  openDialog,
  icon,
  title,
  description,
  onClose,
  children,
}: AppDialogProps) {
  return (
    <Dialog onClose={onClose} open={openDialog}>
      {title && (
        <DialogTitle>
          {title}

          <img
            style={{
              float: 'right',
              width: '1rem',
              height: '1rem',
              cursor: 'pointer',
            }}
            src={crossIcon}
            alt="Close"
            onClick={onClose}
          />
        </DialogTitle>
      )}

      <DialogContent>
        <div>
          {icon && <img src={icon} style={{ width: '5rem', height: '5rem' }} />}

          <Typography sx={{ mb: 5, mt: 5 }} variant="body2">
            {description}
          </Typography>

          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
