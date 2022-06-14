/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: string;
  BigInt: string;
  Bytes: string;
};

export type IBlock_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export enum IEvent {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw'
}

export enum IOrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type IProposal = {
  __typename?: 'Proposal';
  actions: Array<IProposalAction>;
  againstVotesAmount: Scalars['BigInt'];
  contractAddress: Scalars['Bytes'];
  createdAt: Scalars['BigInt'];
  description: Scalars['String'];
  endBlock: Scalars['BigInt'];
  eta: Scalars['BigInt'];
  forVotesAmount: Scalars['BigInt'];
  id: Scalars['ID'];
  proposalId: Scalars['BigInt'];
  proposer: Scalars['Bytes'];
  startBlock: Scalars['BigInt'];
  startDate: Scalars['BigInt'];
  votes: Array<IVote>;
};


export type IProposalActionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IProposalAction_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<IProposalAction_Filter>;
};


export type IProposalVotesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IVote_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<IVote_Filter>;
};

export type IProposalAction = {
  __typename?: 'ProposalAction';
  calldata: Scalars['Bytes'];
  contract: Scalars['Bytes'];
  id: Scalars['ID'];
  proposal: IProposal;
  signature: Scalars['String'];
};

export type IProposalAction_Filter = {
  calldata?: InputMaybe<Scalars['Bytes']>;
  calldata_contains?: InputMaybe<Scalars['Bytes']>;
  calldata_in?: InputMaybe<Array<Scalars['Bytes']>>;
  calldata_not?: InputMaybe<Scalars['Bytes']>;
  calldata_not_contains?: InputMaybe<Scalars['Bytes']>;
  calldata_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  contract?: InputMaybe<Scalars['Bytes']>;
  contract_contains?: InputMaybe<Scalars['Bytes']>;
  contract_in?: InputMaybe<Array<Scalars['Bytes']>>;
  contract_not?: InputMaybe<Scalars['Bytes']>;
  contract_not_contains?: InputMaybe<Scalars['Bytes']>;
  contract_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  proposal?: InputMaybe<Scalars['String']>;
  proposal_contains?: InputMaybe<Scalars['String']>;
  proposal_ends_with?: InputMaybe<Scalars['String']>;
  proposal_gt?: InputMaybe<Scalars['String']>;
  proposal_gte?: InputMaybe<Scalars['String']>;
  proposal_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_lt?: InputMaybe<Scalars['String']>;
  proposal_lte?: InputMaybe<Scalars['String']>;
  proposal_not?: InputMaybe<Scalars['String']>;
  proposal_not_contains?: InputMaybe<Scalars['String']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']>;
  proposal_starts_with?: InputMaybe<Scalars['String']>;
  signature?: InputMaybe<Scalars['String']>;
  signature_contains?: InputMaybe<Scalars['String']>;
  signature_ends_with?: InputMaybe<Scalars['String']>;
  signature_gt?: InputMaybe<Scalars['String']>;
  signature_gte?: InputMaybe<Scalars['String']>;
  signature_in?: InputMaybe<Array<Scalars['String']>>;
  signature_lt?: InputMaybe<Scalars['String']>;
  signature_lte?: InputMaybe<Scalars['String']>;
  signature_not?: InputMaybe<Scalars['String']>;
  signature_not_contains?: InputMaybe<Scalars['String']>;
  signature_not_ends_with?: InputMaybe<Scalars['String']>;
  signature_not_in?: InputMaybe<Array<Scalars['String']>>;
  signature_not_starts_with?: InputMaybe<Scalars['String']>;
  signature_starts_with?: InputMaybe<Scalars['String']>;
};

export enum IProposalAction_OrderBy {
  Calldata = 'calldata',
  Contract = 'contract',
  Id = 'id',
  Proposal = 'proposal',
  Signature = 'signature'
}

