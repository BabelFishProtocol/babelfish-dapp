import { AddProposalInputs } from './AddProposalFields';

export type AddProposalValues = {
  [AddProposalInputs.Target]: string;
  [AddProposalInputs.Value]: string;
  [AddProposalInputs.Signature]: string;
  [AddProposalInputs.Calidata]: string;
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
