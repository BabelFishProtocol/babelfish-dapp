import { UseFormSetValue } from 'react-hook-form';
import { ControlledInputType } from '../../../components/TextInput/TextInput.types';
import { TokenEnum } from '../../../config/tokens';
import { FiniteStates } from '../../../utils/types';

export type SendAmountContainerProps<FormValues> = {
  startingTokenName: TokenEnum | '';
  setValue: UseFormSetValue<FormValues>;
} & ControlledInputType<FormValues>;

export type TokenBalanceProps = {
  startingTokenName: TokenEnum | '';
  startingTokenBalanceState: FiniteStates;
  startingTokenBalance?: string;
  startingTokenDecimals?: number;
};

export type SendAmountComponentProps<FormValues> =
  SendAmountContainerProps<FormValues> & TokenBalanceProps;
