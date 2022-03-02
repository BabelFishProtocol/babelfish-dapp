import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { BigNumber, utils } from 'ethers';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { ChainType } from '../../config/chains';
import { TokenTypeBase } from '../../config/tokens';
import { ControlledDropdown } from '../../components/ControlledDropdown/ControlledDropdown.component';
import { PageView } from '../../components/PageView/PageView.component';
import { ControlledInputWithButtonPillGroup } from '../../components/ControlledInputWithButtonPillGroup/ControlledInputWithButtonPillGroup.component';
import { ControlledCurrencyInput } from '../../components/ControlledCurrencyInput/ControlledCurrencyInput.component';
import { ControlledInput } from '../../components/ControlledInput/ControlledInput.component';

import { AgregatorInputs } from './Agregator.fields';
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
      defaultValues: {
        [AgregatorInputs.StartingChain]: '',
        [AgregatorInputs.StartingToken]: '',
        [AgregatorInputs.SendAmount]: '',
        [AgregatorInputs.DestinationChain]: '',
        [AgregatorInputs.DestinationToken]: '',
        [AgregatorInputs.ReceiveAmount]: '',
        [AgregatorInputs.ReceiveAddress]: '',
      },
    });
  const watchStartingChain = watch(AgregatorInputs.StartingChain);
  const watchStartingToken = watch(AgregatorInputs.StartingToken);
  const watchDestinationChain = watch(AgregatorInputs.DestinationChain);
  const watchDestinationToken = watch(AgregatorInputs.DestinationToken);

  const startingTokenOptions = useMemo<TokenTypeBase[]>(() => {
    if (watchStartingChain === undefined) {
      return [];
    }

    if (watchStartingChain === mainnetPool.masterChain.id) {
      return [mainnetPool.masset];
    }

    return mainnetPool.baseChains[watchStartingChain];
  }, [watchStartingChain]);

  const [availableBalance, setAvailableBalance] = useState<BigNumber>();

  const [destinationChainOptions, setDestinationChainOptions] = useState<
    ChainType[]
  >([]);

  const [destinationTokenOptions, setDestinationTokenOptions] = useState<
    TokenTypeBase[]
  >([]);

  const watchAmount = watch(AgregatorInputs.SendAmount);

  useEffect(() => {
    console.log('nie');
    setAvailableBalance(undefined);
    if (watchStartingChain === mainnetPool.masterChain.id) {
      setStartingTokenOptions([mainnetPool.masset]);
      setValue(AgregatorInputs.StartingToken, mainnetPool.masset.id);

      setDestinationChainOptions(mainnetPool.baseChains);

      setDestinationTokenOptions(startingTokenOptions);
      setValue(AgregatorInputs.DestinationToken, watchStartingToken);
    } else {
      const chosenChain = mainnetPool.baseChains.find(
        ({ id }) => id === watchStartingChain
      );
      const currentOptions = chosenChain?.bassets;
      if (currentOptions) {
        setStartingTokenOptions(currentOptions);
        setValue(AgregatorInputs.StartingToken, watchDestinationToken);
        setDestinationChainOptions([mainnetPool.masterChain]);
        setValue(AgregatorInputs.DestinationChain, mainnetPool.masterChain.id);
        setDestinationTokenOptions([mainnetPool.masset]);
        setValue(AgregatorInputs.DestinationToken, mainnetPool.masset.id);
      }
    }
  }, [watchStartingChain]);

  useEffect(() => {
    const chosenChain = mainnetPool.baseChains.find(
      ({ id }) => id === watchDestinationChain
    );
    const currentOptions = chosenChain?.bassets;
    if (currentOptions) {
      setDestinationTokenOptions(currentOptions);
      setValue(AgregatorInputs.DestinationToken, '');
    }
  }, [watchDestinationChain]);

  useEffect(() => {
    if (watchStartingToken) {
      setAvailableBalance(getTokenAvaliableBalance());
    }
  }, [watchStartingToken, getTokenAvaliableBalance]);

  const changeDirection = () => {
    if (watchDestinationChain === mainnetPool.masterChain.id) {
      setDestinationChainOptions(mainnetPool.baseChains);
      setValue(AgregatorInputs.DestinationChain, watchStartingChain);
    } else {
      setDestinationChainOptions([mainnetPool.masterChain]);
      setValue(AgregatorInputs.StartingChain, watchStartingChain);
    }
  };

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
            symbol={watchStartingToken}
            disabled={!availableBalance}
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
          <ControlledDropdown
            name={AgregatorInputs.DestinationToken}
            title="Stablecoin"
            placeholder="Select Coin"
            control={control}
            options={destinationTokenOptions}
            sx={{ mb: 4 }}
          />
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
