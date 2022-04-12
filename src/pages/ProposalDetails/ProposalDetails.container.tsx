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

  const { handleSubmit: handleQueue, ...queueTxData } = useContractCall(
    async () => {
      if (!data) {
        throw new Error(selectorsErrors.missingData);
      }

      return governorContract?.queue(data.id);
    }
  );

  const { handleSubmit: handleExecute, ...executeTxData } = useContractCall(
    async () => {
      if (!data) {
        throw new Error(selectorsErrors.missingData);
      }

      return governorContract?.execute(data.id);
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
        isGuardian={!!isGuardian}
        handleCancel={handleCancel}
        handleQueue={handleQueue}
        handleExecute={handleExecute}
      />
      {cancelTxData.status !== 'idle' && (
        <SubmitStatusDialog
          operationName="Canceling Proposal"
          successCallback={cancelTxData.onClose}
          {...cancelTxData}
        />
      )}
      {queueTxData.status !== 'idle' && (
        <SubmitStatusDialog
          operationName="Queue Proposal"
          successCallback={queueTxData.onClose}
          {...queueTxData}
        />
      )}
      {executeTxData.status !== 'idle' && (
        <SubmitStatusDialog
          operationName="Executing Proposal"
          successCallback={executeTxData.onClose}
          {...executeTxData}
        />
      )}
    </>
  );
};
