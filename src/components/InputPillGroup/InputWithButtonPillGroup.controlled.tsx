import { Controller, FieldValues } from 'react-hook-form';
import { utils } from 'ethers';
import { ControlledInputWithButtonPillGroupProps } from './InputWithButtonPillGroup.types';
import { InputWithButtonPillGroup } from './InputWithButtonPillGroup.component';
import { fieldsErrors } from '../../constants';

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

  const defaultValidate = (v: string) =>
    !totalAmount || utils.parseUnits(v, totalAmountDecimals).lte(totalAmount)
      ? true
      : fieldsErrors.amountGreaterThanBalance;

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
        validate: validate || defaultValidate,
        required: true,
        ...rules,
      }}
    />
  );
};
