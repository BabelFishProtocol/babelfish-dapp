import { Control } from 'react-hook-form';

export type ControlledDropdownProps = {
  name: string;
  label: string;
  placeholder: string;
  control: Control;
  defaultValue: string;
  disabled?: boolean;
  options: any[];
};
