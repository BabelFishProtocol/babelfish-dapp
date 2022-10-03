import { RefObject } from 'react';
import { ChainEnum } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import { AggregatorFormValues } from './Aggregator.fields';

export type AggregatorComponentProps = {
  getReceiveAmount: (sendAmount: string) => string;
  onSubmit: (data: AggregatorFormValues) => void;
  onStartingTokenChange: (token: TokenEnum | undefined) => void;
  onDestinationChainChange: (chain: ChainEnum) => void;
  onDestinationTokenChange: (token: TokenEnum | undefined) => void;
};

export type FocusActiveFieldParameters = {
  isPreviousFieldEmpty: boolean;
  isCurrentFieldEmpty: boolean;
  currentFieldRef: RefObject<HTMLDivElement>;
};
