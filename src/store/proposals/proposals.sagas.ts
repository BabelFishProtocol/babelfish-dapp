import { all, takeLatest } from 'typed-redux-saga';

import { proposalsActions } from './proposals.slice';

import { fetchProposalsList, watchProposalsList } from './sagas/proposalList';
import {
  fetchProposalDetails,
  watchProposalsDetails,
} from './sagas/proposalDetails';

export function* proposalsSaga() {
  yield* all([
    takeLatest(proposalsActions.fetchDetails.type, fetchProposalDetails),
    takeLatest(proposalsActions.updateDetails.type, fetchProposalDetails),
    takeLatest(proposalsActions.watchDetails.type, watchProposalsDetails),

    takeLatest(proposalsActions.fetchProposalsList.type, fetchProposalsList),
    takeLatest(proposalsActions.updateProposalsList.type, fetchProposalsList),
    takeLatest(proposalsActions.watchProposalsList.type, watchProposalsList),
  ]);
}
