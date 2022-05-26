import { DataTable } from '../../../components/DataTable/DataTable.component';
import {
  CustomColumn,
  DataTableColumn,
} from '../../../components/DataTable/DataTable.types';
import { formatTimestamp, formatWeiAmount } from '../../../utils/helpers';
import {
  TransactionsTableComponentProps,
  TransactionsTableItem,
} from './TransactionsTable.types';

const formatDate = (timestamp?: number | string) =>
  timestamp ? formatTimestamp(timestamp) : '------';

const ChainInfo: CustomColumn<TransactionsTableItem> = ({ value, rowData }) => (
  <span>
    {value} {rowData.isCrossChain ? 'cross chain' : 'not cross chain'}
  </span>
);

const transactionsTableColumns: DataTableColumn<TransactionsTableItem>[] = [
  { label: 'Event', name: 'event' },
  { label: 'Asset', name: 'asset' },
  { label: 'Amount', name: 'amount', format: formatWeiAmount },
  {
    label: 'Date',
    name: 'date',
    format: formatDate,
  },
  { label: 'Status', name: 'status', component: ChainInfo },
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
