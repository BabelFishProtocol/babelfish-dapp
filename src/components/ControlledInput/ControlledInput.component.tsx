import { Controller, FieldValues } from 'react-hook-form';
import { TextInput } from '../TextInput/TextInput.component';
import { ControlledInputProps } from './ControlledInput.types';

export const ControlledInput = <FormValues extends FieldValues>({
  name,
  control,
  ...inputProps
}: ControlledInputProps<FormValues>) => (
  <Controller
    render={({ field: { onChange, value } }) => (
      <TextInput {...inputProps} onChange={onChange} value={value} />
    )}
    name={name}
    control={control}
  />
);
