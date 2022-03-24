import { all, takeLatest } from 'typed-redux-saga';

import {
  fetchProposalDetails,
  watchProposalDetails,
} from './sagas/proposalDetails';
import { proposalsActions } from './proposals.slice';
import { fetchProposalsList, watchProposalsList } from './sagas/proposalList';

export function* proposalsSaga() {
  yield* all([
    takeLatest(proposalsActions.fetchDetails.type, fetchProposalDetails),
    takeLatest(proposalsActions.updateDetails.type, fetchProposalDetails),
    takeLatest(proposalsActions.watchDetails.type, watchProposalDetails),

    takeLatest(proposalsActions.fetchProposalsList.type, fetchProposalsList),
    takeLatest(proposalsActions.updateProposalsList.type, fetchProposalsList),
    takeLatest(proposalsActions.watchProposalsList.type, watchProposalsList),
  ]);
}
