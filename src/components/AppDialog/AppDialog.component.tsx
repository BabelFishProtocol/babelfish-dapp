import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React from 'react';
import crossIcon from '../../assets/icons/cross.svg';
import { AppDialogProps } from './AppDialog.types';

export const AppDialog = ({
  isOpenDialog,
  icon,
  title,
  description,
  onClose,
  children,
}: AppDialogProps) => 
    <Dialog onClose={onClose} open={isOpenDialog}>
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
                width: '20px',
                height: '20px',
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
            <img src={icon} style={{ width: '100px', height: '100px' }} alt="" />
          )}

          <Typography sx={{ my: 5 }} variant="body2">
            {description}
          </Typography>

          {children}
        </div>
      </DialogContent>
    </Dialog>
