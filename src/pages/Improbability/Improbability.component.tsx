import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import { DataTable } from '../../components/DataTable/DataTable.component';
import { PageView } from '../../components/PageView/PageView.component';
import { ImprobabilityComponentProps } from './Improbability.types';
import { ControlledDropdown } from '../../components/Dropdown/Dropdown.controlled';
import { coinsListColumns } from './Improbability.columns';
import {
  improbabilityDefaultValues,
  ImprobabilityFormValues,
  ImprobabilityInputs,
} from './Improbability.fields';
import { Button } from '../../components/Button/Button.component';
import { chainsInCurrentNetworkSelector } from '../../store/app/app.selectors';

export const ImprobabilityComponent = ({
  state,
  coins,
}: ImprobabilityComponentProps) => {
  const { setValue, control } = useForm<ImprobabilityFormValues>({
    mode: 'onChange',
    defaultValues: improbabilityDefaultValues,
  });

  const chainOptions = useSelector(chainsInCurrentNetworkSelector);

  return (
    <form>
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
          {chainOptions && (
            <ControlledDropdown
              name={ImprobabilityInputs.Network}
              placeholder="Choose Network"
              control={control}
              options={chainOptions}
              setValue={setValue}
            />
          )}
          <Button
            sx={{
              height: 50,
              width: 180,
              ml: 'auto',
            }}
            variant="contained"
          >
            deposit
          </Button>
          <Button
            sx={{
              height: 50,
              width: 180,
            }}
            variant="outlined"
          >
            withdraw
          </Button>
        </Box>
        <DataTable
          state={state}
          data={coins}
          columns={coinsListColumns}
          containerSx={{ minHeight: 250 }}
        />
      </PageView>
    </form>
  );
};
