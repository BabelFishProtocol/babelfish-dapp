import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataTable } from '../../components/DataTable/DataTable.component';
import { PageView } from '../../components/PageView/PageView.component';
import {
  ImprobabilityComponentProps,
  ImprobabilityFormValues,
  ImprobabilityRowData,
} from './Improbability.types';
import { ControlledDropdown } from '../../components/Dropdown/Dropdown.controlled';
import {
  coinsListColumns,
  improbabilityDropdownOptions,
} from './Improbability.utils';

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
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <ControlledDropdown
          name="network"
          placeholder="Choose Network"
          control={control}
          options={improbabilityDropdownOptions}
          setValue={setValue}
        />
        <Button
          sx={{ height: '3rem', width: '12rem', ml: 'auto' }}
          variant="contained"
        >
          deposit
        </Button>
        <Button sx={{ height: '3rem', width: '12rem' }} variant="outlined">
          withdraw
        </Button>
      </Box>
      <DataTable
        state={state}
        data={coins as ImprobabilityRowData[]}
        columns={coinsListColumns}
        containerSx={{ minHeight: 250 }}
      />
    </PageView>
  );
};
