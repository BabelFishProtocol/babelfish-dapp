import Box from '@mui/material/Box';

import { Vote } from '../../../store/proposals/proposals.state';

import { PrettyTx } from '../../../components/PrettyTx/PrettyTx.component';
import { DataTable } from '../../../components/DataTable/DataTable.component';
import { DataTableColumn } from '../../../components/DataTable/DataTable.types';

import upvoteIcon from '../../../assets/icons/upvote.svg';
import downvoteIcon from '../../../assets/icons/downvote.svg';

import { TableIconProps, VotesListComponentProps } from './VotesBlock.types';
import { formatWeiAmount } from '../../../utils/helpers';

type RowData = Omit<Vote, 'isPro'>;

const votesColumns: DataTableColumn<RowData>[] = [
  { label: 'Address', name: 'voter', component: PrettyTx },
  { label: 'Tx Hash', name: 'txHash', component: PrettyTx },
  { label: 'Votes', name: 'votes', format: formatWeiAmount },
];

export const VotesListComponent = ({
  votes,
  type,
  state,
}: VotesListComponentProps) => (
  <DataTable
    tableTitle="Voted For"
    data={votes as RowData[]}
    columns={votesColumns}
    tableEmptyMessage="No Votes yet"
    state={state}
    tableAction={
      <TableIcon>
        <img
          alt="votes-icon"
          src={type === 'for' ? upvoteIcon : downvoteIcon}
        />
      </TableIcon>
    }
    containerSx={{ p: 1, mt: 2, height: 300 }}
  />
);

const TableIcon = ({ children }: TableIconProps) => (
  <Box
    sx={{ display: 'flex', justifyContent: 'flex-end', '& img': { width: 26 } }}
  >
    {children}
  </Box>
);
