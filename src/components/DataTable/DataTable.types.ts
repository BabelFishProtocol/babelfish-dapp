import { TableContainerProps } from '@mui/material/TableContainer';

export type CustomColumnProps<Data extends BaseRowData = BaseRowData> = {
  rowIndex: number;
  value: CellData;
  rowData: Data;
};

export type CustomColumn = (props: CustomColumnProps) => JSX.Element;

type CellData = string | number;

export type BaseRowData = {
  [key: string]: CellData;
};

export type CellParser = (val: CellData) => CellData;

export type DataTableColumn<Data extends BaseRowData = BaseRowData> = {
  label: React.ReactNode;
  name: keyof Data;
  format?: CellParser;
  component?: CustomColumn;
};

export type DataTableProps<Data extends BaseRowData = BaseRowData> = {
  tableTitle: React.ReactNode;
  tableAction?: React.ReactNode;
  columns: DataTableColumn<Data>[];
  data: Data[];
  isLoading?: boolean;
  containerSx?: TableContainerProps['sx'];
};

export type LoadingStateRowProps<Data extends BaseRowData = BaseRowData> = Pick<
  DataTableRowProps<Data>,
  'columns'
>;

export type DataTableRowProps<Data extends BaseRowData = BaseRowData> = {
  rowIndex: number;
  columns: DataTableColumn<Data>[];
  rowData: Data;
};
