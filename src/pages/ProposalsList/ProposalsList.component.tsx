import { useState } from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Proposal } from '../../store/proposals/proposals.state';
import { ProposalState, proposalStateNames } from '../../constants';
import {
  formatBlockNumber,
  formatTimestamp,
  truncateString,
} from '../../utils/helpers';

import {
  CellParser,
  CustomColumn,
  DataTableColumn,
} from '../../components/DataTable/DataTable.types';
import { DataTable } from '../../components/DataTable/DataTable.component';
import { PageView } from '../../components/PageView/PageView.component';

import { AddProposalContainer } from '../AddProposal/AddProposal.container';
import { ProposalsListComponentProps } from './ProposalsList.types';

/** Needed because DataTable is not accepting booleans */
type RowData = Omit<Proposal, 'canceled' | 'executed'>;

const ViewProposalComponent: CustomColumn<RowData> = ({ value, rowData }) => (
  <MuiLink
    component={Link}
    color="textPrimary"
    to={`${rowData.governorType}/${value}`}
  >
    View Proposal
  </MuiLink>
);

const proposalsListColumns: DataTableColumn<RowData>[] = [
  { label: 'title', name: 'title', format: truncateString as CellParser },
  { label: 'start block', name: 'startBlock', format: formatBlockNumber },
  {
    label: 'vote weight',
    name: 'state',
    format: (val) => proposalStateNames[val as ProposalState],
  },
  { label: 'voting ends', name: 'endTime', format: formatTimestamp },
  { label: 'action', name: 'id', component: ViewProposalComponent },
];

export const ProposalsListComponent = ({
  state,
  proposals,
}: ProposalsListComponentProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <PageView
      title={
        <Typography variant="h2" padding={1}>
          BABELFISH BITOCRACY
        </Typography>
      }
    >
      <DataTable
        state={state}
        data={proposals as RowData[]}
        columns={proposalsListColumns}
        tableTitle="GOVERNANCE PROPOSALS"
        tableAction={
          <Button
            variant="text"
            onClick={() => {
              setIsAddDialogOpen(true);
            }}
          >
            +CREATE PROPOSAL
          </Button>
        }
        containerSx={{ minHeight: 250 }}
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

      {isAddDialogOpen && (
        <AddProposalContainer
          isOpenDialog={isAddDialogOpen}
          onClose={() => {
            setIsAddDialogOpen(false);
          }}
        />
      )}
    </PageView>
  );
};
