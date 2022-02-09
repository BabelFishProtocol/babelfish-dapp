import { DataTable } from '../../../components/DataTable/DataTable.component';
import { DataTableColumn } from '../../../components/DataTable/DataTable.types';
import { TransactionsTableComponentProps } from './TransactionsTable.types';

const transactionsTableColumns: DataTableColumn[] = [
  { label: 'Event', name: 'eventName' },
  { label: 'Asset', name: 'asset' },
  { label: 'Amount', name: 'amount' },
  { label: 'Date', name: 'date' },
  { label: 'Status', name: 'status' },
];

export const TransactionsTableComponent = ({
  transactions,
}: TransactionsTableComponentProps) => (
  <DataTable
    tableTitle="Transactions"
    columns={transactionsTableColumns}
    data={transactions}
    containerSx={{ height: 600, padding: ({ spacing }) => spacing(0, 2) }}
  />
);
