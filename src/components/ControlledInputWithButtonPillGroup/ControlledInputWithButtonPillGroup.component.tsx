import { Controller, FieldValues } from 'react-hook-form';
import { utils } from 'ethers';
import { fieldsErrors } from '../../constants';
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
          !totalAmount || utils.parseUnits(v).lte(totalAmount)
            ? true
            : fieldsErrors.amountGreaterThanBalance,
        required: true,
        ...rules,
      }}
    />
  );
};
