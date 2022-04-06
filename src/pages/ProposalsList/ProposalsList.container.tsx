import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { proposalsActions } from '../../store/proposals/proposals.slice';
import { proposalsListSelector } from '../../store/proposals/proposals.selectors';

import { ProposalsListComponent } from './ProposalsList.component';

export const ProposalsListContainer = () => {
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
