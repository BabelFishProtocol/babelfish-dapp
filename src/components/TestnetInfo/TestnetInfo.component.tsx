import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { isOnTestnetSelector } from '../../store/app/app.selectors';

export const TestnetInfo = () => {
  const isOnTestnet = useSelector(isOnTestnetSelector);
  if (!isOnTestnet) return null;

  return (
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
        backgroundColor: ({ palette }) => palette.background.paper,
        color: 'black',
      }}
    >
      <Typography variant="body2">
        Note: You are currently connected to the testnet. All coins have no
        value here.
      </Typography>
    </Box>
  );
};
