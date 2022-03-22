import { BigNumber } from 'ethers';
import { ChainEnum } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import { AggregatorFormValues } from './Aggregator.fields';

export type AggregatorComponentProps = {
  availableBalance?: BigNumber;
  getTokenAvailableBalance: (token: TokenEnum) => BigNumber;
  getReceiveAmount: (sendAmount: string) => string;
  onSubmit: (data: AggregatorFormValues) => void;
  onStartingTokenChange: (token: TokenEnum) => void;
  onDestinationChainChange: (chain: ChainEnum) => void;
};
