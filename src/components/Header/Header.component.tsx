import Box from '@mui/material/Box';
import { Logo } from '../Logo/Logo.component';
import { Navigation } from '../Navigation/Navigation.component';
import { TopInfoContainer } from '../TestnetInfo/TopInfo.container';
import { WalletConnector } from '../Wallet/WalletConnector.component';

export const Header = () => (
  <Box component="header">
    <TopInfoContainer />
    <Box
      sx={{
        width: '90%',
        maxWidth: '1400px',
        margin: ({ spacing }) => spacing(5, 'auto'),
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Logo />
      <Navigation />
      <WalletConnector />
    </Box>
  </Box>
);
