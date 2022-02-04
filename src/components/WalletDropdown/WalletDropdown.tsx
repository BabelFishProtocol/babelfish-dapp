import { Box, Typography } from '@mui/material';
import metamaskIcon from '../../assets/icons/metamask-icon.webp';
import { BorderGradient } from '../BorderGradient/BorderGradient.component';
import { WalletOptionProps } from './WalletDropdown.types';

export const WalletDropdown = () => (
  <Box sx={{ mt: 2.5, display: 'inline-block' }}>
    <BorderGradient borderGradient="linear-gradient(35deg, #232224, #ffc146 63%, #ffc043)">
      <Box
        sx={{
          p: 2.5,
          borderRadius: '8px',
          backgroundImage: ({ palette }) => palette.boxGradient,
          display: 'inline-block',
          backdropFilter: 'blur(11px)',
        }}
      >
        {wallets.map((wallet) => (
          <WalletOption name={wallet.name} icon={wallet.icon} />
        ))}
      </Box>
    </BorderGradient>
  </Box>
);

const WalletOption = ({ name, icon }: WalletOptionProps) => (
  <Box
    sx={{
      width: 350,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 3,
      px: 2.5,
      py: 1.5,
      borderRadius: '6px',
      border: 'solid 2px rgba(0, 0, 0, 0.2)',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      transition: ({ transitions }) => transitions.create('background-color'),
      ':last-child': {
        marginBottom: 0,
      },
      ':hover': {
        cursor: 'pointer',
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
      },
    }}
  >
    <Typography variant="h5">{name}</Typography>
    <Box
      sx={({ palette }) => ({
        height: 40,
        width: 40,
        display: 'grid',
        placeItems: 'center',
        backgroundColor: palette.common.white,
        borderRadius: '50%',
      })}
    >
      <img alt={`${name} wallet icon`} src={icon} />
    </Box>
  </Box>
);
const wallets = [
  {
    name: 'Metamask',
    icon: metamaskIcon,
  },
  {
    name: 'Metamask',
    icon: metamaskIcon,
  },
  {
    name: 'Metamask',
    icon: metamaskIcon,
  },
  {
    name: 'Metamask',
    icon: metamaskIcon,
  },
];
