import { RefObject } from 'react';
import { ChainEnum } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import { AggregatorFormValues } from './Aggregator.fields';

export type AggregatorComponentProps = {
  onSubmit: (data: AggregatorFormValues) => void;
  onStartingTokenChange: (token: TokenEnum | undefined) => void;
  onDestinationChainChange: (chain: ChainEnum) => void;
  onDestinationTokenChange: (token: TokenEnum | undefined) => void;
  isStartingTokenPaused: boolean;
  onSendAmountChange: (amount: string) => void;
};

export type FocusActiveFieldParameters = {
  isPreviousFieldEmpty: boolean;
  isCurrentFieldEmpty: boolean;
  currentFieldRef: RefObject<HTMLDivElement>;
};
