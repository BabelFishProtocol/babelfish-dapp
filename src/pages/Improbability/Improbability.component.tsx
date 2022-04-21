import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataTable } from '../../components/DataTable/DataTable.component';
import { PageView } from '../../components/PageView/PageView.component';
import {
  Coin,
  ImprobabilityComponentProps,
  ImprobabilityFormValues,
} from './Improbability.types';
import {
  CustomColumn,
  DataTableColumn,
} from '../../components/DataTable/DataTable.types';
import { ControlledDropdown } from '../../components/Dropdown/Dropdown.controlled';
import { chains, ChainType } from '../../config/chains';

type RowData = Omit<Coin, 'addresses'>;

const StableCoinComponent: CustomColumn<RowData> = ({ value, rowData }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <img height="20" width="20" src={rowData.icon} alt="" />
    <span>{value}</span>
  </Box>
);

const coinsListColumns: DataTableColumn<RowData>[] = [
  { label: 'stable coin', name: 'name', component: StableCoinComponent },
  { label: 'balance', name: 'balance' },
  { label: 'pool', name: 'pool' },
  { label: 'apr', name: 'apr' },
  { label: 'earned-In-Kind', name: 'earnedInKind' },
  { label: 'earned-In-Xusd', name: 'earnedInXusd' },
];

const improbabilityDropdownOptions: ChainType[] = Object.values(chains);

export const ImprobabilityComponent = ({
  state,
  coins,
}: ImprobabilityComponentProps) => {
  const { setValue, control } = useForm<ImprobabilityFormValues>({
    mode: 'onChange',
    defaultValues: { network: '' },
  });

  return (
    <PageView
      title={
        <Typography variant="h2" padding={1}>
          Improbability Drive
        </Typography>
      }
    >
      <Box
        sx={{
          p: '2',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {/* TODO: <form onSubmit={handleSubmit(onSubmit)}> */}
        <form>
          <ControlledDropdown
            name="network"
            placeholder="Choose Network"
            control={control}
            options={improbabilityDropdownOptions}
            setValue={setValue}
          />
        </form>
        <Button
          sx={{ height: '4rem', width: '12rem', ml: 'auto' }}
          variant="contained"
        >
          deposit
        </Button>
        <Button sx={{ height: '4rem', width: '12rem' }} variant="outlined">
          withdraw
        </Button>
      </Box>
      <DataTable
        state={state}
        data={coins as RowData[]}
        columns={coinsListColumns}
        containerSx={{ minHeight: 250 }}
      />
    </PageView>
  );
};
