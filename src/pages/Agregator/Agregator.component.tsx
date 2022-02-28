import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { utils } from 'ethers';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { baseChains, ChainEnum, chains } from '../../config/chains';
import { TokenTypeBase } from '../../config/tokens';
import { PageView } from '../../components/PageView/PageView.component';
import { ControlledCurrencyInput } from '../../components/CurrencyInput/CurrencyInput.controlled';
import { ControlledInput } from '../../components/TextInput/TextInput.controlled';
import { ControlledDropdown } from '../../components/Dropdown/Dropdown.controlled';
import { ControlledInputWithButtonPillGroup } from '../../components/InputPillGroup/InputWithButtonPillGroup.controlled';

import { AggregatorInputs } from './Agregator.fields';
import {
  AgregatorComponentProps,
  AgregatorFormValues,
} from './Agregator.types';

export const AgregatorComponent = ({
  availableBalance,
  getTokenAvaliableBalance,
  getReceiveAmount,
  onSubmit,
}: AgregatorComponentProps) => {
  const [bassetOptions, setBassetOptions] = useState<TokenTypeBase[]>();
  const [tokenDropdownDisabled, setTokenDropdownDisabled] = useState(true);

  const { handleSubmit, watch, setValue, control } =
    useForm<AgregatorFormValues>({
      defaultValues: {
        [AggregatorInputs.ChainDropdown]: '',
        [AggregatorInputs.TokenDropdown]: '',
        [AggregatorInputs.SendAmount]: '',
        [AggregatorInputs.DestinationChain]: ChainEnum.RSK,
        [AggregatorInputs.ReceiveAmount]: '',
        [AggregatorInputs.ReceiveAddress]: '',
      },
    });
  const watchChain = watch(AggregatorInputs.ChainDropdown);
  const watchToken = watch(AggregatorInputs.TokenDropdown);
  const watchAmount = watch(AggregatorInputs.SendAmount);

  useEffect(() => {
    const chosenChain = baseChains.find(({ id }) => id === watchChain);
    const currentOptions = chosenChain && chosenChain.bassets;
    if (currentOptions) {
      setBassetOptions(currentOptions);
      setTokenDropdownDisabled(!currentOptions);
    }
  }, [watchChain]);

  useEffect(() => {
    if (watchToken) {
      getTokenAvaliableBalance();
    }
  }, [watchToken, getTokenAvaliableBalance]);

  useEffect(() => {
    if (watchAmount) {
      setValue(AggregatorInputs.ReceiveAmount, getReceiveAmount(watchAmount));
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
            name={AggregatorInputs.ChainDropdown}
            title="Select Network"
            placeholder="Select Chain"
            control={control}
            options={baseChains}
            sx={{ mb: 4 }}
          />
          <ControlledDropdown
            name={AggregatorInputs.TokenDropdown}
            title="Deposit stablecoin"
            placeholder="Select Coin"
            control={control}
            disabled={tokenDropdownDisabled}
            options={bassetOptions ?? []}
          />
          <Box sx={{ mb: 8, position: 'relative' }}>
            {availableBalance && (
              <Typography
                variant="subtitle2"
                sx={{ position: 'absolute', top: 14 }}
              >
                Available Balance:{' '}
                {`${utils.formatUnits(availableBalance)} ${watchToken}`}
              </Typography>
            )}
          </Box>

          <ControlledInputWithButtonPillGroup
            name={AggregatorInputs.SendAmount}
            title="Deposit amount"
            symbol="USDT"
            disabled={!availableBalance}
            totalAmount={availableBalance}
            control={control}
            setValue={setValue}
          />
        </Box>
      </PageView>
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
            disabled
            name={AggregatorInputs.DestinationChain}
            title="Network"
            control={control}
            options={[chains[ChainEnum.RSK]]}
            sx={{ mb: 4 }}
          />
          <ControlledCurrencyInput
            disabled
            title="Receive amount"
            symbol="XUSD"
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
          <Button type="submit" fullWidth>
            Transfer
          </Button>
        </Box>
      </PageView>
    </form>
  );
};
