import { call } from 'typed-redux-saga';
import { proposalDetailsCall } from './utils';

export function* executeProposal() {
  yield* proposalDetailsCall((governor, proposalId) => ({
    name: 'execute',
    effect: call(governor.execute, proposalId),
  }));
}

export function* queueProposal() {
  yield* proposalDetailsCall((governor, proposalId) => ({
    name: 'queue',
    effect: call(governor.queue, proposalId),
  }));
}

export function* cancelProposal() {
  yield* proposalDetailsCall((governor, proposalId) => ({
    name: 'cancel',
    effect: call(governor.cancel, proposalId),
  }));
}
