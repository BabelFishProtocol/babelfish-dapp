import { all, takeLatest } from 'typed-redux-saga';
import {
  fetchProposalDetails,
  watchProposalDetails,
} from './sagas/proposalDetails';
import {
  addProposal,
  checkAddEligibility,
  watchAddProposals,
} from './sagas/addProposal';
import { fetchProposalsList, watchProposalsList } from './sagas/proposalList';
import { proposalsActions } from './proposals.slice';
import { castVote } from './sagas/castVote';

export function* proposalsSaga() {
  yield* all([
    takeLatest(proposalsActions.castVote.type, castVote),
    takeLatest(proposalsActions.fetchDetails.type, fetchProposalDetails),
    takeLatest(proposalsActions.updateDetails.type, fetchProposalDetails),
    takeLatest(proposalsActions.watchDetails.type, watchProposalDetails),

    takeLatest(proposalsActions.fetchProposalsList.type, fetchProposalsList),
    takeLatest(proposalsActions.updateProposalsList.type, fetchProposalsList),
    takeLatest(proposalsActions.watchProposalsList.type, watchProposalsList),

    takeLatest(proposalsActions.startProposal, addProposal),
    takeLatest(proposalsActions.watchAddProposal, watchAddProposals),
    takeLatest(proposalsActions.checkAddProposal, checkAddEligibility),
  ]);
}
