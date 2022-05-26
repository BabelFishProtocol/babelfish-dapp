import { ChainEnum, isOnRsk } from '../../../config/chains';

export const checkIsCrossChain = (destinationChain: ChainEnum) =>
  isOnRsk(destinationChain) ? 'true' : undefined;
