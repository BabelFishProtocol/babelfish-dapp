import { Checkbox, Box, FormControlLabel, Link } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useForm } from 'react-hook-form';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  useFocusActiveFields,
  useWalletAddress,
} from './Aggregator.hooks';
import { AggregatorInfoContainer } from './AggregatorInfo/AggregatorInfo.container';
import { SendAmount } from './SendAmount/SendAmount.container';
import { flowStateSelector } from '../../store/aggregator/aggregator.selectors';
import { fieldsErrors, UrlNames } from '../../constants';
import { ControlledSlider } from './SlippageSlider/SlippageSlider.controlled';
import { ChainEnum } from '../../config/chains';

import { useIsFormValid } from './Aggregator.utils';

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

const slippageSliderValues = [0, 5, 10, 15, 20];
const slippageSliderMarks = slippageSliderValues.map((v) => ({
  value: v,
  label: `${v}%`,
}));

export const AggregatorComponent = ({
  onSubmit,
  onStartingChainChange,
  onDestinationChainChange,
  onStartingTokenChange,
  onDestinationTokenChange,
  isStartingTokenPaused,
  onSendAmountChange,
  receiveAmount,
}: AggregatorComponentProps) => {
  const flowState = useSelector(flowStateSelector);

  const {
    handleSubmit,
    watch,
    resetField,
    setValue,
    setError,
    clearErrors,
    control,
  } = useForm<AggregatorFormValues>({
    mode: 'onChange',
    defaultValues: aggregatorDefaultValues,
  });

  const startingChain = watch(AggregatorInputs.StartingChain);
  const startingToken = watch(AggregatorInputs.StartingToken);
  const destinationChain = watch(AggregatorInputs.DestinationChain);
  const destinationToken = watch(AggregatorInputs.DestinationToken);
  const amount = watch(AggregatorInputs.SendAmount);
  const receivingAddress = watch(AggregatorInputs.ReceiveAddress);

  const {
    startingChainOptions,
    startingTokenOptions,
    destinationChainOptions,
    destinationTokenOptions,
    toggleFlow,
  } = useAggregatorDropdowns(
    startingChain,
    destinationChain,
    startingToken,
    destinationToken,
    resetField,
    setValue
  );

  useEffect(() => {
    setValue(AggregatorInputs.ReceiveAmount, receiveAmount || '0.0');
  }, [receiveAmount, setValue]);

  useConnectedChain(startingChain, resetField, setValue);

  useWalletAddress(setValue);

  const destinationNetworkRef = useRef<HTMLDivElement>(null);
  const destinationTokenRef = useRef<HTMLDivElement>(null);

  const [isAddressDisclaimerChecked, setIsAddressDisclaimerChecked] =
    useState(false);

  useFocusActiveFields([
    {
      isPreviousFieldEmpty: !startingChain,
      isCurrentFieldEmpty: !destinationChain,
      currentFieldRef: destinationNetworkRef,
    },
    {
      isPreviousFieldEmpty: !destinationChain,
      isCurrentFieldEmpty: !destinationToken,
      currentFieldRef: destinationTokenRef,
    },
  ]);

  const checkTokenPauseState = useCallback(() => {
    if (!isStartingTokenPaused) {
      clearErrors(AggregatorInputs.StartingToken);
    } else {
      setError(AggregatorInputs.StartingToken, {
        type: 'validate',
        message: fieldsErrors.depositsDisabled,
      });
    }
  }, [clearErrors, isStartingTokenPaused, setError]);

  useEffect(() => {
    checkTokenPauseState();
    onStartingTokenChange(startingToken || undefined);
  }, [startingToken, onStartingTokenChange, checkTokenPauseState]);

  useEffect(() => {
    if (destinationChain) {
      onDestinationChainChange(destinationChain);
    }
  }, [destinationChain, onDestinationChainChange]);

  useEffect(() => {
    if (startingChain) {
      onStartingChainChange(startingChain);
    }
  }, [startingChain, onStartingChainChange]);

  useEffect(() => {
    onDestinationTokenChange(destinationToken || undefined);
  }, [destinationToken, onDestinationTokenChange]);

  useEffect(() => {
    if (amount) {
      onSendAmountChange(amount);
    }
  }, [amount, onSendAmountChange]);

  useEffect(() => {
    if (isAddressDisclaimerChecked && !receivingAddress) {
      setIsAddressDisclaimerChecked(false);
    }
  }, [isAddressDisclaimerChecked, receivingAddress]);

  useEffect(() => {
    resetField(AggregatorInputs.SendAmount);
    resetField(AggregatorInputs.ReceiveAmount);
  }, [flowState, resetField]);

  const handleAddressDisclaimerClick = useCallback(
    () => setIsAddressDisclaimerChecked((previousValue) => !previousValue),
    []
  );


  // check form validity like this because it works better
  const isSubmitAllowed = useIsFormValid({
    startingToken,
    destinationToken,
    startingChain: startingChain as ChainEnum,
    destinationChain: destinationChain as ChainEnum,
    isAddressDisclaimerChecked,
    isStartingTokenPaused,
    amount,
    receivingAddress,
  });

  const shouldAllowTokensSelection = useMemo(
    () => !!startingChain && !!destinationChain,
    [destinationChain, startingChain]
  );


  let slippageProtectionAvailable = startingChain === destinationChain;
  // disable for now
  slippageProtectionAvailable = false;

  return (
    <>
      <Breadcrumbs links={[{ title: UrlNames.Convert }]} />
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
                disabled={!shouldAllowTokensSelection}
              />
              <SendAmount
                name={AggregatorInputs.SendAmount}
                startingTokenName={startingToken}
                control={control}
                setValue={setValue}
              />
              <ControlledSlider
                hidden={!slippageProtectionAvailable}
                title="Slippage Tolerance"
                name={AggregatorInputs.SlippageSlider}
                control={control}
                setValue={setValue}
                min={0}
                max={20}
                step={null}
                marks={slippageSliderMarks}
              />
            </Box>
          </PageView>
          <AggregatorInfoContainer
            toggleFlow={toggleFlow}
            startingToken={startingToken}
            destinationToken={destinationToken}
          />
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
                dropdownRef={destinationNetworkRef}
              />

              <ControlledDropdown
                name={AggregatorInputs.DestinationToken}
                title="Stablecoin"
                placeholder="Select Coin"
                control={control}
                options={destinationTokenOptions}
                sx={{ mb: 4 }}
                setValue={setValue}
                dropdownRef={destinationTokenRef}
                disabled={!shouldAllowTokensSelection}
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
                sx={{ mb: 0.5 }}
              />
              <Box
                sx={{
                  mt: 1,
                  mb: 5,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAddressDisclaimerChecked}
                      onClick={handleAddressDisclaimerClick}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        opacity: receivingAddress ? 1 : 0.5,
                      }}
                    >
                      I confirm the funds will be accessible at the receiving
                      address{' '}
                      <Link
                        href="https://wiki.sovryn.app/en/sovryn-dapp/bridge#beware-when-sending-to-exchange-addresses"
                        target="_blank"
                        color="primary"
                      >
                        (Learn more)
                      </Link>
                    </Typography>
                  }
                  disabled={!receivingAddress}
                />
              </Box>
              <Button type="submit" fullWidth disabled={!isSubmitAllowed}>
                Convert
              </Button>
            </Box>
          </PageView>
        </form>
      </Box>
    </>
  );
};
