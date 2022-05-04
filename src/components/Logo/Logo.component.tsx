import { Link } from 'react-router-dom';
import styled from '@mui/material/styles/styled';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Urls } from '../../constants';
import logo from '../../assets/icons/logo.svg';

const StyledLogo = styled('img')(({ theme }) => ({
  width: 40,
  height: 40,
  padding: 2,
  borderRadius: '50%',
  border: `1px solid ${theme.palette.primary.main}`,
}));

export const Logo = () => (
  <Box
    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
    component={Link}
    to={Urls.Dashboard}
  >
    <StyledLogo src={logo} alt="logo" />

    <Typography variant="h1" color="textPrimary" sx={{ marginLeft: 2 }}>
      BABELFISH
    </Typography>
  </Box>
);
