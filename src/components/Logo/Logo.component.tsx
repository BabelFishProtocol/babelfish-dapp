import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Urls } from '../../constants';

export const Logo = () => (
  <Box
    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
    component={Link}
    to={Urls.Dashboard}
  >
    {/* TODO: CONTEMPORARY LOGO ICON (YELLOW CIRCLE) */}
    <Box
      sx={(theme) => ({
        height: 40,
        width: 40,
        backgroundColor: theme.palette.primary.main,
        borderRadius: '50%',
        display: 'inline-block',
      })}
    />
    <Typography variant="h1" color="textPrimary" sx={{ marginLeft: '14px' }}>
      BABELFISH.MONEY
    </Typography>
  </Box>
);
