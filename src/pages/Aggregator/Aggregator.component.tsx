import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useForm } from 'react-hook-form';

import { useEffect } from 'react';
import { PageView } from '../../components/PageView/PageView.component';
import { ControlledCurrencyInput } from '../../components/CurrencyInput/CurrencyInput.controlled';
import { ControlledAddressInput } from '../../components/AddressInput/AddressInput.controlled';
import { ControlledDropdown } from '../../components/Dropdown/Dropdown.controlled';

import {
  aggregatorDefaultValues,
  AggregatorInputs,
  AggregatorFormValues,
} from './Aggregator.fields';
import { AggregatorComponentProps } from './Aggregator.types';
import { useAggregatorDropdowns, useConnectedChain } from './Aggregator.hooks';
import { AggregatorInfoContainer } from './AggregatorInfo/AggregatorInfo.container';
import { SendAmount } from './SendAmount/SendAmount.container';

export const AggregatorComponent = ({
  getReceiveAmount,
  onSubmit,
  onDestinationChainChange,
  onStartingTokenChange,
  onDestinationTokenChange,
}: AggregatorComponentProps) => {
  const {
    handleSubmit,
    watch,
    reset,
    resetField,
    setValue,
    control,
    formState: { isValid },
  } = useForm<AggregatorFormValues>({
    mode: 'onChange',
    defaultValues: aggregatorDefaultValues,
  });

  const startingChain = watch(AggregatorInputs.StartingChain);
  const startingToken = watch(AggregatorInputs.StartingToken);
  const destinationChain = watch(AggregatorInputs.DestinationChain);
  const destinationToken = watch(AggregatorInputs.DestinationToken);
  const amount = watch(AggregatorInputs.SendAmount);

  const {
    startingChainOptions,
    startingTokenOptions,
    destinationChainOptions,
    destinationTokenOptions,
  } = useAggregatorDropdowns(
    startingChain,
    destinationChain,
    resetField,
    setValue
  );

  const { hideDestinationTokenDropdown } = useConnectedChain(
    startingChain,
    destinationChain,
    reset,
    setValue
  );

  useEffect(() => {
    if (startingToken) {
      onStartingTokenChange(startingToken);
    }
  }, [startingToken, onStartingTokenChange]);

  useEffect(() => {
    if (destinationChain) {
      onDestinationChainChange(destinationChain);
    }
  }, [destinationChain, onDestinationChainChange]);

  useEffect(() => {
    if (destinationToken) {
      onDestinationTokenChange(destinationToken);
    }
  }, [destinationToken, onDestinationTokenChange]);

  useEffect(() => {
    if (amount) {
      setValue(AggregatorInputs.ReceiveAmount, getReceiveAmount(amount));
    }
  }, [amount, getReceiveAmount, setValue]);

  return (
    <form
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        maxWidth: 1120,
        margin: '0 auto',
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <PageView
        title={
          <Box
            sx={{
              py: 2.5,
              px: 3,
            }}
          >
            <Typography variant="h2">Starting chain</Typography>
          </Box>
        }
        sx={{
          height: 'min-content',
        }}
      >
        <Box
          sx={{
            width: 310,
            mx: 'auto',
          }}
        >
          <ControlledDropdown
            autoFocus
            name={AggregatorInputs.StartingChain}
            title="Select Network"
            placeholder="Select Chain"
            control={control}
            options={startingChainOptions}
            sx={{ mb: 4 }}
            setValue={setValue}
          />
          <ControlledDropdown
            name={AggregatorInputs.StartingToken}
            title="stablecoin"
            placeholder="Select Coin"
            control={control}
            options={startingTokenOptions}
            setValue={setValue}
          />
          <SendAmount
            name={AggregatorInputs.SendAmount}
            startingTokenName={startingToken}
            control={control}
            setValue={setValue}
          />
        </Box>
      </PageView>
      <AggregatorInfoContainer />
      <PageView
        title={
          <Box
            sx={{
              py: 2.5,
              px: 3,
            }}
          >
            <Typography variant="h2">Destination chain</Typography>
          </Box>
        }
      >
        <Box
          sx={{
            width: 310,
            mx: 'auto',
          }}
        >
          <ControlledDropdown
            name={AggregatorInputs.DestinationChain}
            title="Network"
            placeholder="Select Chain"
            control={control}
            options={destinationChainOptions}
            sx={{ mb: 4 }}
            setValue={setValue}
          />

          <ControlledDropdown
            name={AggregatorInputs.DestinationToken}
            title="Stablecoin"
            placeholder="Select Coin"
            control={control}
            options={destinationTokenOptions}
            sx={{ mb: 4 }}
            hideField={hideDestinationTokenDropdown}
            setValue={setValue}
          />

          <ControlledCurrencyInput
            disabled
            title="Receive amount"
            symbol={destinationToken}
            placeholder="0.00"
            name={AggregatorInputs.ReceiveAmount}
            control={control}
            sx={{ mb: 5 }}
          />
          <ControlledAddressInput
            title="Receiving address"
            placeholder="Enter or paste address"
            name={AggregatorInputs.ReceiveAddress}
            control={control}
            sx={{ mb: 5 }}
          />
          <Button type="submit" fullWidth disabled={!isValid}>
            Transfer
          </Button>
        </Box>
      </PageView>
    </form>
  );
};
