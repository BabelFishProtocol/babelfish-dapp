export type ButtonPillGroupProps = {
  selected?: number;
  availableValues: number[];
  onChangeSelected: (newValue: number) => void;
};

export type ButtonPillProps = {
  value: number;
  isSelected: boolean;
  onClick: () => void;
};
