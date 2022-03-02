import { Controller, FieldValues } from 'react-hook-form';
import { DateSelector } from '../DateSelector/DateSelector.component';
import { ControlledDateSelectorProps } from './ControlledDateSelector.types';

export const ControlledDateSelector = <FormValues extends FieldValues>({
  name,
  control,
  rules,
  ...props
}: ControlledDateSelectorProps<FormValues>) => (
  <Controller
    render={({ field: { onChange, value } }) => (
      <DateSelector value={value} onChange={onChange} {...props} />
    )}
    name={name}
    control={control}
    rules={{
      required: true,
      ...rules,
    }}
  />
);
