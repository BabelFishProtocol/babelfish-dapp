import { Box, Stepper, Step, StepLabel } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import React from 'react';
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
        <img
          style={{
            width: '20px',
            height: '20px',
          }}
          src={crossIcon}
          alt="Close"
        />
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
    <Box
      sx={{
        // m: 4,
        mt: 4,
        mb: 4,
        mx: 2,
        // width: '100%',
        // display: 'flex',
        // justifyContent: 'space-between',
      }}
    >
      <Stepper activeStep={2}>
        <Step completed>
          <StepLabel>Approve</StepLabel>
        </Step>
        <Step>
          <StepLabel error>Stake</StepLabel>
        </Step>
        <Step>
          <StepLabel>Finish</StepLabel>
        </Step>
      </Stepper>
    </Box>
    <DialogContent {...dialogContentProps}>
      {icon && (
        <img src={icon} style={{ width: '100px', height: '100px' }} alt="" />
      )}
      {description && (
        <Typography component="div" sx={{ my: 5 }} variant="body2">
          {description}
        </Typography>
      )}

      {children}
    </DialogContent>
  </Dialog>
);
