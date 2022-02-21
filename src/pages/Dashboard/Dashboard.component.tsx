import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Urls } from '../../constants';
import { PageAligner } from '../../components/PageView/PageView.component';
import { BalanceBlock } from '../../components/BalanceBlock/BalanceBlock.component';

import { TransactionsTableContainer } from './TransactionsTable/TransactionsTable.container';
import { DashboardComponentProps } from './Dashboard.types';

export const DashboardComponent = ({
  totalUSD,
  fishBalance,
  fishVesting,
}: DashboardComponentProps) => (
  <PageAligner>
    <Box
      sx={{
        gap: 2,
        width: '90%',
        display: 'flex',
        maxWidth: 1400,
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Container
        sx={{
          pt: 4,
          gap: 2,
          display: 'flex',
          flexDirection: 'column',
          width: { sm: '100%', md: 'fit-content' },
        }}
      >
        <Button sx={{ width: 'max-content', pl: 3, pr: 3 }}>
          Deposit/Withdraw XUSD
        </Button>
        <Button variant="outlined" component={Link} to={Urls.Staking}>
          Stake Your Fish
        </Button>
        <Button variant="outlined" component={Link} to={Urls.Proposals}>
          Govern With Fish
        </Button>
      </Container>

      <Box
        sx={{
          gap: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <BalanceBlock
            sx={{ alignItems: 'center' }}
            label="Fish Balance"
            {...fishBalance}
          />
          <BalanceBlock
            sx={{ alignItems: 'center' }}
            label="Fish Vesting"
            {...fishVesting}
          />
        </Box>

        <Container
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: ({ palette }) => `1px solid ${palette.primary.main}`,
          }}
        >
          <Typography sx={{ fontWeight: 'bold' }}>
            Total #USD Balance:
          </Typography>
          <Typography variant="h6">{totalUSD}</Typography>
        </Container>

        <TransactionsTableContainer />
      </Box>
    </Box>
  </PageAligner>
);
