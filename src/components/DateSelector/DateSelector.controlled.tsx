import { Controller, FieldValues } from 'react-hook-form';
import { DateSelector } from './DateSelector.component';
import { ControlledDateSelectorProps } from './DateSelector.types';

export const ControlledDateSelector = <FormValues extends FieldValues>({
  name,
  control,
  rules,
  ...props
}: ControlledDateSelectorProps<FormValues>) => (
  <Controller
    render={({ field: { onChange, value }, fieldState }) => (
      <DateSelector
        value={value}
        onChange={onChange}
        error={fieldState.error}
        {...props}
      />
    )}
    name={name}
    control={control}
    rules={{
      required: true,
      ...rules,
    }}
  />
);
