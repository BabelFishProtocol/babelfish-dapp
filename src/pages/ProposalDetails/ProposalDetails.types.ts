import { ProposalDetails } from '../../store/proposals/proposals.state';

export type ProposalData = Omit<ProposalDetails, 'votes'>;

type ProposalCall = () => Promise<void>;

export type ProposalDetailsComponentProps = Record<
  'handleCancel' | 'handleQueue' | 'handleExecute',
  ProposalCall
> & {
  proposal: ProposalData;
  /** flag to determine whether current account is the guardian of the proposal */
  isGuardian: boolean;
};

export type ProposalInfoItemProps = {
  label: string;
  width?: number;
  children: React.ReactNode;
};
