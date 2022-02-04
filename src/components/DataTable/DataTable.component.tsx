import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { DataTableProps, DataTableRowProps } from './DataTable.types';

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

export const DataTable = ({
  data,
  columns,
  tableTitle,
  tableAction,
  containerSx = {},
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
        {data.map((rowData, rowIndex) => (
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
