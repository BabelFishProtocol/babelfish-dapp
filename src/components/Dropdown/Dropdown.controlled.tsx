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

export const ControlledDropdown = React.forwardRef(
  <OptionType extends DropdownOptionType, FormValues>(
    {
      name,
      rules,
      control,
      options,
      setValue,
      ...dropdownProps
    }: ControlledDropdownProps<OptionType, FormValues>,
    ref?: Ref<HTMLDivElement>
  ) => {
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
              ref={ref}
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
  }
);
