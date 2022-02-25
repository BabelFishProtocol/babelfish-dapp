import { FormControlProps } from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';
import { FieldError } from 'react-hook-form';

export type DropdownOptionType = {
  id: string | number;
  name: string;
  icon: string;
};

export type DropdownProps<OptionType, ValueType = unknown> = {
  title?: string;
  value?: ValueType;
  options: OptionType[];
  placeholder?: string;
  disabled?: boolean;
  sx?: FormControlProps['sx'];
  autoFocus?: boolean;
  error?: FieldError;
  onChange?: (e: SelectChangeEvent<ValueType>) => void;
};
