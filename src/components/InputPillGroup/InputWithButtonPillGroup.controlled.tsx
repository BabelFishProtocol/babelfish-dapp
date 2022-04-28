import { Controller, FieldValues } from 'react-hook-form';
import { ControlledInputWithButtonPillGroupProps } from './InputWithButtonPillGroup.types';
import { InputWithButtonPillGroup } from './InputWithButtonPillGroup.component';

export const ControlledInputWithButtonPillGroup = <
  FormValues extends FieldValues
>({
  name,
  rules,
  control,
  setValue,
  totalAmount,
  totalAmountDecimals,
  validate,
  ...props
}: ControlledInputWithButtonPillGroupProps<FormValues>) => {
  const onButtonChange = (newValue: string) => {
    setValue(name, newValue as FormValues[typeof name], {
      shouldValidate: true,
    });
  };

  return (
    <Controller
      render={({ field: { onChange, value, onBlur }, fieldState }) => (
        <InputWithButtonPillGroup
          value={value}
          onBlur={onBlur}
          onInputChange={onChange}
          onButtonChange={onButtonChange}
          error={fieldState.error}
          totalAmount={totalAmount}
          totalAmountDecimals={totalAmountDecimals}
          {...props}
        />
      )}
      name={name}
      control={control}
      rules={{
        validate,
        required: true,
        ...rules,
      }}
    />
  );
};
