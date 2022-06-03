import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { proposalsActions } from '../../store/proposals/proposals.slice';
import {
  isGuardianSelector,
  proposalDetailsCallStatusSelector,
  proposalDetailsSelector,
  voteCallStatusSelector,
} from '../../store/proposals/proposals.selectors';
import { GovernorTypes } from '../../constants';

import { SubmitStepsDialog } from '../../components/TxDialog/TxDialog.component';

import { ProposalDetailsFailure } from './ProposalDetails.failure';
import { ProposalDetailsLoadable } from './ProposalDetails.loadable';
import { ProposalDetailsComponent } from './ProposalDetails.component';

const isProperGovernor = (
  governorType: string | GovernorTypes | undefined
): governorType is GovernorTypes =>
  governorType === GovernorTypes.GovernorOwner ||
  governorType === GovernorTypes.GovernorAdmin;

export const ProposalDetailsContainer = () => {
  const dispatch = useDispatch();
  const { id, governorType } = useParams();
  const { data, state } = useSelector(proposalDetailsSelector);
  const isGuardian = useSelector(isGuardianSelector);
  const voteTx = useSelector(voteCallStatusSelector);
  const proposalDetailsCall = useSelector(proposalDetailsCallStatusSelector);

  useEffect(() => {
    if (isProperGovernor(governorType) && id) {
      dispatch(proposalsActions.watchDetails({ id, governorType }));
    }
    return () => {
      dispatch(proposalsActions.stopWatchingDetails());
    };
  }, [dispatch, governorType, id]);

  const handleQueue = () => dispatch(proposalsActions.queueProposal());
  const handleCancel = () => dispatch(proposalsActions.cancelProposal());
  const handleExecute = () => dispatch(proposalsActions.executeProposal());

  const handleResetVoteCall = () => {
    dispatch(proposalsActions.resetVoteCall());
  };
  const handleResetProposalDetailsCalls = () => {
    dispatch(proposalsActions.resetProposalDetailsCalls());
  };

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
    <>
      <ProposalDetailsComponent
        proposal={data}
        isGuardian={!!isGuardian}
        handleCancel={handleCancel}
        handleQueue={handleQueue}
        handleExecute={handleExecute}
      />
      {voteTx.status !== 'idle' && (
        <SubmitStepsDialog
          onClose={handleResetVoteCall}
          steps={voteTx.steps}
          status={voteTx.status}
          summary={voteTx.summary}
          currentStep={voteTx.currentStep}
        />
      )}
      {proposalDetailsCall.status !== 'idle' && (
        <SubmitStepsDialog
          onClose={handleResetProposalDetailsCalls}
          steps={proposalDetailsCall.steps}
          status={proposalDetailsCall.status}
          summary={proposalDetailsCall.summary}
          currentStep={proposalDetailsCall.currentStep}
        />
      )}
    </>
  );
};
