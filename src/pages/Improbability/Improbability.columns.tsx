import Box from '@mui/material/Box';
import { ImprobabilityRowData } from './Improbability.types';
import {
  CustomColumn,
  DataTableColumn,
} from '../../components/DataTable/DataTable.types';

const StableCoinName: CustomColumn<ImprobabilityRowData> = ({
  value,
  rowData,
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <img height="20" width="20" src={rowData.icon} alt="" />
    <span>{value}</span>
  </Box>
);

const Balance: CustomColumn<ImprobabilityRowData> = ({ value, rowData }) => (
  <span>
    {value} {rowData.name}
  </span>
);

const AddPercentage: CustomColumn<ImprobabilityRowData> = ({ value }) => (
  <span>{value} %</span>
);

export const coinsListColumns: DataTableColumn<ImprobabilityRowData>[] = [
  { label: 'stable coin', name: 'name', component: StableCoinName },
  { label: 'balance', name: 'balance', component: Balance },
  { label: 'pool', name: 'pool', component: AddPercentage },
  { label: 'apr', name: 'apr', component: AddPercentage },
  { label: 'earned-In-Kind', name: 'earnedInKind' },
  { label: 'earned-In-Xusd', name: 'earnedInXusd' },
];
