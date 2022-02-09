type DropdownOption = {
  value: string;
  name: string;
  icon: string;
};

export type DropdownProps = {
  label: string;
  options: DropdownOption[];
  placeholder?: string;
};
