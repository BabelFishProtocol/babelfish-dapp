import {
  Control,
  FieldPath,
  ControllerProps,
  FieldValues,
  UseFormSetValue,
} from 'react-hook-form';
import { TypographyProps } from '@mui/material/Typography';
import { SliderProps } from '@mui/material/Slider';

export type SlippageSliderProps = Partial<SliderProps> & {
  title?: string;
  value?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange?: (
    event: Event,
    value: number | number[],
    activeThumb: number
  ) => void;
  labelSx?: TypographyProps['sx'];
};

export type ControlledSliderType<FormValues extends FieldValues> = {
  name: FieldPath<FormValues>;
  control: Control<FormValues>;
  rules?: ControllerProps['rules'];
};

export type ControlledSliderProps<FormValues extends FieldValues> =
  ControlledSliderType<FormValues> &
    SlippageSliderProps & { setValue: UseFormSetValue<FormValues> };
