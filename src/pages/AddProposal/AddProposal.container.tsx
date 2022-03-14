import React from 'react';
import { useDispatch } from 'react-redux';
import { proposalActions } from '../../store/proposal/proposal.slice';
import { AddProposal } from './AddProposal.component';
import { AddProposalInputs } from './AddProposal.fields';
import {
  AddProposalContainerProps,
  AddProposalFields,
} from './AddProposal.types';

export const AddProposalContainer = ({
  isOpenDialog,
  onClose,
}: AddProposalContainerProps) => {
  const dispatch = useDispatch();

  const onSubmit = (data: AddProposalFields) => {
    const payload = {
      governorType: data[AddProposalInputs.SendProposalContract],
    };
    dispatch(proposalActions.startFetchThreshold(payload));
  };

  return (
    <AddProposal
      isOpenDialog={isOpenDialog}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};
