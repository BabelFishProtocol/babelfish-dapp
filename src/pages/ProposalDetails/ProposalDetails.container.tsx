import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { proposalsActions } from '../../store/proposals/proposals.slice';
import {
  isGuardianSelector,
  proposalDetailsSelector,
  selectedProposalGovernor,
} from '../../store/proposals/proposals.selectors';
import { useContractCall } from '../../hooks/useContractCall';
import { GovernorTypes, selectorsErrors } from '../../constants';

import { SubmitStatusDialog } from '../../components/TxDialog/TxDialog.component';
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
  const governorContract = useSelector(selectedProposalGovernor);

  useEffect(() => {
    if (isProperGovernor(governorType) && id) {
      dispatch(proposalsActions.watchDetails({ id, governorType }));
    }
  }, [dispatch, governorType, id]);

  const { handleSubmit: handleCancel, ...cancelTxData } = useContractCall(
    async () => {
      if (!data) {
        throw new Error(selectorsErrors.missingData);
      }

      return governorContract?.cancel(data.id);
    }
  );

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
        voteStatus={mockVoteStatus}
        isGuardian={!!isGuardian}
        handleCancel={handleCancel}
      />
      {cancelTxData.status !== 'idle' && (
        <SubmitStatusDialog
          operationName="Canceling Proposal"
          successCallback={cancelTxData.onClose}
          {...cancelTxData}
        />
      )}
    </>
  );
};

export const ProposalDetailsContainer = () => (
  <WalletConnectionChecker>
    <Container />
  </WalletConnectionChecker>
);
