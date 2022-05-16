export enum Urls {
  Proposals = '/proposals',
  Dashboard = '/dashboard',
  Staking = '/stake',
  Aggregator = '/aggregator',
  Improbability = '/improbability',
  Claim = '/claim',
}

export enum UrlNames {
  Proposals = 'DAO/GOVERN WITH FISH',
  ProposalDetails = 'VIEW PROPOSAL',
  Dashboard = 'HOME',
  Staking = 'STAKE YOUR FISH',
  Aggregator = 'DEPOSIT/WITHDRAW XUSD',
  Claim = 'CLAIM',
}

export enum ProposalState {
  Pending = 0,
  Active = 1,
  Canceled = 2,
  Defeated = 3,
  Succeeded = 4,
  Queued = 5,
  Expired = 6,
  Executed = 7,
}

export const proposalStateNames = {
  [ProposalState.Pending]: 'Pending',
  [ProposalState.Active]: 'Active',
  [ProposalState.Canceled]: 'Canceled',
  [ProposalState.Defeated]: 'Defeated',
  [ProposalState.Succeeded]: 'Succeeded',
  [ProposalState.Queued]: 'Queued',
  [ProposalState.Expired]: 'Expired',
  [ProposalState.Executed]: 'Executed',
};

export enum Reducers {
  Aggregator = 'aggregator',
  App = 'app',
  Dashboard = 'dashboard',
  Staking = 'staking',
  Proposals = 'proposals',
  Vesting = 'vesting',
}

export const MAX_STAKING_PERIODS = 78;
export const FOUR_WEEKS = 2419200;
export const TWO_WEEKS = 1209600;
export const ONE_DAY = 86400;

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

export enum GovernorTypes {
  GovernorOwner = 'governorOwner',
  GovernorAdmin = 'governorAdmin',
}

export const GOVERNANCE_OPTIONS = {
  GOVERNOR_OWNER: {
    name: 'Governor Owner',
    id: GovernorTypes.GovernorOwner,
  },
  GOVERNOR_ADMIN: {
    name: 'Governor Admin',
    id: GovernorTypes.GovernorAdmin,
  },
};

export const fieldsErrors = {
  required: 'Field Required',
  addressFormat: 'Value must be a proper RSK address',
  invalidSignature: 'Value must be a valid Function Signature',
  invalidCalldata: 'Value must be a valid Calldata',
  amountGreaterThanBalance: 'Value cannot be greater than your token balance',
  amountGreaterThanMaxLimit:
    'Value cannot be greater than the transaction max limit',
  amountLessThanMinLimit: 'Value cannot be less than the transaction min limit',
};

export const selectorsErrors = {
  missingData: 'Missing data',
};

export const decimalRegex = /^\d*\.?\d*$/;

export const signatureRegex = /^(0x|)[a-zA-Z0-9]{10}$/g;
export const calldataRegex = /^(0x)(..)*$/g;

export enum MetamaskErrorCodes {
  chainNotAdded = 4902,
}
