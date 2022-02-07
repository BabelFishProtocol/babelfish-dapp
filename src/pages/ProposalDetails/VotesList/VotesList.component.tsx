import Box from '@mui/material/Box';

import { PrettyTx } from '../../../components/PrettyTx/PrettyTx.component';
import { DataTable } from '../../../components/DataTable/DataTable.component';
import { DataTableColumn } from '../../../components/DataTable/DataTable.types';

import upvoteIcon from '../../../assets/icons/upvote.svg';
import downvoteIcon from '../../../assets/icons/downvote.svg';

import { TableIconProps, VotesListComponentProps } from './VotesList.types';

const votesColumns: DataTableColumn[] = [
  { label: 'Address', name: 'address', component: PrettyTx },
  { label: 'Tx Hash', name: 'txHash', component: PrettyTx },
  { label: 'Votes', name: 'votes' },
];

export const VotesListComponent = ({
  votes,
  type,
}: VotesListComponentProps) => (
  <DataTable
    tableTitle="Voted For"
    data={votes}
    columns={votesColumns}
    tableAction={
      <TableIcon>
        <img
          alt="votes-icon"
          src={type === 'for' ? upvoteIcon : downvoteIcon}
        />
      </TableIcon>
    }
    containerSx={{ p: 1, mt: 2, height: 260 }}
  />
);

const TableIcon = ({ children }: TableIconProps) => (
  <Box
    sx={{ display: 'flex', justifyContent: 'flex-end', '& img': { width: 26 } }}
  >
    {children}
  </Box>
);
