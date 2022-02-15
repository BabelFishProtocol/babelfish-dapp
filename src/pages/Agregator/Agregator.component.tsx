import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import OutlinedInput from '@mui/material/OutlinedInput';
import { utils } from 'ethers';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IconButton } from '@mui/material';
import { ControlledDropdown } from '../../components/ControlledDropdown/ControlledDropdown.component';
import { PageView } from '../../components/PageView/PageView.component';
import { InputWithButtonPillGroup } from '../../components/InputPillGroup/InputWithButtonPillGroup.component';
import { baseChains, ChainEnum, chains } from '../../config/chains';
import { TokenTypeBase } from '../../config/tokens';
import { NameWithIcon } from '../../components/NameWithIcon/NameWithIcon.component';

export const AgregatorComponent = () => {
  const [bassetOptions, setBassetOptions] = useState<TokenTypeBase[]>();
  const [tokenDropdownDisabled, setTokenDropdownDisabled] = useState(true);

  const [receiveAmount, setReceiveAmount] = useState('0.00');

  const { watch, control } = useForm();
  const watchChain = watch('chain');

  useEffect(() => {
    const chosenChain = baseChains.find(({ id }) => id === watchChain);
    const currentOptions = chosenChain && chosenChain.bassets;
    setBassetOptions(currentOptions);
    setTokenDropdownDisabled(!currentOptions);
  }, [watchChain]);
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
            name="chain"
            label="Select Network"
            defaultValue=""
            placeholder="Select Chain"
            control={control}
            options={baseChains}
          />
          <ControlledDropdown
            name="token"
            label="Deposit stablecoin"
            defaultValue=""
            placeholder="Select Coin"
            control={control}
            disabled={tokenDropdownDisabled}
            options={bassetOptions ?? []}
          />
          <InputWithButtonPillGroup
            title="Deposit amount"
            symbol="USDT"
            totalAmount={utils.parseEther('81')}
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
