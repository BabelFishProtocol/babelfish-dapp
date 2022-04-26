import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { isOnTestnetSelector } from '../../store/app/app.selectors';

export const TestnetInfo = () => {
  const isOnTestnet = useSelector(isOnTestnetSelector);
  return isOnTestnet ? (
    <Box
      sx={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        width: '100vw',
        height: '40px',
        backgroundColor: '#798293',
        color: 'black',
      }}
    >
      <Typography variant="body2">you are on testnet</Typography>
    </Box>
  ) : null;
};
