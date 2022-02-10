export type CurrencyInputProps = {
  title?: string;
  symbol: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
