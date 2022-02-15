import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

import { CenteredBox } from '../PageView/PageView.component';
import { AppDialogTitle } from '../AppDialog/AppDialog.component';

import { DialogFormProps } from './DialogForm.types';

export const DialogForm = ({
  open,
  txFee,
  title,
  onClose,
  children,
  leftButton,
  rightButton,
}: DialogFormProps) => (
  <Dialog
    open={open}
    maxWidth="md"
    onClose={onClose}
    PaperProps={{ sx: { width: 600 } }}
  >
    <AppDialogTitle title={title} onClose={onClose} />

    <Box
      sx={{
        px: 4,
        pt: 3,
        pb: 1,
        gap: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      {children}
      <Typography>Tx Fee: {txFee} RBTC</Typography>
    </Box>

    <CenteredBox
      sx={{ width: '100%', gap: 3, p: 3, '& button': { flexGrow: 1 } }}
    >
      {leftButton}
      {rightButton}
    </CenteredBox>
  </Dialog>
);
