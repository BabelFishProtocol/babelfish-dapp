import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDialog } from '../../components/AppDialog/AppDialog.component';
import {
  addProposalErrorSelector,
  addProposalStateSelector,
} from '../../store/proposals/proposals.selectors';
import { proposalsActions } from '../../store/proposals/proposals.slice';
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
  onClose,
  status,
  message,
}: AddProposalStatusDialogProps) => (
  <>
    <AppDialog
      isOpenDialog={status === 'loading'}
      title="Please Wait"
      description="Your proposal is being added. Please wait"
      icon={loadingIcon}
    />
    <AppDialog
      isOpenDialog={status === 'success'}
      title="Success"
      description="Your proposal was added successfully"
      onClose={onClose}
      icon={successIcon}
    />
    <AppDialog
      isOpenDialog={status === 'failure'}
      title="Error Occured"
      description={message ?? 'There was a problem while adding the proposal'}
      onClose={onClose}
      icon={errorIcon}
    />
  </>
);
export const AddProposalContainer = ({
  isOpenDialog,
  onClose,
}: AddProposalContainerProps) => {
  const dispatch = useDispatch();

  const state = useSelector(addProposalStateSelector);
  const errorReason = useSelector(addProposalErrorSelector);

  const onSubmit = (data: AddProposalFields) => {
    dispatch(proposalsActions.startProposal(data));
  };

  const setStateIdle = () => {
    dispatch(proposalsActions.setAddProposalState('idle'));
  };

  return (
    <>
      <AddProposalStatusDialog
        status={state}
        message={errorReason}
        onClose={setStateIdle}
      />
      <AddProposal
        isOpenDialog={isOpenDialog}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </>
  );
};
