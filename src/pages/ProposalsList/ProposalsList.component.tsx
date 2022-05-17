import { useState } from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Proposal } from '../../store/proposals/proposals.state';
import { ProposalState, proposalStateNames, UrlNames } from '../../constants';
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
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs.component';

import { AddProposalContainer } from '../AddProposal/AddProposal.container';
import { ProposalsListComponentProps } from './ProposalsList.types';
import plusSquareIcon from '../../assets/icons/plus-square.svg';

/** Needed because DataTable is not accepting booleans */
type RowData = Omit<Proposal, 'canceled' | 'executed'>;

const ViewProposalComponent: CustomColumn<RowData> = ({ value, rowData }) => (
  <Button
    sx={{
      px: 2,
      py: 0.5,
    }}
    size="small"
    variant="outlined"
    component={Link}
    to={`${rowData.governorType}/${value}`}
  >
    <Typography fontWeight="normal" textTransform="capitalize" variant="body2">
      View Proposal
    </Typography>
  </Button>
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
    <>
      <Box
        sx={{
          p: 0,
          maxWidth: { xs: 1400 },
          margin: '0 auto',
        }}
      >
        <Breadcrumbs links={[{ title: UrlNames.Proposals }]} />
      </Box>
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
              startIcon={<img src={plusSquareIcon} alt="plus" />}
              onClick={() => {
                setIsAddDialogOpen(true);
              }}
            >
              CREATE PROPOSAL
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
          <Button>View All Proposals</Button>
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
    </>
  );
};
