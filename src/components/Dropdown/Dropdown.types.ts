import { SelectChangeEvent } from '@mui/material';

export type DropdownOptionType = {
  id: string;
  name: string;
  icon: string;
};

export type DropdownProps<ItemSelected> = {
  value: Element;
  onChange: (e: SelectChangeEvent<Element>) => void;
  options: ItemSelected[];
  placeholder?: string;
  disabled?: boolean;
};
