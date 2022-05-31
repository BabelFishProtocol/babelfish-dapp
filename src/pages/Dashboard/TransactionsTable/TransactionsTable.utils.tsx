import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  CellData,
  CustomColumn,
} from '../../../components/DataTable/DataTable.types';
import { formatTimestamp } from '../../../utils/helpers';
import { TransactionsTableItem } from './TransactionsTable.types';

export const formatDate = (timestamp?: number | string) =>
  timestamp ? formatTimestamp(timestamp) : '------';

type TableToolipProps = {
  message: CellData;
  tip?: string;
};

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

  // TODO uncomment
  // if (rowData.status === 'Failed') {
  //   return (
  //     <TableToolip message={value}/>
  //   );
  // }

  return (
    <TableToolip message={value} tip={statusTooltip.crossChainDepoSucces} />
  );

  // TODO uncomment
  // return (
  //   <TableToolip message={value}/>
  // );
};
