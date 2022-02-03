import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { DataTableProps, DataTableRowProps } from './DataTable.types';

export const DataTable = ({
  tableTitle,
  tableAction,
  columns,
  data,
}: DataTableProps) => {
  return (
    <TableContainer
      sx={{
        maxHeight: 400,
        borderRadius: 2,
        backgroundImage: `linear-gradient(243deg, #ffc148 0%, #786d57 0%, #424040 20%, #272626 100%)`,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
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
};

const DataTableRow = ({ rowIndex, columns, rowData }: DataTableRowProps) => {
  return (
    <TableRow key={rowIndex}>
      {columns.map((column, cellIndex) => {
        const { component: CellComponent, format, name } = column;
        let value = rowData[name];

        if (format) {
          value = format(value);
        }

        return (
          <TableCell key={cellIndex}>
            {CellComponent ? (
              <CellComponent
                rowIndex={rowIndex}
                rowData={rowData}
                value={value}
                key={cellIndex}
              />
            ) : (
              value
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
