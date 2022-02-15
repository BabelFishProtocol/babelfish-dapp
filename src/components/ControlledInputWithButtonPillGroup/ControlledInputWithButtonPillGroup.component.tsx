import { Controller } from 'react-hook-form';
import { ControlledInputWithButtonPillGroupProps } from './ControlledInputWithButtonPillGroup.types';
import { InputWithButtonPillGroup } from '../InputPillGroup/InputWithButtonPillGroup.component';

export const ControlledInputWithButtonPillGroup = ({
  name,
  defaultValue,
  control,
  ...props
}: ControlledInputWithButtonPillGroupProps) => (
  <Controller
    render={({ field: { onChange, value } }) => (
      <InputWithButtonPillGroup
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      />
    )}
    name={name}
    control={control}
    defaultValue={defaultValue}
  />
);
