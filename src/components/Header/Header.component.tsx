import Box from '@mui/material/Box';
import { Logo } from '../Logo/Logo.component';
import { Navigation } from '../Navigation/Navigation.component';
import { TestnetInfo } from '../TestnetInfo/TestnetInfo.component';
import { WalletConnector } from '../Wallet/WalletConnector.component';
import { useWalletConnect } from '../../hooks/useWalletConnect';
import { Button } from '../Button/Button.component';

export const Header = () => {
  const { connectWallet } = useWalletConnect();

  return (
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
      <Button onClick={connectWallet}>NEW WALLET CONNECT</Button>
    </Box>
  );
};
