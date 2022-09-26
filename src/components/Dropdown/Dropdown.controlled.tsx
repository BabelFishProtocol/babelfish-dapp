import Box from '@mui/material/Box';
import React, { Ref, useCallback } from 'react';
import {
  Controller,
  Path,
  PathValue,
  UnpackNestedValue,
} from 'react-hook-form';

import { DropdownOptions } from './Dropdown.component';
import { DropdownOptionType, ControlledDropdownProps } from './Dropdown.types';

export const ControlledDropdown = <
  OptionType extends DropdownOptionType,
  FormValues
>({
  name,
  rules,
  control,
  options,
  setValue,
  dropdownRef,
  ...dropdownProps
}: ControlledDropdownProps<OptionType, FormValues> & {
  dropdownRef?: Ref<HTMLDivElement>; // I use a custom ref prop because it's not possible to use forwardRef with generic props, see https://9to5answer.com/react-with-typescript-generics-while-using-react-forwardref
}) => {
  const setValueWhenOneOption = useCallback(() => {
    if (options.length === 1) {
      setValue(
        name,
        options[0].id as unknown as UnpackNestedValue<
          PathValue<FormValues, Path<FormValues>>
        >,
        {
          shouldValidate: true,
        }
      );
    }
  }, [name, options, setValue]);

  return (
    <Controller
      render={({ field: { onChange, value }, fieldState }) => (
        <Box>
          <DropdownOptions
            {...dropdownProps}
            options={options}
            value={value}
            onChange={onChange}
            error={fieldState.error}
            setValueWhenOneOption={setValueWhenOneOption}
            dropdownRef={dropdownRef}
          />
        </Box>
      )}
      name={name}
      control={control}
      rules={{
        required: true,
        ...rules,
      }}
    />
  );
};
