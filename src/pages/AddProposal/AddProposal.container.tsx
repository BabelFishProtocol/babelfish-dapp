import React from 'react';
import { AddProposal } from './AddProposal.component';
import { AddProposalContainerProps } from './AddProposal.types';

export const AddProposalContainer = ({
  isOpenDialog,
  onClose,
}: AddProposalContainerProps) => {
  const onSubmit = () => {};
  return (
    <AddProposal
      isOpenDialog={isOpenDialog}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};
