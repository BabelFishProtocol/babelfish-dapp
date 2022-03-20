import { DefaultValues } from 'react-hook-form';
import { ChainEnum } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';

export enum AggregatorInputs {
  StartingChain = 'StartingChain',
  StartingToken = 'StartingToken',
  SendAmount = 'SendAmount',
  DestinationChain = 'DestinationChain',
  DestinationToken = 'DestinationToken',
  ReceiveAmount = 'ReceiveAmount',
  ReceiveAddress = 'ReceiveAddress',
}

export type AggregatorFormValues = {
  [AggregatorInputs.StartingChain]: ChainEnum | '';
  [AggregatorInputs.StartingToken]: TokenEnum | '';
  [AggregatorInputs.SendAmount]: string;
  [AggregatorInputs.DestinationChain]: ChainEnum | '';
  [AggregatorInputs.DestinationToken]: TokenEnum | '';
  [AggregatorInputs.ReceiveAmount]: string;
  [AggregatorInputs.ReceiveAddress]: string;
};

export const aggregatorDefaultValues: DefaultValues<AggregatorFormValues> = {
  [AggregatorInputs.StartingChain]: '',
  [AggregatorInputs.StartingToken]: '',
  [AggregatorInputs.SendAmount]: '',
  [AggregatorInputs.DestinationChain]: '',
  [AggregatorInputs.DestinationToken]: '',
  [AggregatorInputs.ReceiveAmount]: '',
  [AggregatorInputs.ReceiveAddress]: '',
};
