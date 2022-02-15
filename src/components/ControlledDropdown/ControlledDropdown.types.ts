import { SxProps } from '@mui/material';
import { Control } from 'react-hook-form';

export type ControlledDropdownProps<OptionType> = {
  name: string;
  label: string;
  placeholder: string;
  control: Control;
  defaultValue: string;
  disabled?: boolean;
  options: OptionType[];
  sx?: SxProps;
};
