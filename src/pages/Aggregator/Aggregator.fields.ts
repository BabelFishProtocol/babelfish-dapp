import { DefaultValues } from 'react-hook-form';
import { ChainEnum } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';

export enum AggregatorInputs {
  StartingChain = 'startingChain',
  StartingToken = 'startingToken',
  SendAmount = 'sendAmount',
  DestinationChain = 'destinationChain',
  DestinationToken = 'destinationToken',
  ReceiveAddress = 'receiveAddress',
  ReceiveAmount = 'receiveAmount'
}

export type AggregatorFormValues = {
  [AggregatorInputs.StartingChain]: ChainEnum | '';
  [AggregatorInputs.StartingToken]: TokenEnum | '';
  [AggregatorInputs.SendAmount]: string;
  [AggregatorInputs.DestinationChain]: ChainEnum | '';
  [AggregatorInputs.DestinationToken]: TokenEnum | '';
  [AggregatorInputs.ReceiveAddress]: string;
  [AggregatorInputs.ReceiveAmount]: string;
};

export const aggregatorDefaultValues: DefaultValues<AggregatorFormValues> = {
  [AggregatorInputs.StartingChain]: '',
  [AggregatorInputs.StartingToken]: '',
  [AggregatorInputs.SendAmount]: '',
  [AggregatorInputs.DestinationChain]: '',
  [AggregatorInputs.DestinationToken]: '',
  [AggregatorInputs.ReceiveAddress]: '',
  [AggregatorInputs.ReceiveAmount]: '',
};
