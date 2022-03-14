import { BigNumber } from 'ethers';
import { LoadableValue } from '../types';

export type ProposalConstants = {
  threshold?: BigNumber;
};

export type ProposalThresholdState = {
  threshold: BigNumber;
};

export type ProposalGovernorInput = {
  governorType: string;
};

export class ProposalState {
  threshold?: BigNumber;
  selectedGovernorType?: string;

  constants: LoadableValue<ProposalConstants> = {
    state: 'idle',
    data: {},
  };
}
