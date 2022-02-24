import { Controller, FieldValues } from 'react-hook-form';
import { utils } from 'ethers';
import { ControlledInputWithButtonPillGroupProps } from './ControlledInputWithButtonPillGroup.types';
import { InputWithButtonPillGroup } from '../InputPillGroup/InputWithButtonPillGroup.component';

export const ControlledInputWithButtonPillGroup = <
  FormValues extends FieldValues
>({
  name,
  rules,
  control,
  setValue,
  totalAmount,
  ...props
}: ControlledInputWithButtonPillGroupProps<FormValues>) => {
  const onButtonChange = (newValue: string) => {
    setValue(name, newValue, { shouldValidate: true });
  };
  return (
    <Controller
      render={({ field: { onChange, value } }) => (
        <InputWithButtonPillGroup
          value={value}
          onInputChange={onChange}
          onButtonChange={onButtonChange}
          totalAmount={totalAmount}
          {...props}
        />
      )}
      name={name}
      control={control}
      rules={{
        validate: (v) => !totalAmount || utils.parseUnits(v).lt(totalAmount),
        required: true,
        ...rules,
      }}
    />
  );
};
