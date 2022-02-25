import {
  Control,
  FieldPath,
  FieldError,
  ControllerProps,
} from 'react-hook-form';
import { TypographyProps } from '@mui/material/Typography';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';

export type TextInputProps = Partial<Omit<OutlinedInputProps, 'error'>> & {
  title?: string;
  error?: FieldError;
  labelSx?: TypographyProps['sx'];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type ControlledInputType<FormValues> = {
  name: FieldPath<FormValues>;
  control: Control<FormValues>;
  rules?: ControllerProps['rules'];
};

export type ControlledInputProps<FormValues> = ControlledInputType<FormValues> &
  TextInputProps;
