import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {
  BaseRowData,
  DataTableProps,
  DataTableRowProps,
  LoadingStateRowProps,
  TableEmptyProps,
  DataTableBodyProps,
} from './DataTable.types';
import { colors } from '../../theme/palette';

export const DataTable = <Data extends BaseRowData = BaseRowData>({
  data,
  state,
  columns,
  containerSx,
  tableTitle,
  tableAction,
  tableEmptyMessage = 'No items yet',
}: DataTableProps<Data>) => {
  const isUpdate = state === 'loading' && data.length > 0;

  return (
    <TableContainer
      sx={{
        maxHeight: 400,
        borderRadius: 2,
        backgroundImage: (theme) => theme.palette.boxGradient,
        ...containerSx,
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ border: 'none' }}>
            <TableCell
              sx={{
                padding: ({ spacing }) => spacing(2, 1.25),
              }}
              colSpan={columns.length - 1}
            >
              <Typography variant="h4" component="div" sx={{ display: 'flex' }}>
                {tableTitle}
                {isUpdate && (
                  <CircularProgress size={16} color="primary" sx={{ ml: 1 }} />
                )}
              </Typography>
            </TableCell>
            <TableCell colSpan={1}>{tableAction}</TableCell>
          </TableRow>
        </TableHead>

        <TableHead
          sx={{
            backgroundColor: colors.darkBlue,
          }}
        >
          <TableRow>
            {columns.map(({ label }, headIndex) => (
              <TableCell
                sx={{
                  padding: ({ spacing }) => spacing(1.0625, 1.25),
                  lineHeight: 2.575,
                }}
                key={headIndex}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          <DataTableBody
            data={data}
            state={state}
            columns={columns}
            tableEmptyMessage={tableEmptyMessage}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const DataTableBody = <Data extends BaseRowData = BaseRowData>({
  data,
  state,
  columns,
  tableEmptyMessage = 'No items yet',
}: DataTableBodyProps<Data>) => {
  if (state === 'failure') {
    return <FailureStateRow />;
  }

  if (state === 'loading' && !data.length) {
    return <LoadingStateRow columns={columns} />;
  }

  if (!data.length) {
    return <TableEmpty message={tableEmptyMessage} />;
  }

  return (
    <>
      {data.map((rowData, rowIndex) => (
        <DataTableRow
          key={rowIndex}
          columns={columns}
          rowIndex={rowIndex}
          rowData={rowData}
        />
      ))}
    </>
  );
};

const DataTableRow = <Data extends BaseRowData = BaseRowData>({
  rowIndex,
  columns,
  rowData,
}: DataTableRowProps<Data>) => (
  <TableRow
    key={rowIndex}
    sx={{
      '&:nth-of-type(even)': {
        backgroundColor: colors.darkBlue,
      },
    }}
  >
    {columns.map((column, cellIndex) => {
      const { component: CellComponent, format, name } = column;
      const value = format ? format(rowData[name]) : rowData[name];

      return (
        <TableCell
          key={cellIndex}
          sx={{
            lineHeight: 2.575,
            padding: ({ spacing }) => spacing(1.0625, 1.25),
          }}
        >
          {CellComponent ? (
            <CellComponent
              rowIndex={rowIndex}
              rowData={rowData}
              value={value}
            />
          ) : (
            value
          )}
        </TableCell>
      );
    })}
  </TableRow>
);

const LoadingStateRow = <Data extends BaseRowData = BaseRowData>({
  columns,
}: LoadingStateRowProps<Data>) => (
  <TableRow data-testid="loading-state-row">
    {columns.map((_, cellIndex) => (
      <TableCell
        sx={{
          padding: ({ spacing }) => spacing(2.0625, 1.25),
          lineHeight: 2.4,
        }}
        key={cellIndex}
      >
        <Skeleton />
      </TableCell>
    ))}
  </TableRow>
);

const TableEmpty = ({ message }: TableEmptyProps) => (
  <TableRow>
    <Box component="td" py={3} px={1.25} color="rgba(255,255,255,0.5)">
      {message}
    </Box>
  </TableRow>
);

const FailureStateRow = () => (
  <TableRow>
    <Typography
      color="error"
      component="td"
      data-testid="error-state-row"
      sx={{ py: 3, px: 1 }}
    >
      Unable to load data!
    </Typography>
  </TableRow>
);
