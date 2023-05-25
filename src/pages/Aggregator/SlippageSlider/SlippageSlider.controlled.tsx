import { Controller, FieldValues } from 'react-hook-form';
import { SlippageSlider } from './SlippageSlider.component';
import { ControlledSliderProps } from './SlippageSlider.types';

export const ControlledSlider = <FormValues extends FieldValues>({
  name,
  rules,
  control,
  ...inputProps
}: ControlledSliderProps<FormValues>) => (
  <Controller
    render={({ field: { onChange, value } }) => (
      <SlippageSlider
        {...inputProps}
        onChange={onChange}
        value={value}
      />
    )}
    name={name}
    control={control}
    rules={{
      required: true,
      ...rules,
    }}
  />
);
