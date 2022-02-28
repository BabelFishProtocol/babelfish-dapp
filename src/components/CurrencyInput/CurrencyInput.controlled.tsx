import { Controller, FieldValues } from 'react-hook-form';
import { CurrencyInput } from './CurrencyInput.component';
import { ControlledCurrencyInputProps } from './CurrencyInput.types';

export const ControlledCurrencyInput = <FormValues extends FieldValues>({
  name,
  rules,
  control,
  ...inputProps
}: ControlledCurrencyInputProps<FormValues>) => (
  <Controller
    render={({ field: { onChange, value }, fieldState }) => (
      <CurrencyInput
        {...inputProps}
        value={value}
        onChange={onChange}
        error={fieldState.error}
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
