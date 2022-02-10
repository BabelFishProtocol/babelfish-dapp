import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  CenteredBox,
  PageAligner,
} from '../../components/PageView/PageView.component';
import { BalanceBlock } from '../../components/BalanceBlock/BalanceBlock.component';
import { Urls } from '../../constants';

import { VestsListContainer } from './VestsList/VestsList.container';
import { StakesListContainer } from './StakesList/StakesList.container';
import { StakingHistoryContainer } from './StakingHistory/StakingHistory.container';
import { RewardBlockProps, StakingComponentProps } from './Staking.types';

export const StakingComponent = ({
  rewards,
  fishStaked,
  totalRewards,
  votingPower,
}: StakingComponentProps) => (
  <PageAligner>
    <Box
      sx={{
        gap: 2,
        width: '90%',
        display: 'flex',
        maxWidth: 1400,
        flexDirection: 'column',
      }}
    >
      <CenteredBox sx={{ width: '100%', gap: 2, alignItems: 'stretch' }}>
        <BalanceBlock label="Total Staked Fish" {...fishStaked}>
          <Button sx={{ width: 'fit-content' }} variant="outlined">
            Add New Stake
          </Button>
        </BalanceBlock>

        <BalanceBlock
          asset="USD"
          label="Total Earned Rewards Available"
          isLoading={totalRewards.isLoading}
          amount={`≈ ${totalRewards.amount}`}
        >
          <Box>
            {rewards.map((reward, index) => (
              <RewardBlock key={index} {...reward} />
            ))}
          </Box>
        </BalanceBlock>

        <BalanceBlock
          asset=""
          label="Combined Voting Power"
          amount={votingPower.amount}
          isLoading={votingPower.isLoading}
        >
          <Button
            sx={{ width: 'fit-content' }}
            variant="outlined"
            component={Link}
            to={Urls.Proposals}
          >
            View Governance
          </Button>
        </BalanceBlock>
      </CenteredBox>

      <StakesListContainer />

      <VestsListContainer />

      <StakingHistoryContainer />
    </Box>
  </PageAligner>
);

const RewardBlock = ({ amount, asset, usdAmount }: RewardBlockProps) => (
  <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
    <Typography variant="caption">
      {asset} {amount} ≈ USD {usdAmount}
    </Typography>
    <Button
      size="small"
      variant="text"
      sx={{ textTransform: 'unset', p: 0, ml: 1 }}
    >
      <Typography variant="body2">withdraw</Typography>
    </Button>
  </Box>
);