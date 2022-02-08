import { TableContainerProps } from '@mui/material/TableContainer';

export type CustomColumnProps = {
  rowIndex: number;
  value: CellData;
  rowData: RowData;
};

export type CustomColumn = (props: CustomColumnProps) => JSX.Element;
type CellData = string | number;
type RowData = {
  [key: string]: CellData;
};

export type CellParser = (val: CellData) => CellData;

export type DataTableColumn = {
  label: React.ReactNode;
  name: string;
  format?: CellParser;
  component?: CustomColumn;
};

export type DataTableProps = {
  tableTitle: React.ReactNode;
  tableAction?: React.ReactNode;
  columns: DataTableColumn[];
  data: RowData[];
  isLoading?: boolean;
  containerSx?: TableContainerProps['sx'];
};

export type LoadingStateRowProps = Pick<DataTableRowProps, 'columns'>;

export type DataTableRowProps = {
  rowIndex: number;
  columns: DataTableColumn[];
  rowData: RowData;
};
