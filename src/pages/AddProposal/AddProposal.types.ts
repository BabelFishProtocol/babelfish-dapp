import { FiniteStates } from '../../utils/types';
import { AddProposalInputs } from './AddProposal.fields';

export type AddProposalValues = {
  [AddProposalInputs.Target]: string;
  [AddProposalInputs.Value]: string;
  [AddProposalInputs.Signature]: string;
  [AddProposalInputs.Calldata]: string;
};

export type AddProposalFields = {
  [AddProposalInputs.SendProposalContract]: string;
  [AddProposalInputs.Description]: string;
  [AddProposalInputs.Values]: AddProposalValues[];
};

export type AddProposalProps = {
  isOpenDialog: boolean;
  eligibleToAdd: boolean;
  onClose: () => void;
  onSubmit: (data: AddProposalFields) => void;
};

export type AddProposalContainerProps = Pick<
  AddProposalProps,
  'onClose' | 'isOpenDialog'
>;

export type AddProposalStatusDialogProps = {
  clearState: () => void;
  closeDialog?: () => void;
  status: FiniteStates;
  isNotEligible: boolean;
  message?: string;
};
