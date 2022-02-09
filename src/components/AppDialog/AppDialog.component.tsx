import { IconButton, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import crossIcon from '../../assets/icons/cross.svg';
import { AppDialogProps } from './AppDialog.types';

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

          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              background: 'transparent',
              borderRadius: '50%',
            }}
          >
            <img
              style={{
                width: '1rem',
                height: '1rem',
              }}
              src={crossIcon}
              alt="Close"
            />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent>
        <div>
          {icon && (
            <img src={icon} style={{ width: '5rem', height: '5rem' }} alt="" />
          )}

          <Typography sx={{ mb: 5, mt: 5 }} variant="body2">
            {description}
          </Typography>

          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
