import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';

import { Button } from '../Button/Button.component';
import { CenteredBox } from '../PageView/PageView.component';
import { AppDialogTitle } from '../AppDialog/AppDialog.component';

import { DialogFormProps } from './DialogForm.types';

export const DialogForm = ({
  open,
  title,
  onClose,
  isValid,
  children,
  handleSubmit,
  leftButtonText,
  rightButtonText = 'Cancel',
}: DialogFormProps) => (
  <Dialog
    open={open}
    maxWidth="md"
    onClose={onClose}
    PaperProps={{ sx: { width: 600, minHeight: 'unset' } }}
  >
    <AppDialogTitle title={title} onClose={onClose} />

    <form onSubmit={handleSubmit}>
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
      </Box>

      <CenteredBox
        sx={{ width: '100%', gap: 3, p: 3, '& button': { flexGrow: 1 } }}
      >
        <Button type="submit" disabled={!isValid}>
          {leftButtonText}
        </Button>
        <Button variant="outlined" onClick={onClose}>
          {rightButtonText}
        </Button>
      </CenteredBox>
    </form>
  </Dialog>
);
