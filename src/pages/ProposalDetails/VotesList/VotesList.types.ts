export type VotesListItem = {
  address: string;
  txHash: string;
  votes: string;
};

export type VotesListComponentProps = {
  votes: VotesListItem[];
  type: 'for' | 'against';
};

export type TableIconProps = {
  children: React.ReactNode;
};
