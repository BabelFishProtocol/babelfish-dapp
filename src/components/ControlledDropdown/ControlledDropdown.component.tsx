import { Controller } from 'react-hook-form';

import { DropdownOptions } from '../Dropdown/Dropdown.component';
import { DropdownOptionType } from '../Dropdown/Dropdown.types';
import { ControlledDropdownProps } from './ControlledDropdown.types';

export const ControlledDropdown = <
  OptionType extends DropdownOptionType,
  FormValues
>({
  name,
  rules,
  control,
  ...dropdownProps
}: ControlledDropdownProps<OptionType, FormValues>) => (
  <Controller
    render={({ field: { onChange, value }, fieldState }) => (
      <DropdownOptions
        {...dropdownProps}
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
