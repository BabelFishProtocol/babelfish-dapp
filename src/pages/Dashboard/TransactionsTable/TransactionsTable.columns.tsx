import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CustomColumn } from '../../../components/DataTable/DataTable.types';
import { formatTimestamp } from '../../../utils/helpers';
import {
  TableToolipProps,
  TooltipCopyProps,
  TransactionsTableItem,
} from './TransactionsTable.types';

export const formatDate = (timestamp?: number | string) =>
  timestamp ? formatTimestamp(timestamp) : '------';

const TooltipCopy = ({ firstLine, secondLine }: TooltipCopyProps) => (
  <Box textAlign="center">
    <p>{firstLine}</p>
    <p>{secondLine}</p>
  </Box>
);

const DepositSucces = (
  <TooltipCopy
    firstLine="Your transaction has been transferred to the bridge,"
    secondLine="you may have to wait a little bit before you receive tokens on RSK."
  />
);

const WithdrawSucces = (
  <TooltipCopy
    firstLine="Your RSK transaction has been processed correctly,"
    secondLine=" you may have to wait a little bit before you receive tokens on the destination blockchain."
  />
);

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

const StatusMessage = ({ message, tip }: TableToolipProps) =>
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
    return <StatusMessage message={value} tip={DepositSucces} />;
  }

  if (
    rowData.event === 'Withdraw' &&
    rowData.status === 'Confirmed' &&
    rowData.isCrossChain
  ) {
    return <StatusMessage message={value} tip={WithdrawSucces} />;
  }

  return <StatusMessage message={value} />;
};
