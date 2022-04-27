import { useCallback } from 'react';
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
  feesAndLimits,
  ...props
}: ControlledInputWithButtonPillGroupProps<FormValues>) => {
  const onButtonChange = (newValue: string) => {
    setValue(name, newValue as FormValues[typeof name], {
      shouldValidate: true,
    });
  };

  const validate = useCallback(
    (v: string) => {
      if (!totalAmount) return true;
      if (utils.parseUnits(v, totalAmountDecimals).gt(totalAmount)) {
        return fieldsErrors.amountGreaterThanBalance;
      }
      if (
        feesAndLimits?.maxTransfer &&
        utils.parseUnits(v, totalAmountDecimals).gt(feesAndLimits?.maxTransfer)
      ) {
        return fieldsErrors.amountGreaterThanMaxLimit;
      }
      if (
        feesAndLimits?.minTransfer &&
        utils.parseUnits(v, totalAmountDecimals).lt(feesAndLimits?.minTransfer)
      ) {
        return fieldsErrors.amountLessThanMinLimit;
      }
    },
    [
      feesAndLimits?.maxTransfer,
      feesAndLimits?.minTransfer,
      totalAmount,
      totalAmountDecimals,
    ]
  );

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
