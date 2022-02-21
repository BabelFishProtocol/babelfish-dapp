import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import { BigNumber } from 'ethers';

export type InputButtonPillGroupProps = Partial<
  Omit<OutlinedInputProps, 'value'>
> & {
  title?: string;
  symbol: string;
  totalAmount: BigNumber;
  // value: string;
  onChange?: (newValue: string) => void;
};
