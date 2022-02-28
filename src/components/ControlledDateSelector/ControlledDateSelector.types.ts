import { ControlledInputType } from '../TextInput/TextInput.types';
import { DateSelectorProps } from '../DateSelector/DateSelector.types';

export type ControlledDateSelectorProps<FormValues> = Omit<
  DateSelectorProps,
  'value' | 'onChange'
> &
  ControlledInputType<FormValues>;
