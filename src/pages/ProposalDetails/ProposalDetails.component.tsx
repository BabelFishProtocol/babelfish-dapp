import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import {
  CenteredBox,
  PageView,
} from '../../components/PageView/PageView.component';
import { Button } from '../../components/Button/Button.component';
import { PrettyTx } from '../../components/PrettyTx/PrettyTx.component';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs.component';
import {
  ProposalState,
  proposalStateNames,
  UrlNames,
  Urls,
} from '../../constants';

import { formatTimestamp, getCurrentTimestamp } from '../../utils/helpers';

import {
  ProposalInfoItemProps,
  ProposalDetailsComponentProps,
} from './ProposalDetails.types';
import { VotesRatioBlock } from './ProposalDetails.votesRatio';
import { ForVotesContainer } from './VotesBlock/VotesSummary/ForVotes.container';
import { AgainstVotesContainer } from './VotesBlock/VotesSummary/AgainstVotes.container';

export const ProposalDetailsComponent = ({
  proposal,
  isGuardian,
  handleCancel,
  handleQueue,
  handleExecute,
}: ProposalDetailsComponentProps) => {
  const canCancel =
    isGuardian &&
    ![ProposalState.Executed, ProposalState.Canceled].includes(proposal.state);

  const executingEnabled = getCurrentTimestamp() >= Number(proposal.eta);

  return (
    <>
      <Breadcrumbs
        links={[
          { title: UrlNames.Bitocracy, href: Urls.Bitocracy },
          { title: UrlNames.ProposalDetails },
        ]}
      />
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
            <CenteredBox
              sx={{
                flex: 1,
                display: 'flex',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                justifyContent: 'flex-start',
              }}
            >
              <IconButton
                sx={{ width: '2rem', height: '2rem', mr: 1 }}
                component={Link}
                to={Urls.Bitocracy}
              >
                {'<'}
              </IconButton>
              <Typography variant="h2" noWrap>
                {proposal.title}
              </Typography>
            </CenteredBox>

            <Typography variant="body1" sx={{ ml: 2 }}>
              Voting Ends, Estimate: {formatTimestamp(proposal.endTime)}
            </Typography>
          </Box>
        }
      >
        <Box sx={{ p: ({ spacing }) => spacing(0, 2), mb: 1 }}>
          <VotesRatioBlock />
        </Box>

        <Grid container>
          <Grid item sm={6} p={1}>
            <ForVotesContainer />

            <Container
              sx={{
                p: 2,
                mt: 2,
                height: 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ overflow: 'auto', mb: 2 }}>
                <Typography variant="body2">{proposal.description}</Typography>
              </Box>

              {proposal.actions?.map(
                ({ contract, signature, calldata }, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <ProposalInfoItem label="Function to invoke" width={140}>
                      <Typography
                        color="primary"
                        variant="body2"
                        component="span"
                      >
                        {signature}
                      </Typography>
                    </ProposalInfoItem>

                    <ProposalInfoItem label="Calldata" width={140}>
                      <PrettyTx value={calldata} />
                    </ProposalInfoItem>

                    <ProposalInfoItem label="Contract Address" width={140}>
                      <PrettyTx value={contract} />
                    </ProposalInfoItem>
                  </Box>
                )
              )}
            </Container>
          </Grid>

          <Grid item sm={6} p={1}>
            <AgainstVotesContainer />

            <Container
              sx={{
                p: 2,
                mt: 2,
                height: 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
              }}
            >
              <ProposalInfoItem label="Status">
                <Typography color="primary" variant="body2" component="span">
                  {proposalStateNames[proposal.state]}
                </Typography>
              </ProposalInfoItem>

              <ProposalInfoItem label="Proposed by">
                <PrettyTx value={proposal.proposer} />
              </ProposalInfoItem>

              <ProposalInfoItem label="Proposed on">
                <Box>
                  <Typography variant="body2">
                    {formatTimestamp(proposal.startTime)}
                  </Typography>
                  <Typography color="primary" variant="body2">
                    #{proposal.startBlock}
                  </Typography>
                </Box>
              </ProposalInfoItem>

              <ProposalInfoItem label="Deadline">
                <Box>
                  <Typography variant="body2">
                    {formatTimestamp(proposal.endTime)}
                  </Typography>
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
                {canCancel && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}
                {proposal.state === ProposalState.Succeeded && (
                  <Button variant="outlined" size="small" onClick={handleQueue}>
                    Queue
                  </Button>
                )}
                {proposal.state === ProposalState.Queued && (
                  <Tooltip
                    title={
                      !executingEnabled
                        ? `Executing this proposal will be enabled from ${formatTimestamp(
                            proposal.eta
                          )}`
                        : ''
                    }
                  >
                    <div>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={!executingEnabled}
                        onClick={handleExecute}
                      >
                        Execute
                      </Button>
                    </div>
                  </Tooltip>
                )}
              </CenteredBox>
            </Container>
          </Grid>
        </Grid>
      </PageView>
    </>
  );
};

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
