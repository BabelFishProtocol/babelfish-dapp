import { ControlledInputType } from '../ControlledInput/ControlledInput.types';
import { DateSelectorProps } from '../DateSelector/DateSelector.types';

export type ControlledDateSelectorProps<FormValues> = Omit<
  DateSelectorProps,
  'value' | 'onChange' | 'error'
> &
  ControlledInputType<FormValues>;
