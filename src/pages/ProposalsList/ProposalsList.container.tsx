import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { proposalsActions } from '../../store/proposals/proposals.slice';
import { proposalsListSelector } from '../../store/proposals/proposals.selectors';

import { WalletConnectionChecker } from '../../components/WalletConnectionChecker/WalletConnectionChecker.component';

import { ProposalsListComponent } from './ProposalsList.component';

const Container = () => {
  const dispatch = useDispatch();
  const { data, state } = useSelector(proposalsListSelector);

  useEffect(() => {
    dispatch(proposalsActions.watchProposalsList());

    return () => {
      dispatch(proposalsActions.stopWatchingProposalsList());
    };
  }, [dispatch]);

  return <ProposalsListComponent proposals={data} state={state} />;
};

export const ProposalsListContainer = () => (
  <WalletConnectionChecker>
    <Container />
  </WalletConnectionChecker>
);
