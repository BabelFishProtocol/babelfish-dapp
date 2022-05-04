import Box from '@mui/material/Box';
import { FieldValues } from 'react-hook-form';
import { ControlledInputWithButtonPillGroup } from '../../../components/InputPillGroup/InputWithButtonPillGroup.controlled';
import { TokenBalance } from './TokenBalance.component';
import { SendAmountComponentProps } from './SendAmount.types';

export const SendAmountComponent = <FormValues extends FieldValues>({
  startingTokenName,
  startingTokenBalanceState,
  startingTokenDecimals,
  name,
  control,
  setValue,
  validate,
  startingTokenBalance = '0',
}: SendAmountComponentProps<FormValues>) => (
  <>
    <Box sx={{ mb: 8, position: 'relative' }}>
      <TokenBalance
        startingTokenName={startingTokenName}
        startingTokenBalanceState={startingTokenBalanceState}
        startingTokenBalance={startingTokenBalance}
        startingTokenDecimals={startingTokenDecimals}
      />
    </Box>
    <ControlledInputWithButtonPillGroup
      name={name}
      title="Amount"
      placeholder="0.00"
      disabled={!startingTokenName}
      symbol={startingTokenName}
      totalAmount={startingTokenBalance}
      totalAmountDecimals={startingTokenDecimals}
      control={control}
      setValue={setValue}
      validate={validate}
    />
  </>
);
