import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDialog } from '../../components/AppDialog/AppDialog.component';
import {
  proposalErrorSelector,
  proposalStateSelector,
} from '../../store/proposal/proposal.selectors';
import { proposalActions } from '../../store/proposal/proposal.slice';
import { AddProposal } from './AddProposal.component';
import {
  AddProposalContainerProps,
  AddProposalFields,
  AddProposalStatusDialogProps,
} from './AddProposal.types';

import loadingIcon from '../../assets/icons/loading.svg';
import successIcon from '../../assets/icons/success.svg';
import errorIcon from '../../assets/icons/error.svg';

const AddProposalStatusDialog = ({
  isOpenDialog,
  onClose,
  status,
  message,
}: AddProposalStatusDialogProps) => (
  <>
    {status === 'loading' && (
      <AppDialog
        title="Please Wait"
        description="Your proposal is being added. Please wait"
        isOpenDialog={isOpenDialog}
        onClose={onClose}
        icon={loadingIcon}
      />
    )}
    {status === 'success' && (
      <AppDialog
        title="Success"
        description="Your proposal was added successfully"
        isOpenDialog={isOpenDialog}
        onClose={onClose}
        icon={successIcon}
      />
    )}
    {status === 'failure' && (
      <AppDialog
        title="Error Occured"
        description={message ?? 'There was a problem while adding the proposal'}
        isOpenDialog={isOpenDialog}
        onClose={onClose}
        icon={errorIcon}
      />
    )}
  </>
);
export const AddProposalContainer = ({
  isOpenDialog,
  onClose,
}: AddProposalContainerProps) => {
  const dispatch = useDispatch();

  const state = useSelector(proposalStateSelector);
  const errorReason = useSelector(proposalErrorSelector);

  const [showDialog, setShowDialog] = useState(false);

  const onSubmit = (data: AddProposalFields) => {
    dispatch(proposalActions.startProposal(data));
  };

  useEffect(() => {
    if (state !== 'idle') {
      setShowDialog(true);
    }
  }, [state]);

  return (
    <>
      <AddProposalStatusDialog
        status={state}
        isOpenDialog={showDialog}
        message={errorReason}
        onClose={() => {
          setShowDialog(false);
        }}
      />
      <AddProposal
        isOpenDialog={isOpenDialog}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </>
  );
};
