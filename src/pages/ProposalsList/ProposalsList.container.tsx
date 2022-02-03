import React from 'react';
import { Proposal } from './ProposalsList.types';
import { ProposalsListComponent } from './ProposalsList.component';

const proposalsDataMock: Proposal[] = [
  {
    name: '004SIP-0018:BabelFish',
    startBlock: 3347625,
    voteVeight: 'Active',
    endDate: '03/10/21, 12:57pm',
    isWinning: 'true',
    id: '123',
  },
  {
    name: '005SIP-0018:BabelFish',
    startBlock: 3347624,
    voteVeight: 'Executed',
    endDate: '03/10/21, 12:57pm',
    isWinning: 'true',
    id: '1234',
  },
  {
    name: '007SIP-0018:BabelFish',
    startBlock: 3347623,
    voteVeight: 'Executed',
    endDate: '03/10/21, 12:57pm',
    isWinning: 'true',
    id: '223',
  },
  {
    name: '001SIP-0018:BabelFish',
    startBlock: 3347625,
    voteVeight: 'Active',
    endDate: '03/10/21, 12:57pm',
    isWinning: 'false',
    id: '423',
  },
  {
    name: '001SIP-0018:BabelFish',
    startBlock: 3347625,
    voteVeight: 'Active',
    endDate: '03/10/21, 12:57pm',
    isWinning: 'false',
    id: '523',
  },
  {
    name: '001SIP-0018:BabelFish',
    startBlock: 3347625,
    voteVeight: 'Active',
    endDate: '03/10/21, 12:57pm',
    isWinning: 'true',
    id: '623',
  },
  {
    name: '001SIP-0018:BabelFish',
    startBlock: 3347625,
    voteVeight: 'Active',
    endDate: '03/10/21, 12:57pm',
    isWinning: 'true',
    id: '723',
  },
];

export const ProposalsListContainer = () => {
  return <ProposalsListComponent proposals={proposalsDataMock} />;
};