export type IProposal_Filter = {
  againstVotesAmount?: InputMaybe<Scalars['BigInt']>;
  againstVotesAmount_gt?: InputMaybe<Scalars['BigInt']>;
  againstVotesAmount_gte?: InputMaybe<Scalars['BigInt']>;
  againstVotesAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  againstVotesAmount_lt?: InputMaybe<Scalars['BigInt']>;
  againstVotesAmount_lte?: InputMaybe<Scalars['BigInt']>;
  againstVotesAmount_not?: InputMaybe<Scalars['BigInt']>;
  againstVotesAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  contractAddress?: InputMaybe<Scalars['Bytes']>;
  contractAddress_contains?: InputMaybe<Scalars['Bytes']>;
  contractAddress_in?: InputMaybe<Array<Scalars['Bytes']>>;
  contractAddress_not?: InputMaybe<Scalars['Bytes']>;
  contractAddress_not_contains?: InputMaybe<Scalars['Bytes']>;
  contractAddress_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  createdAt?: InputMaybe<Scalars['BigInt']>;
  createdAt_gt?: InputMaybe<Scalars['BigInt']>;
  createdAt_gte?: InputMaybe<Scalars['BigInt']>;
  createdAt_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAt_lt?: InputMaybe<Scalars['BigInt']>;
  createdAt_lte?: InputMaybe<Scalars['BigInt']>;
  createdAt_not?: InputMaybe<Scalars['BigInt']>;
  createdAt_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  endBlock?: InputMaybe<Scalars['BigInt']>;
  endBlock_gt?: InputMaybe<Scalars['BigInt']>;
  endBlock_gte?: InputMaybe<Scalars['BigInt']>;
  endBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  endBlock_lt?: InputMaybe<Scalars['BigInt']>;
  endBlock_lte?: InputMaybe<Scalars['BigInt']>;
  endBlock_not?: InputMaybe<Scalars['BigInt']>;
  endBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eta?: InputMaybe<Scalars['BigInt']>;
  eta_gt?: InputMaybe<Scalars['BigInt']>;
  eta_gte?: InputMaybe<Scalars['BigInt']>;
  eta_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eta_lt?: InputMaybe<Scalars['BigInt']>;
  eta_lte?: InputMaybe<Scalars['BigInt']>;
  eta_not?: InputMaybe<Scalars['BigInt']>;
  eta_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  forVotesAmount?: InputMaybe<Scalars['BigInt']>;
  forVotesAmount_gt?: InputMaybe<Scalars['BigInt']>;
  forVotesAmount_gte?: InputMaybe<Scalars['BigInt']>;
  forVotesAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  forVotesAmount_lt?: InputMaybe<Scalars['BigInt']>;
  forVotesAmount_lte?: InputMaybe<Scalars['BigInt']>;
  forVotesAmount_not?: InputMaybe<Scalars['BigInt']>;
  forVotesAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  proposalId?: InputMaybe<Scalars['BigInt']>;
  proposalId_gt?: InputMaybe<Scalars['BigInt']>;
  proposalId_gte?: InputMaybe<Scalars['BigInt']>;
  proposalId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  proposalId_lt?: InputMaybe<Scalars['BigInt']>;
  proposalId_lte?: InputMaybe<Scalars['BigInt']>;
  proposalId_not?: InputMaybe<Scalars['BigInt']>;
  proposalId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  proposer?: InputMaybe<Scalars['Bytes']>;
  proposer_contains?: InputMaybe<Scalars['Bytes']>;
  proposer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  proposer_not?: InputMaybe<Scalars['Bytes']>;
  proposer_not_contains?: InputMaybe<Scalars['Bytes']>;
  proposer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  startBlock?: InputMaybe<Scalars['BigInt']>;
  startBlock_gt?: InputMaybe<Scalars['BigInt']>;
  startBlock_gte?: InputMaybe<Scalars['BigInt']>;
  startBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startBlock_lt?: InputMaybe<Scalars['BigInt']>;
  startBlock_lte?: InputMaybe<Scalars['BigInt']>;
  startBlock_not?: InputMaybe<Scalars['BigInt']>;
  startBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startDate?: InputMaybe<Scalars['BigInt']>;
  startDate_gt?: InputMaybe<Scalars['BigInt']>;
  startDate_gte?: InputMaybe<Scalars['BigInt']>;
  startDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startDate_lt?: InputMaybe<Scalars['BigInt']>;
  startDate_lte?: InputMaybe<Scalars['BigInt']>;
  startDate_not?: InputMaybe<Scalars['BigInt']>;
  startDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum IProposal_OrderBy {
  Actions = 'actions',
  AgainstVotesAmount = 'againstVotesAmount',
  ContractAddress = 'contractAddress',
  CreatedAt = 'createdAt',
  Description = 'description',
  EndBlock = 'endBlock',
  Eta = 'eta',
  ForVotesAmount = 'forVotesAmount',
  Id = 'id',
  ProposalId = 'proposalId',
  Proposer = 'proposer',
  StartBlock = 'startBlock',
  StartDate = 'startDate',
  Votes = 'votes'
}

export type IQuery = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<I_Meta_>;
  proposal?: Maybe<IProposal>;
  proposalAction?: Maybe<IProposalAction>;
  proposalActions: Array<IProposalAction>;
  proposals: Array<IProposal>;
  stakeEvent?: Maybe<IStakeEvent>;
  stakeEvents: Array<IStakeEvent>;
  user?: Maybe<IUser>;
  users: Array<IUser>;
  vestingContract?: Maybe<IVestingContract>;
  vestingContracts: Array<IVestingContract>;
  vote?: Maybe<IVote>;
  votes: Array<IVote>;
  xusdTransaction?: Maybe<IXusdTransaction>;
  xusdTransactions: Array<IXusdTransaction>;
};


