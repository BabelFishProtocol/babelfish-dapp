import Button from '@mui/material/Button';
import pendingIcon from '../../assets/icons/loading.svg';
import { AppDialog } from '../AppDialog/AppDialog.component';
import { AppDialogProps } from '../AppDialog/AppDialog.types';

export const VotingDialog = ({ isOpenDialog, onClose }: AppDialogProps) => (
  <AppDialog
    isOpenDialog={isOpenDialog}
    title="Confirm Vote"
    icon={pendingIcon}
    description="The voting is in progress. Please approve the transaction from the wallet if prompted."
    onClose={onClose}
  >
    <Button onClick={onClose}>OK</Button>
  </AppDialog>
);
