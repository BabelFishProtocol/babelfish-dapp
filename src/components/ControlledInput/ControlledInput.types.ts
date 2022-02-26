import { Control, FieldPath } from 'react-hook-form';
import { TextInputProps } from '../TextInput/TextInput.types';

export type ControlledInputType<FormValues> = {
  name: FieldPath<FormValues>;
  control: Control<FormValues>;
};

export type ControlledInputProps<FormValues> = ControlledInputType<FormValues> &
  TextInputProps;
