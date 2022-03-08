export enum AddProposalInputs {
  Target = 'Target',
  Value = 'Value',
  Signature = 'Signature',
  Calldata = 'Calldata',
  SendProposalContract = 'SendProposalContract',
  Description = 'Description',
  Values = 'Values',
}

export const AddProposalNewSetValues = {
  [AddProposalInputs.Target]: '',
  [AddProposalInputs.Value]: '',
  [AddProposalInputs.Calldata]: '',
  [AddProposalInputs.Signature]: '',
};

export const AddProposalDefaultValues = {
  [AddProposalInputs.SendProposalContract]: '1',
  [AddProposalInputs.Description]: '',
  [AddProposalInputs.Values]: [AddProposalNewSetValues],
};