export type IQuery_MetaArgs = {
  block?: InputMaybe<IBlock_Height>;
};


export type IQueryProposalArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type IQueryProposalActionArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type IQueryProposalActionsArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IProposalAction_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IProposalAction_Filter>;
};


export type IQueryProposalsArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IProposal_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IProposal_Filter>;
};


export type IQueryStakeEventArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type IQueryStakeEventsArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IStakeEvent_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IStakeEvent_Filter>;
};


export type IQueryUserArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type IQueryUsersArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IUser_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IUser_Filter>;
};


export type IQueryVestingContractArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type IQueryVestingContractsArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IVestingContract_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IVestingContract_Filter>;
};


export type IQueryVoteArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type IQueryVotesArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IVote_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IVote_Filter>;
};


export type IQueryXusdTransactionArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type IQueryXusdTransactionsArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IXusdTransaction_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IXusdTransaction_Filter>;
};

export type IStakeEvent = {
  __typename?: 'StakeEvent';
  amount: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  id: Scalars['ID'];
  lockedUntil: Scalars['BigInt'];
  staker: Scalars['Bytes'];
  totalStaked: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type IStakeEvent_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lockedUntil?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_gt?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_gte?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lockedUntil_lt?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_lte?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_not?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  staker?: InputMaybe<Scalars['Bytes']>;
  staker_contains?: InputMaybe<Scalars['Bytes']>;
  staker_in?: InputMaybe<Array<Scalars['Bytes']>>;
  staker_not?: InputMaybe<Scalars['Bytes']>;
  staker_not_contains?: InputMaybe<Scalars['Bytes']>;
  staker_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  totalStaked?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_lte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum IStakeEvent_OrderBy {
  Amount = 'amount',
  BlockTimestamp = 'blockTimestamp',
  Id = 'id',
  LockedUntil = 'lockedUntil',
  Staker = 'staker',
  TotalStaked = 'totalStaked',
  TransactionHash = 'transactionHash'
}

export type ISubscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<I_Meta_>;
  proposal?: Maybe<IProposal>;
  proposalAction?: Maybe<IProposalAction>;
  proposalActions: Array<IProposalAction>;
  proposals: Array<IProposal>;
  stakeEvent?: Maybe<IStakeEvent>;
  stakeEvents: Array<IStakeEvent>;
  user?: Maybe<IUser>;
  users: Array<IUser>;
  vestingContract?: Maybe<IVestingContract>;
  vestingContracts: Array<IVestingContract>;
  vote?: Maybe<IVote>;
  votes: Array<IVote>;
  xusdTransaction?: Maybe<IXusdTransaction>;
  xusdTransactions: Array<IXusdTransaction>;
};


