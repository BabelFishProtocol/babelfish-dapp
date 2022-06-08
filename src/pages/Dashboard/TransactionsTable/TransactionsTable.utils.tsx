import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CustomColumn } from '../../../components/DataTable/DataTable.types';
import { formatTimestamp } from '../../../utils/helpers';
import {
  TableToolipProps,
  TransactionsTableItem,
} from './TransactionsTable.types';

export const formatDate = (timestamp?: number | string) =>
  timestamp ? formatTimestamp(timestamp) : '------';

// TODO update the copy
const statusTooltip = {
  depositSucces: 'cross chain depo copy succes',
  withdrawSucces: 'cross chain withdraw copy succes',
};

const QuestionMark = () => (
  <div>
    <Typography
      component="span"
      sx={{
        fontSize: '11px',
        mb: '3px',
        p: '1px 3px 0px',
        borderRadius: '24%',
        color: ({ palette }) => palette.grey[900],
        backgroundColor: ({ palette }) => palette.primary.main,
      }}
    >
      ?
    </Typography>
  </div>
);

const StatusMessaga = ({ message, tip }: TableToolipProps) =>
  tip ? (
    <Box sx={{ cursor: 'pointer' }} display="inline-block">
      <Tooltip arrow title={tip}>
        <Box display="flex" gap={1} alignItems="center">
          {message}
          <QuestionMark />
        </Box>
      </Tooltip>
    </Box>
  ) : (
    <span>{message}</span>
  );

export const StatusColumn: CustomColumn<TransactionsTableItem> = ({
  value,
  rowData,
}) => {
  if (
    rowData.event === 'Deposit' &&
    rowData.status === 'Confirmed' &&
    rowData.isCrossChain
  ) {
    return <StatusMessaga message={value} tip={statusTooltip.withdrawSucces} />;
  }

  if (
    rowData.event === 'Withdraw' &&
    rowData.status === 'Confirmed' &&
    rowData.isCrossChain
  ) {
    return <StatusMessaga message={value} tip={statusTooltip.depositSucces} />;
  }

  return <StatusMessaga message={value} />;
};
