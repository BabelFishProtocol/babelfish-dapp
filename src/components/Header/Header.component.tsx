import Box from '@mui/material/Box';
import { Logo } from '../Logo/Logo.component';
import { Navigation } from '../Navigation/Navigation.component';
import { TestnetInfo } from '../TestnetInfo/TestnetInfo.component';
import { WalletConnector } from '../Wallet/WalletConnector.component';

export const Header = () => (
  <Box
    component="header"
    sx={{
      margin: ({ spacing }) => spacing(7, 8, 7, 12),
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <TestnetInfo />
    <Logo />
    <Navigation />
    <WalletConnector />
    <span style={{ fontSize: '0px' }} >version: incentive-curve</span>
  </Box>
);
