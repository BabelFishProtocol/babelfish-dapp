import { BigNumber } from 'ethers';
import { ChainEnum } from '../../config/chains';
import { TokenEnum } from '../../config/tokens';
import { AgregatorInputs } from './Agregator.fields';

export type AgregatorFormValues = {
  [AgregatorInputs.StartingChain]: ChainEnum | '';
  [AgregatorInputs.StartingToken]: TokenEnum | '';
  [AgregatorInputs.SendAmount]: string;
  [AgregatorInputs.DestinationChain]: ChainEnum | '';
  [AgregatorInputs.DestinationToken]: TokenEnum | '';
  [AgregatorInputs.ReceiveAmount]: string;
  [AgregatorInputs.ReceiveAddress]: string;
};

export type AgregatorComponentProps = {
  availableBalance?: BigNumber;
  getTokenAvaliableBalance: () => BigNumber;
  getReceiveAmount: (sendAmount: string) => string;
  onSubmit: (data: AgregatorFormValues) => void;
};
