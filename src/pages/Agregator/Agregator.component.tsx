import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { BigNumber, utils } from 'ethers';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { ChainType } from '../../config/chains';
import { TokenTypeBase } from '../../config/tokens';
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
import { mainnetPool } from '../../config/pools';
import { AgregatorInfo } from './AgregatorInfo/AgregatorInfo.component';

export const AgregatorComponent = ({
  getTokenAvaliableBalance,
  getReceiveAmount,
  onSubmit,
}: AgregatorComponentProps) => {
  const { handleSubmit, watch, setValue, control } =
    useForm<AgregatorFormValues>({
      defaultValues: agregatorDefaultValues,
    });
  const watchStartingChain = watch(AgregatorInputs.StartingChain);
  const watchStartingToken = watch(AgregatorInputs.StartingToken);
  const watchDestinationChain = watch(AgregatorInputs.DestinationChain);
  const watchDestinationToken = watch(AgregatorInputs.DestinationToken);
  const watchAmount = watch(AgregatorInputs.SendAmount);

  const [startingTokenOptions, setStartingTokenOptions] = useState<
    TokenTypeBase[]
  >([]);
  const [destinationChainOptions, setDestinationChainOptions] = useState<
    ChainType[]
  >([]);
  const [destinationTokenOptions, setDestinationTokenOptions] = useState<
    TokenTypeBase[]
  >([]);

  useEffect(() => {
    setValue(AgregatorInputs.StartingToken, '');
    if (!watchStartingChain) {
      setStartingTokenOptions([]);
      setDestinationChainOptions([]);
    } else if (watchStartingChain === mainnetPool.masterChain.id) {
      if (watchDestinationChain === mainnetPool.masterChain.id) {
        setValue(AgregatorInputs.DestinationChain, '');
      }
      setStartingTokenOptions([mainnetPool.masset]);
      setValue(AgregatorInputs.StartingToken, mainnetPool.masset.id);
      setDestinationChainOptions(mainnetPool.baseChains);
    } else {
      setStartingTokenOptions(
        mainnetPool.baseChains.find((item) => item.id === watchStartingChain)
          ?.bassets ?? []
      );
      setDestinationChainOptions([mainnetPool.masterChain]);
      setValue(AgregatorInputs.DestinationChain, mainnetPool.masterChain.id);
    }
  }, [watchStartingChain, watchDestinationChain, setValue]);

  useEffect(() => {
    setValue(AgregatorInputs.DestinationToken, '');
    if (!watchDestinationChain) {
      setDestinationTokenOptions([]);
    } else if (watchDestinationChain === mainnetPool.masterChain.id) {
      setDestinationTokenOptions([mainnetPool.masset]);
      setValue(AgregatorInputs.DestinationToken, mainnetPool.masset.id);
    } else {
      setDestinationTokenOptions(
        mainnetPool.baseChains.find((item) => item.id === watchDestinationChain)
          ?.bassets ?? []
      );
    }
  }, [watchDestinationChain, setValue]);

  const changeDirection = () => {
    setValue(AgregatorInputs.StartingChain, watchDestinationChain);
    setValue(AgregatorInputs.DestinationChain, watchStartingChain);
  };

  const [availableBalance, setAvailableBalance] = useState<BigNumber>();

  useEffect(() => {
    if (watchStartingToken) {
      setAvailableBalance(getTokenAvaliableBalance(watchStartingToken));
    } else {
      setValue(AgregatorInputs.SendAmount, '');
      setAvailableBalance(undefined);
    }
  }, [watchStartingToken, getTokenAvaliableBalance, setValue]);

  useEffect(() => {
    if (watchAmount) {
      setValue(AgregatorInputs.ReceiveAmount, getReceiveAmount(watchAmount));
    }
  }, [watchAmount, getReceiveAmount, setValue]);

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
            options={[...mainnetPool.baseChains, mainnetPool.masterChain]}
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
                {`${utils.formatUnits(availableBalance)} ${watchStartingToken}`}
              </Typography>
            )}
          </Box>

          <ControlledInputWithButtonPillGroup
            name={AgregatorInputs.SendAmount}
            title="Amount"
            placeholder="0.00"
            disabled={!watchStartingToken}
            symbol={watchStartingToken}
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
          {watchDestinationChain !== mainnetPool.masterChain.id && (
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
            symbol={watchDestinationToken}
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
          <Button type="submit" fullWidth>
            Transfer
          </Button>
        </Box>
      </PageView>
    </form>
  );
};