export type ISubscription_MetaArgs = {
  block?: InputMaybe<IBlock_Height>;
};


export type ISubscriptionProposalArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type ISubscriptionProposalActionArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type ISubscriptionProposalActionsArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IProposalAction_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IProposalAction_Filter>;
};


export type ISubscriptionProposalsArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IProposal_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IProposal_Filter>;
};


export type ISubscriptionStakeEventArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type ISubscriptionStakeEventsArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IStakeEvent_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IStakeEvent_Filter>;
};


export type ISubscriptionUserArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type ISubscriptionUsersArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IUser_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IUser_Filter>;
};


export type ISubscriptionVestingContractArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type ISubscriptionVestingContractsArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IVestingContract_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IVestingContract_Filter>;
};


export type ISubscriptionVoteArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type ISubscriptionVotesArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IVote_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IVote_Filter>;
};


export type ISubscriptionXusdTransactionArgs = {
  block?: InputMaybe<IBlock_Height>;
  id: Scalars['ID'];
  subgraphError?: I_SubgraphErrorPolicy_;
};


export type ISubscriptionXusdTransactionsArgs = {
  block?: InputMaybe<IBlock_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IXusdTransaction_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: I_SubgraphErrorPolicy_;
  where?: InputMaybe<IXusdTransaction_Filter>;
};

export type IUser = {
  __typename?: 'User';
  address: Scalars['Bytes'];
  allStakes: Array<IStakeEvent>;
  id: Scalars['ID'];
  stakes: Array<IStakeEvent>;
  vests: Array<IVestingContract>;
};


export type IUserAllStakesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IStakeEvent_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<IStakeEvent_Filter>;
};


export type IUserStakesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IStakeEvent_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<IStakeEvent_Filter>;
};


export type IUserVestsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IVestingContract_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<IVestingContract_Filter>;
};

export type IUser_Filter = {
  address?: InputMaybe<Scalars['Bytes']>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  allStakes?: InputMaybe<Array<Scalars['String']>>;
  allStakes_contains?: InputMaybe<Array<Scalars['String']>>;
  allStakes_not?: InputMaybe<Array<Scalars['String']>>;
  allStakes_not_contains?: InputMaybe<Array<Scalars['String']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  stakes?: InputMaybe<Array<Scalars['String']>>;
  stakes_contains?: InputMaybe<Array<Scalars['String']>>;
  stakes_not?: InputMaybe<Array<Scalars['String']>>;
  stakes_not_contains?: InputMaybe<Array<Scalars['String']>>;
  vests?: InputMaybe<Array<Scalars['String']>>;
  vests_contains?: InputMaybe<Array<Scalars['String']>>;
  vests_not?: InputMaybe<Array<Scalars['String']>>;
  vests_not_contains?: InputMaybe<Array<Scalars['String']>>;
};

export enum IUser_OrderBy {
  Address = 'address',
  AllStakes = 'allStakes',
  Id = 'id',
  Stakes = 'stakes',
  Vests = 'vests'
}

export type IVestingContract = {
  __typename?: 'VestingContract';
  address: Scalars['Bytes'];
  id: Scalars['ID'];
  owner: Scalars['Bytes'];
  stakes: Array<IStakeEvent>;
  type: Scalars['String'];
};


export type IVestingContractStakesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<IStakeEvent_OrderBy>;
  orderDirection?: InputMaybe<IOrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<IStakeEvent_Filter>;
};

