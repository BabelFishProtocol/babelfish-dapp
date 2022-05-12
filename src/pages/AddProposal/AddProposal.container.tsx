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

  const submitTx = useSelector(addProposalStatusSelector);
  const reasonToBlock = useSelector(reasonToBlockSelector);
  const govSelector = useSelector(selectedGovernorSelector);

  const onSubmit = (data: AddProposalFields) => {
    dispatch(proposalsActions.addProposal(data));
  };

  useEffect(() => {
    dispatch(proposalsActions.watchEligibility());

    return () => {
      dispatch(proposalsActions.eligibleForAddProposal());
    };
  }, [dispatch, govSelector]);

  const onGovernorChange = useCallback(
    (gov: string) => {
      dispatch(proposalsActions.setGovernor(gov));
    },
    [dispatch]
  );

  const handleResetCallData = () => {
    dispatch(proposalsActions.resetProposal());
  };

  const handleSuccessCallback = () => {
    dispatch(proposalsActions.clearReasonToBlockState());
    onClose();
  };

  return (
    <>
      {submitTx.status !== 'idle' && (
        <SubmitStepsDialog
          successCallback={handleSuccessCallback}
          onClose={handleResetCallData}
          steps={submitTx.steps}
          status={submitTx.status}
          summary={submitTx.summary}
          currentStep={submitTx.currentStep}
        />
      )}
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
