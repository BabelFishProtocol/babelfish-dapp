import { select, put } from 'typed-redux-saga';
import { GovernorAlpha } from '../../../contracts/types';
import { ProposalListQueryItem } from '../../../queries/proposalListQuery';
import { MulticallProviderType, SagaContractCallStep } from '../../types';
import {
  multiCall,
  convertForMulticall,
  contractStepCallsSaga,
} from '../../utils/utils.sagas';
import {
  selectedProposalGovernor,
  selectedProposalIdSelector,
} from '../proposals.selectors';
import { proposalsActions } from '../proposals.slice';
import { ProposalDetailsCalls } from '../proposals.state';
import { forceProposalReFetch } from './proposalDetails';

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

type CreateStepCallAction = (
  governorContract: GovernorAlpha,
  proposalId: string
) => SagaContractCallStep<ProposalDetailsCalls>;

export function* proposalDetailsCall(getStep: CreateStepCallAction) {
  const proposalId = yield* select(selectedProposalIdSelector);
  const governorContract = yield* select(selectedProposalGovernor);

  if (!proposalId || !governorContract) {
    yield* put(proposalsActions.setVoteCallError('Proposal not selected'));
    return;
  }

  const step = getStep(governorContract, proposalId);

  yield* put(proposalsActions.setProposalDetailsCallSteps([step]));

  yield* contractStepCallsSaga({
    steps: [step],
    setErrorAction: proposalsActions.setProposalDetailsCallError,
    setStatusAction: proposalsActions.setProposalDetailsCallStatus,
    setStepDataAction: proposalsActions.setProposalDetailsCallStepData,
  });

  yield* forceProposalReFetch();
}
