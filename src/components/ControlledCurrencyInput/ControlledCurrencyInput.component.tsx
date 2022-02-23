import { Controller, FieldValues } from 'react-hook-form';
import { CurrencyInput } from '../CurrencyInput/CurrencyInput.component';
import { ControlledCurrencyInputProps } from './ControlledCurrencyInput.types';

export const ControlledCurrencyInput = <FormValues extends FieldValues>({
  name,
  control,
  ...inputProps
}: ControlledCurrencyInputProps<FormValues>) => (
  <Controller
    render={({ field: { onChange, value } }) => (
      <CurrencyInput {...inputProps} onChange={onChange} value={value} />
    )}
    name={name}
    control={control}
  />
);
