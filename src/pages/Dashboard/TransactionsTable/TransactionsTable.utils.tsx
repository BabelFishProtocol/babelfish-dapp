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

const statusTooltip = {
  crossChainDepoFail: 'cross chain depo copy fail',
  crossChainDepoSucces: 'cross chain depo copy succes',
};

const QuestionMark = () => (
  <Typography
    component="span"
    sx={{
      fontSize: '11px',
      mb: '3px',
      p: '1px 3px 0px',
      borderRadius: '24%',
      backgroundColor: ({ palette }) => palette.background.default,
    }}
  >
    ?
  </Typography>
);

const TableToolip = ({ message, tip }: TableToolipProps) =>
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

export const StatusInfo: CustomColumn<TransactionsTableItem> = ({
  value,
  rowData,
}) => {
  if (
    rowData.isCrossChain &&
    rowData.event === 'Deposit' &&
    rowData.status === 'Failed'
  ) {
    return (
      <TableToolip message={value} tip={statusTooltip.crossChainDepoFail} />
    );
  }

  if (
    rowData.isCrossChain &&
    rowData.event === 'Deposit' &&
    rowData.status === 'Confirmed'
  ) {
    return (
      <TableToolip message={value} tip={statusTooltip.crossChainDepoSucces} />
    );
  }

  // TODO remove this case
  return (
    <TableToolip message={value} tip={statusTooltip.crossChainDepoSucces} />
  );

  // TODO uncomment, this should be the default one
  // return (
  //   <TableToolip message={value}/>
  // );
};
