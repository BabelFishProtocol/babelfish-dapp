import { ChainEnum } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import { AggregatorInputs } from './Agregator.fields';

export type AgregatorComponentProps = {};

export type AgregatorFormValues = {
  [AggregatorInputs.ChainDropdown]: ChainEnum | '';
  [AggregatorInputs.TokenDropdown]: TokenEnum | '';
  [AggregatorInputs.SendAmount]: string;
  [AggregatorInputs.DestinationChain]: ChainEnum;
  [AggregatorInputs.ReceiveAmount]: string;
  [AggregatorInputs.ReceiveAddress]: string;
};
