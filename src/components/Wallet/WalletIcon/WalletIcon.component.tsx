import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { WalletIconProps } from './WalletIcon.types';

const StyledIcon = styled('img')(() => ({
  maxWidth: 30,
  maxHeight: 30,
}));

export const WalletIcon = ({ icon, name, sx }: WalletIconProps) => (
  <Box
    sx={{
      width: 35,
      height: 35,
      display: 'grid',
      placeItems: 'center',
      borderRadius: '8px',
      ...sx,
    }}
  >
    <StyledIcon alt={`${name} wallet icon`} src={icon} />
  </Box>
);
