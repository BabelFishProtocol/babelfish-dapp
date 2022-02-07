import { useParams } from 'react-router-dom';
import { ProposalData } from './ProposalDetails.types';
import { ProposalDetailsComponent } from './ProposalDetails.component';

const mockProposal: ProposalData = {
  id: '127865126',
  name: '004SIP-0018: BabelFish',
  endDate: '05/14/21, 12:56PM',
  endBlock: '3347624',
  startDate: '02/14/21, 12:56PM',
  startBlock: '3347624',
  proposedBy: '0x94e907f6B903A393E14FE549113137CA6483b5ef',
  contractAddress: '76q876fdh23984723985349827',
  functionToInvoke: 'symbol () 0X00',
  description:
    'SIP-0018: BabelFish Token Sale via Origins, Details: https://github.com/DistributedCollective/SIPS/blob/f8a726d/SIP-0018.md, sha256: 76q876fdh23984723985349827',
};

export const ProposalDetailsContainer = () => {
  const { id } = useParams();

  if (!id) {
    return <>Missing proposal id</>;
  }

  return (
    <ProposalDetailsComponent
      proposal={{ ...mockProposal, id }}
      votesRatio={80.5}
      forVotes="48.9800K"
      againstVotes="48.9800K"
    />
  );
};
