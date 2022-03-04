import { ContractCall, Provider } from 'ethers-multicall';
import {
  all,
  put,
  call,
  fork,
  take,
  cancel,
  select,
  takeLatest,
} from 'typed-redux-saga';

import { ProposalState } from '../../constants';
import { GovernorAdmin } from '../../contracts/types';

import {
  providerSelector,
  governorAdminSelector,
  governorOwnerSelector,
} from '../app/app.selectors';
import { appActions } from '../app/app.slice';

import { Proposal } from './proposals.state';
import { proposalsActions } from './proposals.slice';
import { convertForMulticall, getMulticallSaga } from '../utils';

type ProposalsResult = Awaited<ReturnType<GovernorAdmin['proposals']>>;
type ProposalStateResult = Awaited<ReturnType<GovernorAdmin['state']>>;

export function* fetchProposalsForContract(
  governor: GovernorAdmin,
  multicall: Provider
) {
  const provider = yield* select(providerSelector);
  const proposalsCount = yield* call(governor.proposalCount);

  if (!provider) throw new Error('Wallet not connected!');

  const proposalsCalls: ContractCall[] = [];
  const proposalsStatesCalls: ContractCall[] = [];

  for (let index = proposalsCount; index.gt(0); index = index.sub(1)) {
    proposalsCalls.push(
      convertForMulticall(governor, 'proposals', 'proposals(uint256)', index)
    );
    proposalsStatesCalls.push(
      convertForMulticall(governor, 'state', 'state(uint256)', index)
    );
  }

  const proposalsData: ProposalsResult[] = yield* call(
    [multicall, multicall.all],
    proposalsCalls
  );
  const proposalsStates: ProposalStateResult[] = yield* call(
    [multicall, multicall.all],
    proposalsStatesCalls
  );
  const proposalsEndDates = yield* all(
    proposalsData.map(({ endBlock }) =>
      call([provider, provider.getBlock], endBlock)
    )
  );

  const parsedProposals: Proposal[] = proposalsData.map((proposal, index) => {
    const { id, eta, quorum, startTime, forVotes, againstVotes } = proposal;

    const proposalState = proposalsStates[index];
    const { timestamp } = proposalsEndDates[index];

    const parsedProposal: Proposal = {
      ...proposal,
      id: id.toString(),
      eta: eta.toNumber(),
      quorum: quorum.toString(),
      startTime: startTime.toNumber(),
      forVotes: forVotes.toString(),
      againstVotes: againstVotes.toString(),
      endTime: timestamp,
      state: proposalState as unknown as ProposalState,
    };

    return parsedProposal;
  });

  return parsedProposals;
}

export function* fetchProposalsList() {
  try {
    const governorAdmin = yield* select(governorAdminSelector);
    const governorOwner = yield* select(governorOwnerSelector);
    const multicallProvider = yield* getMulticallSaga();

    if (!governorAdmin) {
      throw new Error('Wallet not connected');
    }

    const adminItems = yield* fetchProposalsForContract(
      governorAdmin,
      multicallProvider
    );

    let ownerItems: Proposal[] = [];

    if (governorOwner && governorOwner.address !== governorAdmin.address) {
      ownerItems = yield* fetchProposalsForContract(
        governorOwner,
        multicallProvider
      );
    }

    const mergedProposals = [...adminItems, ...ownerItems].sort(
      (a, b) => b.startBlock - a.startBlock
    );

    yield* put(proposalsActions.setProposalsList(mergedProposals));
  } catch (e) {
    yield* put(proposalsActions.fetchProposalsListFailure());
  }
}

function* triggerFetch() {
  yield* put(proposalsActions.fetchProposalsList());
}

function* runUpdater() {
  yield* triggerFetch();

  yield* takeLatest(
    [
      appActions.setChainId.type,
      appActions.setAccount.type,
      appActions.setBlockNumber.type,
    ],
    triggerFetch
  );
}

function* watchProposalsData() {
  const updaterTask = yield* fork(runUpdater);

  yield* take(proposalsActions.stopWatchingProposalsList.type);

  yield* cancel(updaterTask);
}

export function* proposalsSaga() {
  yield* all([
    takeLatest(proposalsActions.fetchProposalsList.type, fetchProposalsList),
    takeLatest(proposalsActions.watchProposalsList.type, watchProposalsData),
  ]);
}
