import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Urls } from '../../constants';
import { PageAligner } from '../../components/PageView/PageView.component';

import { TransactionsTableContainer } from './TransactionsTable/TransactionsTable.container';
import { BalanceBlockProps, DashboardComponentProps } from './Dashboard.types';


const BalanceBlock = ({ amount, label }: BalanceBlockProps) => (
  <Container sx={{ padding: 2 }}>
    <Typography variant="body2" align="center">
      {label}
    </Typography>
    <Typography variant="h2" align="center" mt={1}>
      {amount} FISH
    </Typography>
  </Container>
);

export const DashboardComponent = ({
  totalUSD,
  fishBalance,
  fishVesting,
}: DashboardComponentProps) => 
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
        <Button component={Link} to={Urls.ProposalsList}>
          Govern With Fish
        </Button>
        <Button variant="outlined"> Deposit/Withdraw XUSD</Button>
        <Button variant="outlined">Stake Your Fish</Button>
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
          <BalanceBlock label="Fish Balance" amount={fishBalance} />
          <BalanceBlock label="Fish Vesting" amount={fishVesting} />
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
          <Typography variant="body2">Total #USD Balance:</Typography>
          <Typography variant="h2">{totalUSD}</Typography>
        </Container>

        <TransactionsTableContainer />
      </Box>
    </Box>
  </PageAligner>
