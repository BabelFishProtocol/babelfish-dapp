import Box from '@mui/material/Box';

import { Vote } from '../../../store/proposals/proposals.state';

import { PrettyTx } from '../../../components/PrettyTx/PrettyTx.component';
import { DataTable } from '../../../components/DataTable/DataTable.component';
import { DataTableColumn } from '../../../components/DataTable/DataTable.types';

import upvoteIcon from '../../../assets/icons/upvote.svg';
import downvoteIcon from '../../../assets/icons/downvote.svg';

import { TableIconProps, VotesListComponentProps } from './VotesBlock.types';
import { formatWeiAmount } from '../../../utils/helpers';
import { colors } from '../../../theme/palette';

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
    tableTitle={type === 'for' ? 'Voted For' : 'Voted Against'}
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
    sx={{
      width: 32,
      height: 32,
      p: 0.5,
      ml: 'auto',
      backgroundColor: colors.borderGreyDark,
      border: `2px solid ${colors.borderGrey}`,
      borderRadius: '6px',
      '& img': {
        width: '100%',
        height: '100%',
      },
    }}
  >
    {children}
  </Box>
);
