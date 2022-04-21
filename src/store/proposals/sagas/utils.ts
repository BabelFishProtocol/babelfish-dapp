import { GovernorAlpha } from '../../../contracts/types';
import { ProposalListQueryItem } from '../../../queries/proposalListQuery';
import { MulticallProviderType } from '../../types';
import { convertForMulticall, multiCall } from '../../utils';

export function* fetchProposalStates(
  proposals: ProposalListQueryItem[],
  governor: GovernorAlpha,
  multicallProvider: MulticallProviderType
) {
  const proposalStateCalls = proposals.map(({ proposalId }) =>
    convertForMulticall(governor, 'state', 'state(uint256)', proposalId)
  );

  const proposalsStates = yield* multiCall(
    multicallProvider,
    ...proposalStateCalls
  );

  return proposalsStates;
}
