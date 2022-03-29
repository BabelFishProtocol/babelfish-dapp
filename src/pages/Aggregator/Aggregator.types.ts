import { ChainEnum } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import { AggregatorFormValues } from './Aggregator.fields';

export type AggregatorComponentProps = {
  getReceiveAmount: (sendAmount: string) => string;
  onSubmit: (data: AggregatorFormValues) => void;
  onStartingTokenChange: (token: TokenEnum) => void;
  onDestinationChainChange: (chain: ChainEnum) => void;
  onDestinationTokenChange: (token: TokenEnum) => void;
};
