import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Proposal } from '../../store/proposals/proposals.state';
import { ProposalState, proposalStateNames } from '../../constants';
import { formatBlockNumber, formatTimestamp } from '../../utils/helpers';

import {
  CustomColumn,
  DataTableColumn,
} from '../../components/DataTable/DataTable.types';
import { DataTable } from '../../components/DataTable/DataTable.component';
import { PageView } from '../../components/PageView/PageView.component';

import { ProposalsListComponentProps } from './ProposalsList.types';

// /** Needed because DataTable is not accepting booleans */
type RowData = Omit<Proposal, 'canceled' | 'executed'>;

const ViewProposalComponent: CustomColumn<RowData> = ({ value }) => (
  <MuiLink component={Link} color="textPrimary" to={String(value)}>
    View Proposal
  </MuiLink>
);

const proposalsListColumns: DataTableColumn<RowData>[] = [
  { label: 'title', name: 'id' },
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
}: ProposalsListComponentProps) => (
  <PageView
    title={
      <Typography variant="h2" padding={1}>
        BABELFISH BITOCRACY
      </Typography>
    }
  >
    <DataTable
      data={proposals as RowData[]}
      isLoading={state === 'loading'}
      columns={proposalsListColumns}
      tableTitle="GOVERNANCE PROPOSALS"
      tableAction={<Button variant="text">+CREATE PROPOSAL</Button>}
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
  </PageView>
);