export type IVestingContract_Filter = {
  address?: InputMaybe<Scalars['Bytes']>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  stakes?: InputMaybe<Array<Scalars['String']>>;
  stakes_contains?: InputMaybe<Array<Scalars['String']>>;
  stakes_not?: InputMaybe<Array<Scalars['String']>>;
  stakes_not_contains?: InputMaybe<Array<Scalars['String']>>;
  type?: InputMaybe<Scalars['String']>;
  type_contains?: InputMaybe<Scalars['String']>;
  type_ends_with?: InputMaybe<Scalars['String']>;
  type_gt?: InputMaybe<Scalars['String']>;
  type_gte?: InputMaybe<Scalars['String']>;
  type_in?: InputMaybe<Array<Scalars['String']>>;
  type_lt?: InputMaybe<Scalars['String']>;
  type_lte?: InputMaybe<Scalars['String']>;
  type_not?: InputMaybe<Scalars['String']>;
  type_not_contains?: InputMaybe<Scalars['String']>;
  type_not_ends_with?: InputMaybe<Scalars['String']>;
  type_not_in?: InputMaybe<Array<Scalars['String']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']>;
  type_starts_with?: InputMaybe<Scalars['String']>;
};

export enum IVestingContract_OrderBy {
  Address = 'address',
  Id = 'id',
  Owner = 'owner',
  Stakes = 'stakes',
  Type = 'type'
}

export type IVote = {
  __typename?: 'Vote';
  id: Scalars['ID'];
  isPro: Scalars['Boolean'];
  proposal: IProposal;
  txHash: Scalars['Bytes'];
  voter: Scalars['Bytes'];
  votes: Scalars['BigInt'];
};

export type IVote_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isPro?: InputMaybe<Scalars['Boolean']>;
  isPro_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isPro_not?: InputMaybe<Scalars['Boolean']>;
  isPro_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  proposal?: InputMaybe<Scalars['String']>;
  proposal_contains?: InputMaybe<Scalars['String']>;
  proposal_ends_with?: InputMaybe<Scalars['String']>;
  proposal_gt?: InputMaybe<Scalars['String']>;
  proposal_gte?: InputMaybe<Scalars['String']>;
  proposal_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_lt?: InputMaybe<Scalars['String']>;
  proposal_lte?: InputMaybe<Scalars['String']>;
  proposal_not?: InputMaybe<Scalars['String']>;
  proposal_not_contains?: InputMaybe<Scalars['String']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']>;
  proposal_starts_with?: InputMaybe<Scalars['String']>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  voter?: InputMaybe<Scalars['Bytes']>;
  voter_contains?: InputMaybe<Scalars['Bytes']>;
  voter_in?: InputMaybe<Array<Scalars['Bytes']>>;
  voter_not?: InputMaybe<Scalars['Bytes']>;
  voter_not_contains?: InputMaybe<Scalars['Bytes']>;
  voter_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  votes?: InputMaybe<Scalars['BigInt']>;
  votes_gt?: InputMaybe<Scalars['BigInt']>;
  votes_gte?: InputMaybe<Scalars['BigInt']>;
  votes_in?: InputMaybe<Array<Scalars['BigInt']>>;
  votes_lt?: InputMaybe<Scalars['BigInt']>;
  votes_lte?: InputMaybe<Scalars['BigInt']>;
  votes_not?: InputMaybe<Scalars['BigInt']>;
  votes_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum IVote_OrderBy {
  Id = 'id',
  IsPro = 'isPro',
  Proposal = 'proposal',
  TxHash = 'txHash',
  Voter = 'voter',
  Votes = 'votes'
}

export type IXusdTransaction = {
  __typename?: 'XusdTransaction';
  amount: Scalars['BigInt'];
  asset: Scalars['String'];
  date: Scalars['BigInt'];
  event: IEvent;
  id: Scalars['ID'];
  receiver: Scalars['Bytes'];
  txHash: Scalars['Bytes'];
  user: Scalars['Bytes'];
};

