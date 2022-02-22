import { BigNumber } from 'ethers';
import { SetFieldValue } from 'react-hook-form';
import { ControlledInputType } from '../ControlledInput/ControlledInput.types';
import { InputWithButtonPillGroupProps } from '../InputPillGroup/InputWithButtonPillGroup.types';

export type ControlledInputWithButtonPillGroupProps<FormValues> = Omit<
  InputWithButtonPillGroupProps,
  'value' | 'onInputChange' | 'onButtonChange'
> &
  ControlledInputType<FormValues> & {
    setValue: SetFieldValue<FormValues>;
    availableBalance?: BigNumber;
  };
