import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useForm } from 'react-hook-form';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PageView } from '../../components/PageView/PageView.component';
import { ControlledCurrencyInput } from '../../components/CurrencyInput/CurrencyInput.controlled';
import { ControlledAddressInput } from '../../components/AddressInput/AddressInput.controlled';
import { ControlledDropdown } from '../../components/Dropdown/Dropdown.controlled';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs.component';

import {
  aggregatorDefaultValues,
  AggregatorInputs,
  AggregatorFormValues,
} from './Aggregator.fields';
import { AggregatorComponentProps } from './Aggregator.types';
import {
  useAggregatorDropdowns,
  useConnectedChain,
  useWalletAddress,
} from './Aggregator.hooks';
import { AggregatorInfoContainer } from './AggregatorInfo/AggregatorInfo.container';
import { SendAmount } from './SendAmount/SendAmount.container';
import { flowStateSelector } from '../../store/aggregator/aggregator.selectors';
import { UrlNames } from '../../constants';

const PageViewTitle: React.FC = ({ children }) => (
  <Box
    sx={{
      py: 2.5,
      px: 3,
    }}
  >
    <Typography variant="h2">{children}</Typography>
  </Box>
);

export const AggregatorComponent = ({
  getReceiveAmount,
  onSubmit,
  onDestinationChainChange,
  onStartingTokenChange,
  onDestinationTokenChange,
}: AggregatorComponentProps) => {
  const flowState = useSelector(flowStateSelector);
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
    toggleFlow
  } = useAggregatorDropdowns(
    startingChain,
    destinationChain,
    startingToken,
    destinationToken,
    resetField,
    setValue
  );

  useConnectedChain(
    startingChain,
    resetField,
    setValue
  );

  useWalletAddress(setValue);

  useEffect(() => {
    onStartingTokenChange(startingToken || undefined);
  }, [startingToken, onStartingTokenChange]);

  useEffect(() => {
    if (destinationChain) {
      onDestinationChainChange(destinationChain);
    }
  }, [destinationChain, onDestinationChainChange]);

  useEffect(() => {
    onDestinationTokenChange(destinationToken || undefined);
  }, [destinationToken, onDestinationTokenChange]);

  useEffect(() => {
    if (amount) {
      setValue(AggregatorInputs.ReceiveAmount, getReceiveAmount(amount));
    }
  }, [amount, getReceiveAmount, setValue]);

  useEffect(() => {
    resetField(AggregatorInputs.SendAmount);
    resetField(AggregatorInputs.ReceiveAmount);
  }, [flowState, resetField]);

  return (
    <>
      <Breadcrumbs links={[{ title: UrlNames.Aggregator }]} />
      <Box
        sx={{
          maxWidth: 1400,
          width: '90%',
          margin: '0 auto',
        }}
      >
        <form
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: 0,
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <PageView
            title={<PageViewTitle>Starting chain</PageViewTitle>}
            sx={{
              maxWidth: { xs: 400 },
              height: 'min-content',
            }}
          >
            <Box
              sx={{
                maxWidth: 320,
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
          <AggregatorInfoContainer toggleFlow={toggleFlow} />
          <PageView
            title={<PageViewTitle>Destination chain</PageViewTitle>}
            sx={{
              maxWidth: { xs: 400 },
              height: 'min-content',
            }}
          >
            <Box
              sx={{
                maxWidth: 320,
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
      </Box>
    </>
  );
};
