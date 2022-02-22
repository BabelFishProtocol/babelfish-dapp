import { Controller, FieldValues } from 'react-hook-form';
import { ControlledInputWithButtonPillGroupProps } from './ControlledInputWithButtonPillGroup.types';
import { InputWithButtonPillGroup } from '../InputPillGroup/InputWithButtonPillGroup.component';

export const ControlledInputWithButtonPillGroup = <
  FormValues extends FieldValues
>({
  name,
  control,
  setValue,
  ...props
}: ControlledInputWithButtonPillGroupProps<FormValues>) => {
  const onButtonChange = (newValue: string) => {
    setValue(name, newValue);
  };
  return (
    <Controller
      render={({ field: { onChange, value } }) => (
        <InputWithButtonPillGroup
          value={value}
          onInputChange={onChange}
          onButtonChange={onButtonChange}
          {...props}
        />
      )}
      name={name}
      control={control}
    />
  );
};
