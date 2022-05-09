import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  reasonToBlockSelector,
  selectedGovernorSelector,
  addProposalStatusSelector,
} from '../../store/proposals/proposals.selectors';
import { proposalsActions } from '../../store/proposals/proposals.slice';
import { AddProposal } from './AddProposal.component';
import {
  AddProposalContainerProps,
  AddProposalFields,
} from './AddProposal.types';

import { SubmitStepsDialog } from '../../components/TxDialog/TxDialog.component';

export const AddProposalContainer = ({
  isOpenDialog,
  onClose,
}: AddProposalContainerProps) => {
  const dispatch = useDispatch();

  const reasonToBlock = useSelector(reasonToBlockSelector);
  const govSelector = useSelector(selectedGovernorSelector);
  const addProposalStatus = useSelector(addProposalStatusSelector);

  const onSubmit = (data: AddProposalFields) => {
    dispatch(proposalsActions.addProposal(data));
  };

  const handleResetCallData = () => {
    dispatch(proposalsActions.resetAddProposal());
  };

  useEffect(() => {
    dispatch(proposalsActions.watchAddProposal());

    return () => {
      dispatch(proposalsActions.stopWatchingAddProposal());
    };
  }, [dispatch, govSelector]);

  const onGovernorChange = useCallback(
    (gov: string) => dispatch(proposalsActions.setGovernor(gov)),
    [dispatch]
  );

  return (
    <>
      <AddProposal
        isOpenDialog={isOpenDialog}
        onClose={onClose}
        onSubmit={onSubmit}
        reasonToBlock={reasonToBlock}
        onGovernorChange={onGovernorChange}
      />
      {addProposalStatus.status !== 'idle' && (
        <SubmitStepsDialog
          successCallback={onClose}
          onClose={handleResetCallData}
          steps={addProposalStatus.steps}
          status={addProposalStatus.status}
          summary={addProposalStatus.summary}
          currentStep={addProposalStatus.currentStep}
        />
      )}
    </>
  );
};
