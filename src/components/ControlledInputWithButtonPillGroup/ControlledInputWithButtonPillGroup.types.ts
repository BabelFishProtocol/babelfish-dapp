import { Control } from 'react-hook-form';
import { InputWithButtonPillGroupProps } from '../InputPillGroup/InputWithButtonPillGroup.types';

export type ControlledInputWithButtonPillGroupProps = Omit<
  InputWithButtonPillGroupProps,
  'value' | 'onChange'
> & {
  control: Control;
  defaultValue: string;
};
