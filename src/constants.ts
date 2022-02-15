export enum Urls {
  Proposals = '/proposals',
  Dashboard = '/dashboard',
  Staking = '/stake',
  Agregator = '/agregator',
}

export enum ProposalState {
  Pending = '0',
  Active = '1',
  Canceled = '2',
  Defeated = '3',
  Succeeded = '4',
  Queued = '5',
  Expired = '6',
  Executed = '7',
}

export enum AggregatorInputs {
  ChainDropdown = 'ChainDropdown',
  TokenDropdown = 'TokenDropdown',
  SendAmount = 'SendAmount',
  ReceiveAddress = 'ReceiveAddress',
}
