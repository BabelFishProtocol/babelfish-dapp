export enum Urls {
  Bitocracy = '/bitocracy',
  Dashboard = '/dashboard',
  Staking = '/stake',
  Convert = '/convert',
  Improbability = '/improbability',
}

export enum UrlNames {
  Bitocracy = 'Bitocracy',
  ProposalDetails = 'View proposal',
  Dashboard = 'Home',
  Staking = 'Stake',
  Convert = 'Convert',
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
  Convert = 'convert',
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

export const MS = 1e3;

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
  amountEqualZero: 'Value cannot be equal zero',
  depositsDisabled: 'Deposits for this asset are currently disabled',
  amountGreaterThanAggregatorBalance: 'Amount exceeds aggregator balance',
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

export const DEFAULT_ASSET_DECIMALS = 18;
