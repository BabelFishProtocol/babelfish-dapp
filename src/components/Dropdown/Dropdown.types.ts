import { FormControlProps } from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';

export type DropdownOptionType = {
  id: string;
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
  onChange?: (e: SelectChangeEvent<ValueType>) => void;
};
