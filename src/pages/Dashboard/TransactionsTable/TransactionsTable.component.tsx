import { DataTable } from '../../../components/DataTable/DataTable.component';
import { DataTableColumn } from '../../../components/DataTable/DataTable.types';
import { formatWeiAmount } from '../../../utils/helpers';
import {
  TransactionsTableComponentProps,
  TransactionsTableItem,
} from './TransactionsTable.types';
import { formatDate, StatusColumn } from './TransactionsTable.utils';

const transactionsTableColumns: DataTableColumn<TransactionsTableItem>[] = [
  { label: 'Event', name: 'event' },
  { label: 'Asset', name: 'asset' },
  { label: 'Amount', name: 'amount', format: formatWeiAmount },
  {
    label: 'Date',
    name: 'date',
    format: formatDate,
  },
  { label: 'Status', name: 'status', component: StatusColumn },
];

export const TransactionsTableComponent = ({
  state,
  transactions,
}: TransactionsTableComponentProps) => (
  <DataTable
    state={state}
    tableTitle="Transactions"
    columns={transactionsTableColumns}
    data={transactions}
    containerSx={{ height: 600, padding: ({ spacing }) => spacing(0, 2) }}
  />
);
