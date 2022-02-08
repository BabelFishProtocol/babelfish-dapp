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
import { PrettyTx } from '../../components/PrettyTx/PrettyTx.component';
import { Urls } from '../../constants';

import {
  VoteActionBlockProps,
  ProposalInfoItemProps,
  ProposalDetailsComponentProps,
  VotesRatioBlockProps,
} from './ProposalDetails.types';
import {
  AgainstVotesListContainer,
  ForVotesListContainer,
} from './VotesList/VotesList.container';
import { VoteAgainstButton, VoteForButton } from './ProposalDetails.buttons';

export const ProposalDetailsComponent = ({
  proposal,
  votesRatio,
  forVotes,
  voteStatus,
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
            to={Urls.ProposalsList}
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
          <VoteForButton voteStatus={voteStatus} />
        </VoteActionBlock>

        <ForVotesListContainer />

        <Container sx={{ p: 1, mt: 2, height: 200 }}>
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
          <VoteAgainstButton voteStatus={voteStatus} />
        </VoteActionBlock>

        <AgainstVotesListContainer />

        <Container
          sx={{
            p: 1,
            mt: 2,
            height: 200,
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
        </Container>
      </Grid>
    </Grid>
  </PageView>
);

const VotesRatioBlock = ({ votesRatio }: VotesRatioBlockProps) => (
  <CenteredBox>
    <Typography variant="h5" sx={{ m: 1, fontSize: `33px !important` }}>
      {votesRatio}%
    </Typography>
    <Box
      sx={{
        flexGrow: 1,
        height: 14,
        position: 'relative',
        borderRadius: '8px',
        backgroundImage: ({ palette }) =>
          `linear-gradient(to right, ${palette.error.light}, ${palette.error.dark} 90%);`,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: `${votesRatio}%`,
          height: 14,
          borderRadius: '8px',
          backgroundImage: ({ palette }) =>
            `linear-gradient(to right, ${palette.success.light}, ${palette.success.dark} 90%);`,
        }}
      />
    </Box>
    <Typography variant="h5" sx={{ m: 1, fontSize: `33px !important` }}>
      {100 - votesRatio}%
    </Typography>
  </CenteredBox>
);

const ProposalInfoItem = ({
  label,
  children,
  width = 100,
}: ProposalInfoItemProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
