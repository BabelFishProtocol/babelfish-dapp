import { Controller, FieldValues } from 'react-hook-form';
import { TextInput } from './TextInput.component';
import { ControlledInputProps } from './TextInput.types';

export const ControlledInput = <FormValues extends FieldValues>({
  name,
  rules,
  control,
  ...inputProps
}: ControlledInputProps<FormValues>) => (
  <Controller
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <TextInput
        {...inputProps}
        onChange={onChange}
        error={error}
        value={value}
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
