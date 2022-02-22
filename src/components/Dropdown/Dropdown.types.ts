import { SelectChangeEvent } from '@mui/material';

export type DropdownOptionType = {
  id: string;
  name: string;
  icon: string;
};

export type DropdownProps<ItemSelected, ValueType> = {
  value: ValueType;
  onChange: (e: SelectChangeEvent<ValueType>) => void;
  options: ItemSelected[];
  placeholder?: string;
  disabled?: boolean;
};
