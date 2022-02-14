import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import {
  CenteredBox,
  PageView,
} from '../../components/PageView/PageView.component';
import { Button } from '../../components/Button/Button.component';
import { PrettyTx } from '../../components/PrettyTx/PrettyTx.component';
import { ProposalState, Urls } from '../../constants';

import {
  VoteActionBlockProps,
  ProposalInfoItemProps,
  ProposalDetailsComponentProps,
} from './ProposalDetails.types';
import {
  AgainstVotesListContainer,
  ForVotesListContainer,
} from './VotesList/VotesList.container';
import {
  VoteAgainstButton,
  VoteForButton,
} from './ProposalDetails.voteButtons';
import { VotesRatioBlock } from './ProposalDetails.votesRatio';

export const ProposalDetailsComponent = ({
  proposal,
  forVotes,
  voteStatus,
  votesRatio,
  isGuardian,
  againstVotes,
}: ProposalDetailsComponentProps) => (
  <PageView
    title={
      <Box
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <CenteredBox>
          <IconButton
            sx={{ mr: 1, p: 0.2 }}
            component={Link}
            to={Urls.Proposals}
          >
            {'<'}
          </IconButton>
          <Typography variant="h2">{proposal.name}</Typography>
        </CenteredBox>

        <Typography variant="body1">Voting Ends {proposal.endDate}</Typography>
      </Box>
    }
  >
    <Grid container>
      <Grid item sm={12} sx={{ p: ({ spacing }) => spacing(0, 2) }}>
        <VotesRatioBlock
          votesRatio={votesRatio}
          forVotes={forVotes}
          againstVotes={againstVotes}
        />
      </Grid>

      <Grid item sm={6} p={1}>
        <VoteActionBlock votesAmount={`${forVotes} VOTES FOR`}>
          <VoteForButton
            voteStatus={voteStatus}
            proposalState={proposal.state}
          />
        </VoteActionBlock>

        <ForVotesListContainer />

        <Container sx={{ p: 2, mt: 2, height: 220 }}>
          <Typography variant="body2" sx={{ height: 130 }}>
            {proposal.description}
          </Typography>

          <ProposalInfoItem label="Function to invoke" width={140}>
            <Typography color="primary" variant="body2" component="span">
              {proposal.functionToInvoke}
            </Typography>
          </ProposalInfoItem>

          <ProposalInfoItem label="Contract Address" width={140}>
            <Typography color="primary" variant="body2" component="span">
              {proposal.contractAddress}
            </Typography>
          </ProposalInfoItem>
        </Container>
      </Grid>

      <Grid item sm={6} p={1}>
        <VoteActionBlock votesAmount={`${againstVotes} VOTES AGAINST`}>
          <VoteAgainstButton
            voteStatus={voteStatus}
            proposalState={proposal.state}
          />
        </VoteActionBlock>

        <AgainstVotesListContainer />

        <Container
          sx={{
            p: 2,
            mt: 2,
            height: 220,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
          }}
        >
          <ProposalInfoItem label="Proposed by">
            <PrettyTx value={proposal.proposedBy} />
          </ProposalInfoItem>

          <ProposalInfoItem label="Proposed on">
            <Box>
              <Typography variant="body2">{proposal.startDate}</Typography>
              <Typography color="primary" variant="body2">
                #{proposal.startBlock}
              </Typography>
            </Box>
          </ProposalInfoItem>

          <ProposalInfoItem label="Deadline">
            <Box>
              <Typography variant="body2">{proposal.endDate}</Typography>
              <Typography color="primary" variant="body2">
                #{proposal.endBlock}
              </Typography>
            </Box>
          </ProposalInfoItem>

          <ProposalInfoItem label="Proposal ID">
            <Typography color="primary" variant="body2" component="span">
              {proposal.id}
            </Typography>
          </ProposalInfoItem>

          <CenteredBox sx={{ mt: 1, gap: 2 }}>
            {proposal.state !== ProposalState.Executed && isGuardian && (
              <Button variant="outlined" size="small">
                Cancel
              </Button>
            )}
            {proposal.state === ProposalState.Succeeded && (
              <Button variant="outlined" size="small">
                Queue
              </Button>
            )}
            {proposal.state === ProposalState.Queued &&
              proposal.eta <= new Date().getTime() / 1000 && (
                <Button variant="outlined" size="small">
                  Execute
                </Button>
              )}
          </CenteredBox>
        </Container>
      </Grid>
    </Grid>
  </PageView>
);

const ProposalInfoItem = ({
  label,
  children,
  width = 100,
}: ProposalInfoItemProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Typography variant="body2" sx={{ width }}>
      {label}:
    </Typography>
    {children}
  </Box>
);

const VoteActionBlock = ({ votesAmount, children }: VoteActionBlockProps) => (
  <Box
    sx={{
      gap: 2,
      height: 50,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <CenteredBox
      sx={{
        p: 1,
        flexGrow: 1,
        borderRadius: '8px',
        backgroundColor: ({ palette }) => palette.borderGrey.dark,
      }}
    >
      <Typography variant="body1">{votesAmount}</Typography>
    </CenteredBox>
    {children}
  </Box>
);
