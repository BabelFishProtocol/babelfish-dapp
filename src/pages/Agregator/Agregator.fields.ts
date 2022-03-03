export enum AgregatorInputs {
  StartingChain = 'StartingChain',
  StartingToken = 'StartingToken',
  SendAmount = 'SendAmount',
  DestinationChain = 'DestinationChain',
  DestinationToken = 'DestinationToken',
  ReceiveAmount = 'ReceiveAmount',
  ReceiveAddress = 'ReceiveAddress',
}

export const agregatorDefaultValues = {
  [AgregatorInputs.StartingChain]: '',
  [AgregatorInputs.StartingToken]: '',
  [AgregatorInputs.SendAmount]: '',
  [AgregatorInputs.DestinationChain]: '',
  [AgregatorInputs.DestinationToken]: '',
  [AgregatorInputs.ReceiveAmount]: '',
  [AgregatorInputs.ReceiveAddress]: '',
} as const;
