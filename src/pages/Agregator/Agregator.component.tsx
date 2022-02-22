import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { BigNumber, utils } from 'ethers';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { baseChains, ChainEnum, chains } from '../../config/chains';
import { TokenTypeBase } from '../../config/tokens';
import { ControlledDropdown } from '../../components/ControlledDropdown/ControlledDropdown.component';
import { PageView } from '../../components/PageView/PageView.component';
import { ControlledInputWithButtonPillGroup } from '../../components/ControlledInputWithButtonPillGroup/ControlledInputWithButtonPillGroup.component';
import { ControlledCurrencyInput } from '../../components/ControlledCurrencyInput/ControlledCurrencyInput.component';
import { ControlledInput } from '../../components/ControlledInput/ControlledInput.component';

import { AggregatorInputs } from './Agregator.fields';
import { AgregatorFormValues } from './Agregator.types';

export const AgregatorComponent = () => {
  const [bassetOptions, setBassetOptions] = useState<TokenTypeBase[]>();
  const [tokenDropdownDisabled, setTokenDropdownDisabled] = useState(true);
  const [availableBalance, setAvailableBalance] = useState<BigNumber>();

  const { watch, setValue, control } = useForm<AgregatorFormValues>({
    defaultValues: {
      [AggregatorInputs.ChainDropdown]: '',
      [AggregatorInputs.TokenDropdown]: '',
      [AggregatorInputs.SendAmount]: '',
      [AggregatorInputs.DestinationChain]: ChainEnum.RSK,
      [AggregatorInputs.ReceiveAddress]: '',
    },
  });
  const watchChain = watch(AggregatorInputs.ChainDropdown);
  const watchToken = watch(AggregatorInputs.TokenDropdown);

  useEffect(() => {
    const chosenChain = baseChains.find(({ id }) => id === watchChain);
    const currentOptions = chosenChain && chosenChain.bassets;
    setBassetOptions(currentOptions);
    setTokenDropdownDisabled(!currentOptions);
  }, [watchChain]);

  const getTokenAvaliableAmount = () => {
    // todo: implement
    setAvailableBalance(utils.parseEther('81.123'));
  };

  useEffect(() => {
    if (watchToken) {
      getTokenAvaliableAmount();
    }
  }, [watchToken]);
  return (
    <form
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: 1120,
        margin: '0 auto',
      }}
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
            name={AggregatorInputs.ChainDropdown}
            label="Select Network"
            placeholder="Select Chain"
            control={control}
            options={baseChains}
            sx={{ mb: 6 }}
          />
          <ControlledDropdown
            name={AggregatorInputs.TokenDropdown}
            label="Deposit stablecoin"
            placeholder="Select Coin"
            control={control}
            disabled={tokenDropdownDisabled}
            options={bassetOptions ?? []}
          />
          <Box sx={{ height: 48, position: 'relative' }}>
            {availableBalance && (
              <Typography
                variant="subtitle2"
                sx={{ position: 'absolute', top: 14 }}
              >
                Available Balance: {utils.formatUnits(availableBalance)} USDT
              </Typography>
            )}
          </Box>

          <ControlledInputWithButtonPillGroup
            name={AggregatorInputs.SendAmount}
            title="Deposit amount"
            symbol="USDT"
            disabled={!availableBalance}
            availableBalance={availableBalance}
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
            name={AggregatorInputs.ChainDropdown}
            label="Network"
            control={control}
            options={[chains.RSK]}
            sx={{ mb: 6 }}
          />
          <ControlledCurrencyInput
            disabled
            title="Receive amount"
            symbol="XUSD"
            name={AggregatorInputs.ReceiveAmount}
            control={control}
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
