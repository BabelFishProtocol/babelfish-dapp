export type CurrencyInputProps = {
  label?: string;
  symbol: string;
  value: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
