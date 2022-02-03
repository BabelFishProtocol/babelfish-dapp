import React from 'react';
import { Link } from 'react-router-dom';

import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';

import {
  CustomColumn,
  DataTableColumn,
} from '../../components/DataTable/DataTable.types';
import { DataTable } from '../../components/DataTable/DataTable.component';
import { Urls } from '../../constants';

import { ProposalsListComponentProps } from './ProposalsList.types';

const PageContent = styled('div')(({ theme }) => ({
  borderRadius: 8,
  backgroundImage: theme.palette.boxGradient,
  width: '80%',
  maxWidth: 1100,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

const PageAligner = styled('div')({
  width: '100%',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const PageHeader = styled('div')(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.borderGrey.main}`,
  padding: theme.spacing(1),
  paddingBottom: 6,
}));

const ContentContainer = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(4)} ${theme.spacing(3)}`,
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
}));

const ViewProposalComponent: CustomColumn = ({ value }) => {
  return (
    <MuiLink
      component={Link}
      color="textPrimary"
      to={`${Urls.Proposal}/${value}`}
    >
      View Proposal
    </MuiLink>
  );
};

const VoteWeightComponent: CustomColumn = ({ value, rowData }) => {
  const dotColor = rowData.isWinning === 'true' ? 'success' : 'error';

  return (
    <>
      <Badge variant="dot" sx={{ marginRight: 2 }} color={dotColor} />
      {value}
    </>
  );
};

const formatBlockNumber = (val: string | number) => `#${val}`;

const proposalsListColumns: DataTableColumn[] = [
  { label: 'title', name: 'name' },
  { label: 'start block', name: 'startBlock', format: formatBlockNumber },
  { label: 'vote weight', name: 'voteVeight', component: VoteWeightComponent },
  { label: 'voting ends', name: 'endDate' },
  { label: 'action', name: 'id', component: ViewProposalComponent },
];

export const ProposalsListComponent = ({
  proposals,
}: ProposalsListComponentProps) => {
  return (
    <PageAligner>
      <PageContent>
        <PageHeader>
          <Typography variant="h2" padding={1}>
            BABELFISH BITOCRACY
          </Typography>
        </PageHeader>
        <ContentContainer>
          <DataTable
            data={proposals}
            columns={proposalsListColumns}
            tableTitle="GOVERNANCE PROPOSALS"
            tableAction={<Button variant="text">+ CREATE PROPOSAL</Button>}
          />
          <ButtonContainer>
            <Button variant="outlined">View All Proposals</Button>
          </ButtonContainer>
        </ContentContainer>
      </PageContent>
    </PageAligner>
  );
};
