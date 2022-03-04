import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';
import {
  BaseRowData,
  DataTableProps,
  DataTableRowProps,
  LoadingStateRowProps,
} from './DataTable.types';

export const DataTable = <Data extends BaseRowData = BaseRowData>({
  data,
  columns,
  isLoading,
  tableTitle,
  tableAction,
  containerSx,
}: DataTableProps<Data>) => {
  const isUpdate = isLoading && data.length > 0;
  const isInitialLoad = isLoading && !data.length;

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
            <TableCell colSpan={columns.length - 1}>
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

        <TableHead>
          <TableRow>
            {columns.map(({ label }, headIndex) => (
              <TableCell key={headIndex}>{label}</TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {isInitialLoad && <LoadingStateRow columns={columns} />}
          {!isInitialLoad &&
            data.length > 0 &&
            data.map((rowData, rowIndex) => (
              <DataTableRow
                key={rowIndex}
                columns={columns}
                rowIndex={rowIndex}
                rowData={rowData}
              />
            ))}
          {!isInitialLoad && data.length === 0 && <TableEmpty />}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

DataTable.defaultProps = {
  isLoading: false,
  containerSx: {},
};

const DataTableRow = <Data extends BaseRowData = BaseRowData>({
  rowIndex,
  columns,
  rowData,
}: DataTableRowProps<Data>) => (
  <TableRow key={rowIndex}>
    {columns.map((column, cellIndex) => {
      const { component: CellComponent, format, name } = column;
      const value = format ? format(rowData[name]) : rowData[name];

      return (
        <TableCell key={cellIndex}>
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
  <TableRow data-testId="loading-state-row">
    {columns.map((_, cellIndex) => (
      <TableCell key={cellIndex}>
        <Skeleton />
      </TableCell>
    ))}
  </TableRow>
);

const TableEmpty: React.FC = () => (
  <TableRow>
    <Box py={3} px={1.25} color="rgba(255,255,255,0.5)">
      No stakes yet.
    </Box>
  </TableRow>
);
