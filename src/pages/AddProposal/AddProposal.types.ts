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
  onClose: () => void;
  onSubmit: (data: AddProposalFields) => void;
};

export type AddProposalContainerProps = Pick<
  AddProposalProps,
  'onClose' | 'isOpenDialog'
>;

export type AddProposalStatusDialogProps = {
  isOpenDialog: boolean;
  onClose: () => void;
  status: FiniteStates;
  message?: string;
};
