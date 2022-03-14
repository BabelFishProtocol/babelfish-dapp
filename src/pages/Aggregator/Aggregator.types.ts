import { BigNumber } from 'ethers';
import { TokenEnum } from '../../config/tokens';
import { AggregatorFormValues } from './Aggregator.fields';

export type AggregatorComponentProps = {
  availableBalance?: BigNumber;
  getTokenAvailableBalance: (token: TokenEnum) => BigNumber;
  getReceiveAmount: (sendAmount: string) => string;
  onSubmit: (data: AggregatorFormValues) => void;
};
