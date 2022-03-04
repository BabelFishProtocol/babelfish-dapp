import { DefaultValues } from 'react-hook-form';
import { AgregatorFormValues } from './Agregator.types';

export enum AgregatorInputs {
  StartingChain = 'StartingChain',
  StartingToken = 'StartingToken',
  SendAmount = 'SendAmount',
  DestinationChain = 'DestinationChain',
  DestinationToken = 'DestinationToken',
  ReceiveAmount = 'ReceiveAmount',
  ReceiveAddress = 'ReceiveAddress',
}

export const agregatorDefaultValues: DefaultValues<AgregatorFormValues> = {
  [AgregatorInputs.StartingChain]: '',
  [AgregatorInputs.StartingToken]: '',
  [AgregatorInputs.SendAmount]: '',
  [AgregatorInputs.DestinationChain]: '',
  [AgregatorInputs.DestinationToken]: '',
  [AgregatorInputs.ReceiveAmount]: '',
  [AgregatorInputs.ReceiveAddress]: '',
};
