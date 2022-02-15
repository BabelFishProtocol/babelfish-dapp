import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import OutlinedInput from '@mui/material/OutlinedInput';
import { BigNumber, utils } from 'ethers';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ControlledDropdown } from '../../components/ControlledDropdown/ControlledDropdown.component';
import { PageView } from '../../components/PageView/PageView.component';
import { ControlledInputWithButtonPillGroup } from '../../components/ControlledInputWithButtonPillGroup/ControlledInputWithButtonPillGroup.component';
import { baseChains, ChainEnum, chains } from '../../config/chains';
import { TokenTypeBase } from '../../config/tokens';
import { NameWithIcon } from '../../components/NameWithIcon/NameWithIcon.component';
import { AggregatorInputs } from '../../constants';

export const AgregatorComponent = () => {
  const [bassetOptions, setBassetOptions] = useState<TokenTypeBase[]>();
  const [tokenDropdownDisabled, setTokenDropdownDisabled] = useState(true);
  const [availableBalance, setAvailableBalance] = useState<BigNumber>();
  const [receiveAmount, setReceiveAmount] = useState('0.00');

  const { watch, setValue, control } = useForm();
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
    setAvailableBalance(utils.parseEther('81'));
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
            defaultValue=""
            placeholder="Select Chain"
            control={control}
            options={baseChains}
            sx={{ mb: 6 }}
          />
          <ControlledDropdown
            name={AggregatorInputs.TokenDropdown}
            label="Deposit stablecoin"
            placeholder="Select Coin"
            defaultValue=""
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
            label="Deposit amount"
            symbol="USDT"
            defaultValue=""
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
          <Typography variant="h3">Network</Typography>
          <Paper sx={{ mb: 6, px: 2 }}>
            <NameWithIcon
              name={chains[ChainEnum.RSK].name}
              icon={chains[ChainEnum.RSK].icon}
            />
          </Paper>
          <Typography variant="h3">Receive amount</Typography>
          <Paper
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              px: '14px',
              py: '16.5px',
              mb: 6,
            }}
          >
            <span>{receiveAmount}</span>
            <span>XUSD</span>
          </Paper>
          <Typography variant="h3">Receiving address</Typography>
          <OutlinedInput
            sx={{ width: '100%', mb: 5 }}
            placeholder="Enter or paste address"
          />
          <Button type="submit" fullWidth>
            Transfer
          </Button>
        </Box>
      </PageView>
    </form>
  );
};
