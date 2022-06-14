/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n  query getUser($contractAddress: ID!) {\n    user(id: $contractAddress) {\n      id\n      allStakes(orderBy: blockTimestamp, orderDirection: desc) {\n        id\n        staker\n        amount\n        lockedUntil\n        totalStaked\n        transactionHash\n        blockTimestamp\n      }\n    }\n  }\n": graphql.GetUserDocument,
    "\n  subscription stakingHistory($contractAddress: ID!) {\n    user(id: $contractAddress) {\n      id\n      allStakes(orderBy: blockTimestamp, orderDirection: desc) {\n        id\n        staker\n        amount\n        lockedUntil\n        totalStaked\n        transactionHash\n        blockTimestamp\n      }\n    }\n  }\n": graphql.StakingHistoryDocument,
    "\n  query getProposalsDetails($contractAddress: Bytes!, $proposalId: BigInt!) {\n    proposals(\n      where: { contractAddress: $contractAddress, proposalId: $proposalId }\n    ) {\n      proposalId\n      contractAddress\n      eta\n      description\n      startBlock\n      startDate\n      endBlock\n      proposer\n      forVotesAmount\n      againstVotesAmount\n      votes {\n        isPro\n        votes\n        txHash\n        voter\n      }\n      actions {\n        calldata\n        contract\n        signature\n      }\n    }\n  }\n": graphql.GetProposalsDetailsDocument,
    "\n  query getProposals($contractAddress: Bytes!) {\n    proposals(where: { contractAddress: $contractAddress }) {\n      createdAt\n      description\n      startDate\n      startBlock\n      endBlock\n      proposalId\n      contractAddress\n    }\n  }\n": graphql.GetProposalsDocument,
    "\n  query getUserProposals($contractAddress: Bytes!, $proposerAddress: Bytes!) {\n    proposals(\n      where: { contractAddress: $contractAddress, proposer: $proposerAddress }\n    ) {\n      createdAt\n      description\n      startDate\n      startBlock\n      endBlock\n      proposalId\n      contractAddress\n    }\n  }\n": graphql.GetUserProposalsDocument,
    "\n  subscription getAllProposals {\n    proposals(orderBy: createdAt, orderDirection: desc) {\n      createdAt\n      description\n      startDate\n      startBlock\n      endBlock\n      proposalId\n      contractAddress\n    }\n  }\n": graphql.GetAllProposalsDocument,
    "\n  query getTransactions($user: Bytes!) {\n    xusdTransactions(orderBy: date, where: { user: $user }) {\n      id\n      event\n      txHash\n      date\n      asset\n      amount\n      user\n    }\n  }\n": graphql.GetTransactionsDocument,
};

export function gql(source: "\n  query getUser($contractAddress: ID!) {\n    user(id: $contractAddress) {\n      id\n      allStakes(orderBy: blockTimestamp, orderDirection: desc) {\n        id\n        staker\n        amount\n        lockedUntil\n        totalStaked\n        transactionHash\n        blockTimestamp\n      }\n    }\n  }\n"): (typeof documents)["\n  query getUser($contractAddress: ID!) {\n    user(id: $contractAddress) {\n      id\n      allStakes(orderBy: blockTimestamp, orderDirection: desc) {\n        id\n        staker\n        amount\n        lockedUntil\n        totalStaked\n        transactionHash\n        blockTimestamp\n      }\n    }\n  }\n"];
export function gql(source: "\n  subscription stakingHistory($contractAddress: ID!) {\n    user(id: $contractAddress) {\n      id\n      allStakes(orderBy: blockTimestamp, orderDirection: desc) {\n        id\n        staker\n        amount\n        lockedUntil\n        totalStaked\n        transactionHash\n        blockTimestamp\n      }\n    }\n  }\n"): (typeof documents)["\n  subscription stakingHistory($contractAddress: ID!) {\n    user(id: $contractAddress) {\n      id\n      allStakes(orderBy: blockTimestamp, orderDirection: desc) {\n        id\n        staker\n        amount\n        lockedUntil\n        totalStaked\n        transactionHash\n        blockTimestamp\n      }\n    }\n  }\n"];
export function gql(source: "\n  query getProposalsDetails($contractAddress: Bytes!, $proposalId: BigInt!) {\n    proposals(\n      where: { contractAddress: $contractAddress, proposalId: $proposalId }\n    ) {\n      proposalId\n      contractAddress\n      eta\n      description\n      startBlock\n      startDate\n      endBlock\n      proposer\n      forVotesAmount\n      againstVotesAmount\n      votes {\n        isPro\n        votes\n        txHash\n        voter\n      }\n      actions {\n        calldata\n        contract\n        signature\n      }\n    }\n  }\n"): (typeof documents)["\n  query getProposalsDetails($contractAddress: Bytes!, $proposalId: BigInt!) {\n    proposals(\n      where: { contractAddress: $contractAddress, proposalId: $proposalId }\n    ) {\n      proposalId\n      contractAddress\n      eta\n      description\n      startBlock\n      startDate\n      endBlock\n      proposer\n      forVotesAmount\n      againstVotesAmount\n      votes {\n        isPro\n        votes\n        txHash\n        voter\n      }\n      actions {\n        calldata\n        contract\n        signature\n      }\n    }\n  }\n"];
export function gql(source: "\n  query getProposals($contractAddress: Bytes!) {\n    proposals(where: { contractAddress: $contractAddress }) {\n      createdAt\n      description\n      startDate\n      startBlock\n      endBlock\n      proposalId\n      contractAddress\n    }\n  }\n"): (typeof documents)["\n  query getProposals($contractAddress: Bytes!) {\n    proposals(where: { contractAddress: $contractAddress }) {\n      createdAt\n      description\n      startDate\n      startBlock\n      endBlock\n      proposalId\n      contractAddress\n    }\n  }\n"];
export function gql(source: "\n  query getUserProposals($contractAddress: Bytes!, $proposerAddress: Bytes!) {\n    proposals(\n      where: { contractAddress: $contractAddress, proposer: $proposerAddress }\n    ) {\n      createdAt\n      description\n      startDate\n      startBlock\n      endBlock\n      proposalId\n      contractAddress\n    }\n  }\n"): (typeof documents)["\n  query getUserProposals($contractAddress: Bytes!, $proposerAddress: Bytes!) {\n    proposals(\n      where: { contractAddress: $contractAddress, proposer: $proposerAddress }\n    ) {\n      createdAt\n      description\n      startDate\n      startBlock\n      endBlock\n      proposalId\n      contractAddress\n    }\n  }\n"];
export function gql(source: "\n  subscription getAllProposals {\n    proposals(orderBy: createdAt, orderDirection: desc) {\n      createdAt\n      description\n      startDate\n      startBlock\n      endBlock\n      proposalId\n      contractAddress\n    }\n  }\n"): (typeof documents)["\n  subscription getAllProposals {\n    proposals(orderBy: createdAt, orderDirection: desc) {\n      createdAt\n      description\n      startDate\n      startBlock\n      endBlock\n      proposalId\n      contractAddress\n    }\n  }\n"];
export function gql(source: "\n  query getTransactions($user: Bytes!) {\n    xusdTransactions(orderBy: date, where: { user: $user }) {\n      id\n      event\n      txHash\n      date\n      asset\n      amount\n      user\n    }\n  }\n"): (typeof documents)["\n  query getTransactions($user: Bytes!) {\n    xusdTransactions(orderBy: date, where: { user: $user }) {\n      id\n      event\n      txHash\n      date\n      asset\n      amount\n      user\n    }\n  }\n"];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;