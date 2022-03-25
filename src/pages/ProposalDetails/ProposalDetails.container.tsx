import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { proposalsActions } from '../../store/proposals/proposals.slice';
import {
  isGuardianSelector,
  proposalDetailsSelector,
} from '../../store/proposals/proposals.selectors';
import { GovernorTypes } from '../../constants';

import { WalletConnectionChecker } from '../../components/WalletConnectionChecker/WalletConnectionChecker.component';

import { VoteStatus } from './ProposalDetails.types';
import { ProposalDetailsFailure } from './ProposalDetails.failure';
import { ProposalDetailsLoadable } from './ProposalDetails.loadable';
import { ProposalDetailsComponent } from './ProposalDetails.component';

const mockVoteStatus: VoteStatus = {
  type: 'for',
  status: 'idle',
};

const isProperGovernor = (
  governorType: string | GovernorTypes | undefined
): governorType is GovernorTypes =>
  governorType === GovernorTypes.GovernorOwner ||
  governorType === GovernorTypes.GovernorAdmin;

const Container = () => {
  const dispatch = useDispatch();
  const { id, governorType } = useParams();
  const { data, state } = useSelector(proposalDetailsSelector);
  const isGuardian = useSelector(isGuardianSelector);

  useEffect(() => {
    if (isProperGovernor(governorType) && id) {
      dispatch(proposalsActions.watchDetails({ id, governorType }));
    }
  }, [dispatch, governorType, id]);

  if (!id) return <>Missing proposal data</>;

  if (!isProperGovernor(governorType)) {
    return <>Wrong governor contract</>;
  }

  if (state === 'failure') {
    return <ProposalDetailsFailure />;
  }

  if (!data) {
    return <ProposalDetailsLoadable />;
  }

  return (
    <ProposalDetailsComponent
      proposal={data}
      voteStatus={mockVoteStatus}
      isGuardian={!!isGuardian}
    />
  );
};

export const ProposalDetailsContainer = () => (
  <WalletConnectionChecker>
    <Container />
  </WalletConnectionChecker>
);