export type IXusdTransaction_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  asset?: InputMaybe<Scalars['String']>;
  asset_contains?: InputMaybe<Scalars['String']>;
  asset_ends_with?: InputMaybe<Scalars['String']>;
  asset_gt?: InputMaybe<Scalars['String']>;
  asset_gte?: InputMaybe<Scalars['String']>;
  asset_in?: InputMaybe<Array<Scalars['String']>>;
  asset_lt?: InputMaybe<Scalars['String']>;
  asset_lte?: InputMaybe<Scalars['String']>;
  asset_not?: InputMaybe<Scalars['String']>;
  asset_not_contains?: InputMaybe<Scalars['String']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']>;
  asset_starts_with?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['BigInt']>;
  date_gt?: InputMaybe<Scalars['BigInt']>;
  date_gte?: InputMaybe<Scalars['BigInt']>;
  date_in?: InputMaybe<Array<Scalars['BigInt']>>;
  date_lt?: InputMaybe<Scalars['BigInt']>;
  date_lte?: InputMaybe<Scalars['BigInt']>;
  date_not?: InputMaybe<Scalars['BigInt']>;
  date_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  event?: InputMaybe<IEvent>;
  event_in?: InputMaybe<Array<IEvent>>;
  event_not?: InputMaybe<IEvent>;
  event_not_in?: InputMaybe<Array<IEvent>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  receiver?: InputMaybe<Scalars['Bytes']>;
  receiver_contains?: InputMaybe<Scalars['Bytes']>;
  receiver_in?: InputMaybe<Array<Scalars['Bytes']>>;
  receiver_not?: InputMaybe<Scalars['Bytes']>;
  receiver_not_contains?: InputMaybe<Scalars['Bytes']>;
  receiver_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash?: InputMaybe<Scalars['Bytes']>;
  txHash_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  txHash_not?: InputMaybe<Scalars['Bytes']>;
  txHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  txHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum IXusdTransaction_OrderBy {
  Amount = 'amount',
  Asset = 'asset',
  Date = 'date',
  Event = 'event',
  Id = 'id',
  Receiver = 'receiver',
  TxHash = 'txHash',
  User = 'user'
}

export type I_Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type I_Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: I_Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum I_SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type IGetUserQueryVariables = Exact<{
  contractAddress: Scalars['ID'];
}>;


export type IGetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, allStakes: Array<{ __typename?: 'StakeEvent', id: string, staker: string, amount: string, lockedUntil: string, totalStaked: string, transactionHash: string, blockTimestamp: string }> } | null };

export type IStakingHistorySubscriptionVariables = Exact<{
  contractAddress: Scalars['ID'];
}>;


export type IStakingHistorySubscription = { __typename?: 'Subscription', user?: { __typename?: 'User', id: string, allStakes: Array<{ __typename?: 'StakeEvent', id: string, staker: string, amount: string, lockedUntil: string, totalStaked: string, transactionHash: string, blockTimestamp: string }> } | null };

export type IGetProposalsDetailsQueryVariables = Exact<{
  contractAddress: Scalars['Bytes'];
  proposalId: Scalars['BigInt'];
}>;


export type IGetProposalsDetailsQuery = { __typename?: 'Query', proposals: Array<{ __typename?: 'Proposal', proposalId: string, contractAddress: string, eta: string, description: string, startBlock: string, startDate: string, endBlock: string, proposer: string, forVotesAmount: string, againstVotesAmount: string, votes: Array<{ __typename?: 'Vote', isPro: boolean, votes: string, txHash: string, voter: string }>, actions: Array<{ __typename?: 'ProposalAction', calldata: string, contract: string, signature: string }> }> };

export type IGetProposalsQueryVariables = Exact<{
  contractAddress: Scalars['Bytes'];
}>;


export type IGetProposalsQuery = { __typename?: 'Query', proposals: Array<{ __typename?: 'Proposal', createdAt: string, description: string, startDate: string, startBlock: string, endBlock: string, proposalId: string, contractAddress: string }> };

export type IGetUserProposalsQueryVariables = Exact<{
  contractAddress: Scalars['Bytes'];
  proposerAddress: Scalars['Bytes'];
}>;


export type IGetUserProposalsQuery = { __typename?: 'Query', proposals: Array<{ __typename?: 'Proposal', createdAt: string, description: string, startDate: string, startBlock: string, endBlock: string, proposalId: string, contractAddress: string }> };

