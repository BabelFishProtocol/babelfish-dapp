import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDialog } from '../../components/AppDialog/AppDialog.component';
import {
  addProposalEligibleSelector,
  addProposalErrorSelector,
  addProposalStateSelector,
  selectedGovernorSelector,
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
  clearState,
  closeDialog,
  status,
  message,
  isNotEligible,
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
      onClose={() => {
        clearState();
        if (closeDialog) closeDialog();
      }}
      icon={successIcon}
    />
    <AppDialog
      isOpenDialog={status === 'failure'}
      title="Error Occured"
      description={message ?? 'There was a problem while adding the proposal'}
      onClose={clearState}
      icon={errorIcon}
    />
    <AppDialog
      isOpenDialog={isNotEligible}
      title="Error"
      description={
        message ?? 'You cannot Add Proposals Right Now. Please try again later.'
      }
      onClose={clearState}
      icon={errorIcon}
    />
  </>
);
export const AddProposalContainer = ({
  isOpenDialog,
  onClose,
}: AddProposalContainerProps) => {
  const dispatch = useDispatch();

  const currentStatus = useSelector(addProposalStateSelector);
  const isEligibleToAdd = useSelector(addProposalEligibleSelector);
  const errorReason = useSelector(addProposalErrorSelector);
  const govSelector = useSelector(selectedGovernorSelector);

  const onSubmit = (data: AddProposalFields) => {
    dispatch(proposalsActions.startProposal(data));
  };

  const setStateIdle = () => {
    dispatch(proposalsActions.setAddProposalState('idle'));
  };

  useEffect(() => {
    dispatch(proposalsActions.watchAddProposal());

    return () => {
      dispatch(proposalsActions.stopWatchingAddProposal());
    };
  }, [dispatch, govSelector]);

  return (
    <>
      <AddProposalStatusDialog
        status={currentStatus}
        message={errorReason}
        clearState={setStateIdle}
        closeDialog={onClose}
        isNotEligible={isEligibleToAdd === 'failure'}
      />
      <AddProposal
        isOpenDialog={isOpenDialog}
        onClose={onClose}
        onSubmit={onSubmit}
        eligibleToAdd={isEligibleToAdd === 'success'}
      />
    </>
  );
};
