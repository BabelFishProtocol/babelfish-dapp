import { Control } from 'react-hook-form';

export type ControlledInputProps = {
  name: string;
  label: string;
  placeholder: string;
  control: Control;
  defaultValue: string;
  disabled?: boolean;
};
