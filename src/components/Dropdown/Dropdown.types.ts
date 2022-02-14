export type DropdownOption = {
  id: string;
  name: string;
  icon: string;
};

export type DropdownProps<ItemSelected> = {
  label: string;
  options: ItemSelected[];
  placeholder?: string;
  disabled?: boolean;
  itemSelectedId?: string;
  setItemSelected: (newValue: string) => void;
};
