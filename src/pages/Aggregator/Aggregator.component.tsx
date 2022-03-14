import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { utils } from 'ethers';
import { useForm } from 'react-hook-form';

import { useEffect } from 'react';
import { PageView } from '../../components/PageView/PageView.component';
import { ControlledCurrencyInput } from '../../components/CurrencyInput/CurrencyInput.controlled';
import { ControlledInput } from '../../components/TextInput/TextInput.controlled';
import { ControlledDropdown } from '../../components/Dropdown/Dropdown.controlled';
import { ControlledInputWithButtonPillGroup } from '../../components/InputPillGroup/InputWithButtonPillGroup.controlled';

import {
  aggregatorDefaultValues,
  AggregatorInputs,
  AggregatorFormValues,
} from './Aggregator.fields';
import { AggregatorComponentProps } from './Aggregator.types';
import { AggregatorInfo } from './AggregatorInfo/AggregatorInfo.component';
import {
  useAggregatorDropdowns,
  useAvailableBalance,
} from './Aggregator.hooks';
import { mainnetPool } from '../../config/pools';

export const AggregatorComponent = ({
  getTokenAvailableBalance,
  getReceiveAmount,
  onSubmit,
}: AggregatorComponentProps) => {
  const {
    handleSubmit,
    watch,
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
    changeDirection,
  } = useAggregatorDropdowns(
    startingChain,
    destinationChain,
    resetField,
    setValue
  );

  const { availableBalance } = useAvailableBalance(
    startingToken,
    getTokenAvailableBalance,
    resetField
  );

  useEffect(() => {
    if (amount) {
      setValue(AggregatorInputs.ReceiveAmount, getReceiveAmount(amount));
    }
  }, [amount, getReceiveAmount, setValue]);

  const showDestinationTokenDropdown =
    startingChain === mainnetPool.masterChain.id;

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
          />
          <ControlledDropdown
            name={AggregatorInputs.StartingToken}
            title="stablecoin"
            placeholder="Select Coin"
            control={control}
            options={startingTokenOptions}
          />
          <Box sx={{ mb: 8, position: 'relative' }}>
            {availableBalance && (
              <Typography
                variant="subtitle2"
                sx={{ position: 'absolute', top: 14 }}
              >
                Available Balance:{' '}
                {`${utils.formatUnits(availableBalance)} ${startingToken}`}
              </Typography>
            )}
          </Box>

          <ControlledInputWithButtonPillGroup
            name={AggregatorInputs.SendAmount}
            title="Amount"
            placeholder="0.00"
            disabled={!startingToken}
            symbol={startingToken}
            totalAmount={availableBalance}
            control={control}
            setValue={setValue}
          />
        </Box>
      </PageView>
      <AggregatorInfo onClick={changeDirection} />
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
          />
          {showDestinationTokenDropdown && (
            <ControlledDropdown
              name={AggregatorInputs.DestinationToken}
              title="Stablecoin"
              placeholder="Select Coin"
              control={control}
              options={destinationTokenOptions}
              sx={{ mb: 4 }}
            />
          )}

          <ControlledCurrencyInput
            disabled
            title="Receive amount"
            symbol={destinationToken}
            placeholder="0.00"
            name={AggregatorInputs.ReceiveAmount}
            control={control}
            sx={{ mb: 5 }}
          />
          <ControlledInput
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
