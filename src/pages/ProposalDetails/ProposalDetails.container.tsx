import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { proposalsActions } from '../../store/proposals/proposals.slice';
import { proposalDetailsSelector } from '../../store/proposals/proposals.selectors';

import { WalletConnectionChecker } from '../../components/WalletConnectionChecker/WalletConnectionChecker.component';

import { VoteStatus } from './ProposalDetails.types';
import { ProposalDetailsFailure } from './ProposalDetails.failure';
import { ProposalDetailsLoadable } from './ProposalDetails.loadable';
import { ProposalDetailsComponent } from './ProposalDetails.component';

const mockVoteStatus: VoteStatus = {
  type: 'for',
  status: 'idle',
};

const Container = () => {
  const dispatch = useDispatch();
  const { id, contractAddress } = useParams();
  const { data, state } = useSelector(proposalDetailsSelector);

  useEffect(() => {
    dispatch(proposalsActions.watchDetails({ id, contractAddress }));
  }, [contractAddress, dispatch, id]);

  if (!id || !contractAddress) {
    return <>Missing proposal data</>;
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
      isGuardian
    />
  );
};

export const ProposalDetailsContainer = () => (
  <WalletConnectionChecker>
    <Container />
  </WalletConnectionChecker>
);
