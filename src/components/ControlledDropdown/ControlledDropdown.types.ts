import { SxProps } from '@mui/material';
import { Control, FieldPath } from 'react-hook-form';

export type ControlledDropdownProps<
  OptionType,
  FormValues,
  NameType = FieldPath<FormValues>
> = {
  name: NameType;
  label: string;
  placeholder?: string;
  control: Control<FormValues>;
  disabled?: boolean;
  options: OptionType[];
  sx?: SxProps;
};
