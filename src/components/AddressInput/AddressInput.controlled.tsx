import { Controller, FieldValues } from 'react-hook-form';
import { fieldsErrors } from '../../constants';
import { isRskAddress } from '../../utils/helpers';
import { AddressInput } from './AddressInput.component';
import { ControlledAddressInputProps } from './AddressInput.types';

export const ControlledAddressInput = <FormValues extends FieldValues>({
  name,
  rules,
  control,
  ...inputProps
}: ControlledAddressInputProps<FormValues>) => (
  <Controller
    render={({ field: { onChange, value }, fieldState }) => (
      <AddressInput
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
      validate: (val) =>
        isRskAddress(val) ? true : fieldsErrors.addressFormat,
      ...rules,
    }}
  />
);
