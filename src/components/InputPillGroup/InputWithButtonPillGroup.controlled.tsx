import { Controller, FieldValues } from 'react-hook-form';
import { utils } from 'ethers';
import { fieldsErrors } from '../../constants';
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
          {...props}
        />
      )}
      name={name}
      control={control}
      rules={{
        validate: (v) =>
          !totalAmount ||
          utils.parseUnits(v, totalAmountDecimals).lte(totalAmount)
            ? true
            : fieldsErrors.amountGreaterThanBalance,
        required: true,
        ...rules,
      }}
    />
  );
};
