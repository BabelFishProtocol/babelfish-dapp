export type ButtonPillGroupProps = {
  availableValues: number[];
  disabled?: boolean;
  value?: number;
  handleChange?: (
    e: React.MouseEvent<HTMLElement>,
    newPercentValue: number | null
  ) => void;
};

export type ButtonPillProps = {
  value: number;
};
