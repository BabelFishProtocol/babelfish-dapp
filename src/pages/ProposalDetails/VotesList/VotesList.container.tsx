import { VotesListComponent } from './VotesList.component';
import { VotesListItem } from './VotesList.types';

const votesFor: VotesListItem[] = [
  {
    address: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
    txHash:
      '0xadb9ea14f77e9e8bad80a78cbf0e84199e892a9b090e5f96dbc398e3a3778bf6',
    votes: '100',
  },
  {
    address: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
    txHash:
      '0xadb9ea14f77e9e8bad80a78cbf0e84199e892a9b090e5f96dbc398e3a3778bf6',
    votes: '100',
  },
  {
    address: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
    txHash:
      '0xadb9ea14f77e9e8bad80a78cbf0e84199e892a9b090e5f96dbc398e3a3778bf6',
    votes: '100',
  },
];

const votesAgainst: VotesListItem[] = [
  {
    address: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
    txHash:
      '0xadb9ea14f77e9e8bad80a78cbf0e84199e892a9b090e5f96dbc398e3a3778bf6',
    votes: '200',
  },
  {
    address: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
    txHash:
      '0xadb9ea14f77e9e8bad80a78cbf0e84199e892a9b090e5f96dbc398e3a3778bf6',
    votes: '300',
  },
];

export const AgainstVotesListContainer = () => (
  <VotesListComponent votes={votesAgainst} type="against" />
);

export const ForVotesListContainer = () => (
  <VotesListComponent votes={votesFor} type="for" />
);
