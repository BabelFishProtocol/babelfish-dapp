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

import { agregatorDefaultValues, AgregatorInputs } from './Agregator.fields';
import {
  AgregatorComponentProps,
  AgregatorFormValues,
} from './Agregator.types';
import { AgregatorInfo } from './AgregatorInfo/AgregatorInfo.component';
import { useAgregatorDropdowns, useAvailableBalance } from './Agregator.hooks';
import { mainnetPool } from '../../config/pools';

export const AgregatorComponent = ({
  getTokenAvaliableBalance,
  getReceiveAmount,
  onSubmit,
}: AgregatorComponentProps) => {
  const {
    handleSubmit,
    watch,
    resetField,
    setValue,
    control,
    formState: { isValid },
  } = useForm<AgregatorFormValues>({
    mode: 'onChange',
    defaultValues: agregatorDefaultValues,
  });
  const startingChain = watch(AgregatorInputs.StartingChain);
  const startingToken = watch(AgregatorInputs.StartingToken);
  const destinationChain = watch(AgregatorInputs.DestinationChain);
  const destinationToken = watch(AgregatorInputs.DestinationToken);
  const amount = watch(AgregatorInputs.SendAmount);

  const {
    startingChainOptions,
    startingTokenOptions,
    destinationChainOptions,
    destinationTokenOptions,
    changeDirection,
  } = useAgregatorDropdowns(
    startingChain,
    destinationChain,
    resetField,
    setValue
  );

  const { availableBalance } = useAvailableBalance(
    startingToken,
    getTokenAvaliableBalance,
    resetField
  );

  useEffect(() => {
    if (amount) {
      setValue(AgregatorInputs.ReceiveAmount, getReceiveAmount(amount));
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
            name={AgregatorInputs.StartingChain}
            title="Select Network"
            placeholder="Select Chain"
            control={control}
            options={startingChainOptions}
            sx={{ mb: 4 }}
          />
          <ControlledDropdown
            name={AgregatorInputs.StartingToken}
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
            name={AgregatorInputs.SendAmount}
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
      <AgregatorInfo onClick={changeDirection} />
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
            name={AgregatorInputs.DestinationChain}
            title="Network"
            placeholder="Select Chain"
            control={control}
            options={destinationChainOptions}
            sx={{ mb: 4 }}
          />
          {showDestinationTokenDropdown && (
            <ControlledDropdown
              name={AgregatorInputs.DestinationToken}
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
            name={AgregatorInputs.ReceiveAmount}
            control={control}
            sx={{ mb: 5 }}
          />
          <ControlledInput
            title="Receiving address"
            placeholder="Enter or paste address"
            name={AgregatorInputs.ReceiveAddress}
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
