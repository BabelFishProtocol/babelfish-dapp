import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDialog } from '../../components/AppDialog/AppDialog.component';
import {
  reasonToBlockSelector,
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
      title="Error Occurred"
      description={message ?? 'There was a problem while adding the proposal'}
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
  const reasonToBlock = useSelector(reasonToBlockSelector);
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

  const onGovernorChange = (gov: string) => {
    dispatch(proposalsActions.setGovernor(gov));
  };

  return (
    <>
      <AddProposalStatusDialog
        status={currentStatus}
        message={errorReason}
        clearState={setStateIdle}
        closeDialog={onClose}
      />
      <AddProposal
        isOpenDialog={isOpenDialog}
        onClose={onClose}
        onSubmit={onSubmit}
        reasonToBlock={reasonToBlock}
        onGovernorChange={onGovernorChange}
      />
    </>
  );
};
