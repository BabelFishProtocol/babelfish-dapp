import { useState } from 'react';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  CenteredBox,
  PageAligner,
} from '../../components/PageView/PageView.component';
import { BalanceBlock } from '../../components/BalanceBlock/BalanceBlock.component';
import { Breadcrumbs } from '../../components/Breadcrumbs/Breadcrumbs.component';
import { UrlNames, Urls } from '../../constants';
import { formatWeiAmount } from '../../utils/helpers';

import { VestsListContainer } from './VestsList/VestsList.container';
import { StakesListContainer } from './StakesList/StakesList.container';
import { AddNewStakeContainer } from './AddNewStake/AddNewStake.container';
import { StakingHistoryContainer } from './StakingHistory/StakingHistory.container';
import { RewardBlockProps, StakingComponentProps } from './Staking.types';
import wave1Icon from '../../assets/icons/wave1.svg';
import wave2Icon from '../../assets/icons/wave2.svg';
import wave3Icon from '../../assets/icons/wave3.svg';
import maintenanceModeIcon from '../../assets/icons/maintenance-mode.svg';
import { useIsInMaintenance } from './Staking.hooks';

export const StakingComponent = ({
  rewards,
  fishStaked,
  totalRewards,
  votingPower,
}: StakingComponentProps) => {
  const [showAddStakeDialog, setShowAddStakeDialog] = useState(false);

  const isInMaintenance = useIsInMaintenance();

  const handleOpenDialog = () => setShowAddStakeDialog(true);
  const handleCloseDialog = () => setShowAddStakeDialog(false);

  return (
    <Box sx={{ position: 'relative' }}>
      {isInMaintenance && <MaintenanceModeOverlay />}
      <Breadcrumbs links={[{ title: UrlNames.Staking }]} />
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
            <BalanceBlock
              label="Total Staked Fish"
              {...fishStaked}
              imgSrc={wave1Icon}
            >
              <Button
                variant="outlined"
                onClick={handleOpenDialog}
                sx={{ width: 'fit-content' }}
              >
                Add New Stake
              </Button>
            </BalanceBlock>

            <BalanceBlock
              aprox
              asset="USD"
              label="Total Earned Rewards Available"
              state={totalRewards.state}
              data={totalRewards.data}
              imgSrc={wave2Icon}
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
              data={votingPower.data}
              state={votingPower.state}
              imgSrc={wave3Icon}
            >
              <Button
                sx={{ width: 'fit-content' }}
                variant="outlined"
                component={Link}
                to={Urls.Bitocracy}
              >
                View Governance
              </Button>
            </BalanceBlock>
          </CenteredBox>

          <StakesListContainer />

          <VestsListContainer />

          <StakingHistoryContainer />

          {showAddStakeDialog && (
            <AddNewStakeContainer
              open={showAddStakeDialog}
              onClose={handleCloseDialog}
            />
          )}
        </Box>
      </PageAligner>
    </Box>
  );
};

const RewardBlock = ({ amount, asset, usdAmount }: RewardBlockProps) => (
  <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
    <Typography variant="caption">
      {asset} {formatWeiAmount(amount, 6)} ≈ USD {usdAmount}
    </Typography>
    <Button size="small" variant="text" sx={{ ml: 1 }}>
      <Typography variant="body2">withdraw</Typography>
    </Button>
  </Box>
);

const MaintenanceModeOverlay = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
    }}
  >
    <img
      src={maintenanceModeIcon}
      alt="Staking is currently under maintenance"
      width={600}
    />
  </Box>
);
