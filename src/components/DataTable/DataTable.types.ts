import { TableContainerProps } from '@mui/material/TableContainer';

export type CustomColumnProps<Data extends BaseRowData = BaseRowData> = {
  rowIndex: number;
  value: CellData;
  rowData: Data;
};

export type CustomColumn<Data extends BaseRowData = BaseRowData> = (
  props: CustomColumnProps<Data>
) => JSX.Element;

export type CellData = string | number;

export type BaseRowData = {
  [key: string]: CellData;
};

export type CellParser = (val: CellData) => CellData;

export type DataTableColumn<Data extends BaseRowData = BaseRowData> = {
  /** label of the column */
  label: React.ReactNode;
  /** property from row data that will be shown as the column value */
  name: keyof Data;
  /** function to parse column value */
  format?: CellParser;
  /** component that will be rendered inside column cells */
  component?: CustomColumn<Data>;
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
