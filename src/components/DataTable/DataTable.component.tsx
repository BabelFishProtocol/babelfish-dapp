import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import {
  DataTableProps,
  DataTableRowProps,
  LoadingStateRowProps,
} from './DataTable.types';

export const DataTable = ({
  data,
  columns,
  isLoading,
  tableTitle,
  tableAction,
  containerSx,
}: DataTableProps) => (
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
            <Typography variant="h4">{tableTitle}</Typography>
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
        {isLoading && <LoadingStateRow columns={columns} />}
        {!isLoading &&
          data.map((rowData, rowIndex) => (
            <DataTableRow
              key={rowIndex}
              columns={columns}
              rowIndex={rowIndex}
              rowData={rowData}
            />
          ))}
      </TableBody>
    </Table>
  </TableContainer>
);

DataTable.defaultProps = {
  isLoading: false,
  containerSx: {},
};

const DataTableRow = ({ rowIndex, columns, rowData }: DataTableRowProps) => (
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

const LoadingStateRow = ({ columns }: LoadingStateRowProps) => (
  <TableRow>
    {columns.map((_, cellIndex) => (
      <TableCell key={cellIndex}>
        <Skeleton />
      </TableCell>
    ))}
  </TableRow>
);
