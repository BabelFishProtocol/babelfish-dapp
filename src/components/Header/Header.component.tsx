import Box from '@mui/material/Box';
import { Logo } from '../Logo/Logo.component';
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
    <Logo />
    <WalletConnector />
  </Box>
);
