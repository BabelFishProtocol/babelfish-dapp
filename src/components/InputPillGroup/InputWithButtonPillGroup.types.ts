import { BigNumber } from 'ethers';

export type InputButtonPillGroupProps = {
  title?: string;
  symbol: string;
  totalAmount: BigNumber;
  // value: string;
  onChange?: (newValue: string) => void;
};