export type IGetAllProposalsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type IGetAllProposalsSubscription = { __typename?: 'Subscription', proposals: Array<{ __typename?: 'Proposal', createdAt: string, description: string, startDate: string, startBlock: string, endBlock: string, proposalId: string, contractAddress: string }> };

export type IGetTransactionsQueryVariables = Exact<{
  user: Scalars['Bytes'];
}>;


export type IGetTransactionsQuery = { __typename?: 'Query', xusdTransactions: Array<{ __typename?: 'XusdTransaction', id: string, event: IEvent, txHash: string, date: string, asset: string, amount: string, user: string }> };


export const GetUserDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "getUser" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "contractAddress" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "ID" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "user" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "id" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "contractAddress" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "allStakes" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "orderBy" }, "value": { "kind": "EnumValue", "value": "blockTimestamp" } }, { "kind": "Argument", "name": { "kind": "Name", "value": "orderDirection" }, "value": { "kind": "EnumValue", "value": "desc" } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "staker" } }, { "kind": "Field", "name": { "kind": "Name", "value": "amount" } }, { "kind": "Field", "name": { "kind": "Name", "value": "lockedUntil" } }, { "kind": "Field", "name": { "kind": "Name", "value": "totalStaked" } }, { "kind": "Field", "name": { "kind": "Name", "value": "transactionHash" } }, { "kind": "Field", "name": { "kind": "Name", "value": "blockTimestamp" } }] } }] } }] } }] } as unknown as DocumentNode<IGetUserQuery, IGetUserQueryVariables>;
export const StakingHistoryDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "subscription", "name": { "kind": "Name", "value": "stakingHistory" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "contractAddress" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "ID" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "user" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "id" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "contractAddress" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "allStakes" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "orderBy" }, "value": { "kind": "EnumValue", "value": "blockTimestamp" } }, { "kind": "Argument", "name": { "kind": "Name", "value": "orderDirection" }, "value": { "kind": "EnumValue", "value": "desc" } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "staker" } }, { "kind": "Field", "name": { "kind": "Name", "value": "amount" } }, { "kind": "Field", "name": { "kind": "Name", "value": "lockedUntil" } }, { "kind": "Field", "name": { "kind": "Name", "value": "totalStaked" } }, { "kind": "Field", "name": { "kind": "Name", "value": "transactionHash" } }, { "kind": "Field", "name": { "kind": "Name", "value": "blockTimestamp" } }] } }] } }] } }] } as unknown as DocumentNode<IStakingHistorySubscription, IStakingHistorySubscriptionVariables>;
export const GetProposalsDetailsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "getProposalsDetails" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "contractAddress" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "Bytes" } } } }, { "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "proposalId" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "BigInt" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "proposals" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "where" }, "value": { "kind": "ObjectValue", "fields": [{ "kind": "ObjectField", "name": { "kind": "Name", "value": "contractAddress" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "contractAddress" } } }, { "kind": "ObjectField", "name": { "kind": "Name", "value": "proposalId" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "proposalId" } } }] } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "proposalId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "contractAddress" } }, { "kind": "Field", "name": { "kind": "Name", "value": "eta" } }, { "kind": "Field", "name": { "kind": "Name", "value": "description" } }, { "kind": "Field", "name": { "kind": "Name", "value": "startBlock" } }, { "kind": "Field", "name": { "kind": "Name", "value": "startDate" } }, { "kind": "Field", "name": { "kind": "Name", "value": "endBlock" } }, { "kind": "Field", "name": { "kind": "Name", "value": "proposer" } }, { "kind": "Field", "name": { "kind": "Name", "value": "forVotesAmount" } }, { "kind": "Field", "name": { "kind": "Name", "value": "againstVotesAmount" } }, { "kind": "Field", "name": { "kind": "Name", "value": "votes" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "isPro" } }, { "kind": "Field", "name": { "kind": "Name", "value": "votes" } }, { "kind": "Field", "name": { "kind": "Name", "value": "txHash" } }, { "kind": "Field", "name": { "kind": "Name", "value": "voter" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "actions" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "calldata" } }, { "kind": "Field", "name": { "kind": "Name", "value": "contract" } }, { "kind": "Field", "name": { "kind": "Name", "value": "signature" } }] } }] } }] } }] } as unknown as DocumentNode<IGetProposalsDetailsQuery, IGetProposalsDetailsQueryVariables>;
export const GetProposalsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "getProposals" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "contractAddress" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "Bytes" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "proposals" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "where" }, "value": { "kind": "ObjectValue", "fields": [{ "kind": "ObjectField", "name": { "kind": "Name", "value": "contractAddress" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "contractAddress" } } }] } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "createdAt" } }, { "kind": "Field", "name": { "kind": "Name", "value": "description" } }, { "kind": "Field", "name": { "kind": "Name", "value": "startDate" } }, { "kind": "Field", "name": { "kind": "Name", "value": "startBlock" } }, { "kind": "Field", "name": { "kind": "Name", "value": "endBlock" } }, { "kind": "Field", "name": { "kind": "Name", "value": "proposalId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "contractAddress" } }] } }] } }] } as unknown as DocumentNode<IGetProposalsQuery, IGetProposalsQueryVariables>;
export const GetUserProposalsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "getUserProposals" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "contractAddress" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "Bytes" } } } }, { "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "proposerAddress" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "Bytes" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "proposals" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "where" }, "value": { "kind": "ObjectValue", "fields": [{ "kind": "ObjectField", "name": { "kind": "Name", "value": "contractAddress" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "contractAddress" } } }, { "kind": "ObjectField", "name": { "kind": "Name", "value": "proposer" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "proposerAddress" } } }] } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "createdAt" } }, { "kind": "Field", "name": { "kind": "Name", "value": "description" } }, { "kind": "Field", "name": { "kind": "Name", "value": "startDate" } }, { "kind": "Field", "name": { "kind": "Name", "value": "startBlock" } }, { "kind": "Field", "name": { "kind": "Name", "value": "endBlock" } }, { "kind": "Field", "name": { "kind": "Name", "value": "proposalId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "contractAddress" } }] } }] } }] } as unknown as DocumentNode<IGetUserProposalsQuery, IGetUserProposalsQueryVariables>;
export const GetAllProposalsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "subscription", "name": { "kind": "Name", "value": "getAllProposals" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "proposals" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "orderBy" }, "value": { "kind": "EnumValue", "value": "createdAt" } }, { "kind": "Argument", "name": { "kind": "Name", "value": "orderDirection" }, "value": { "kind": "EnumValue", "value": "desc" } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "createdAt" } }, { "kind": "Field", "name": { "kind": "Name", "value": "description" } }, { "kind": "Field", "name": { "kind": "Name", "value": "startDate" } }, { "kind": "Field", "name": { "kind": "Name", "value": "startBlock" } }, { "kind": "Field", "name": { "kind": "Name", "value": "endBlock" } }, { "kind": "Field", "name": { "kind": "Name", "value": "proposalId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "contractAddress" } }] } }] } }] } as unknown as DocumentNode<IGetAllProposalsSubscription, IGetAllProposalsSubscriptionVariables>;
export const GetTransactionsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "getTransactions" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "user" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "Bytes" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "xusdTransactions" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "orderBy" }, "value": { "kind": "EnumValue", "value": "date" } }, { "kind": "Argument", "name": { "kind": "Name", "value": "where" }, "value": { "kind": "ObjectValue", "fields": [{ "kind": "ObjectField", "name": { "kind": "Name", "value": "user" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "user" } } }] } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "event" } }, { "kind": "Field", "name": { "kind": "Name", "value": "txHash" } }, { "kind": "Field", "name": { "kind": "Name", "value": "date" } }, { "kind": "Field", "name": { "kind": "Name", "value": "asset" } }, { "kind": "Field", "name": { "kind": "Name", "value": "amount" } }, { "kind": "Field", "name": { "kind": "Name", "value": "user" } }] } }] } }] } as unknown as DocumentNode<IGetTransactionsQuery, IGetTransactionsQueryVariables>;
