import React from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  CustomColumn,
  DataTableColumn,
} from '../../components/DataTable/DataTable.types';
import { DataTable } from '../../components/DataTable/DataTable.component';
import { PageView } from '../../components/PageView/PageView.component';

import { Proposal, ProposalsListComponentProps } from './ProposalsList.types';

const ViewProposalComponent: CustomColumn = ({ value }) => (
  <MuiLink component={Link} color="textPrimary" to={String(value)}>
    View Proposal
  </MuiLink>
);

const formatBlockNumber = (val: string | number) => `#${val}`;

const proposalsListColumns: DataTableColumn<Proposal>[] = [
  { label: 'title', name: 'name' },
  { label: 'start block', name: 'startBlock', format: formatBlockNumber },
  { label: 'vote weight', name: 'voteVeight' },
  { label: 'voting ends', name: 'endDate' },
  { label: 'action', name: 'id', component: ViewProposalComponent },
];

export const ProposalsListComponent = ({
  proposals,
}: ProposalsListComponentProps) => (
  <PageView
    title={
      <Typography variant="h2" padding={1}>
        BABELFISH BITOCRACY
      </Typography>
    }
  >
    <DataTable
      data={proposals}
      columns={proposalsListColumns}
      tableTitle="GOVERNANCE PROPOSALS"
      tableAction={<Button variant="text">+CREATE PROPOSAL</Button>}
      containerSx={{ minHeight: 100 }}
    />

    <Box
      sx={{
        pt: 3,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Button variant="outlined">View All Proposals</Button>
    </Box>
  </PageView>
);
