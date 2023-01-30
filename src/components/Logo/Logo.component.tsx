import { Link } from 'react-router-dom';
import styled from '@mui/material/styles/styled';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Urls } from '../../constants';
import logo from '../../assets/icons/logo.svg';

const StyledLogo = styled('img')(() => ({
  width: 40,
  height: 40,
  padding: 2,
}));

export const Logo = () => (
  <Box
    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
    component={Link}
    to={Urls.Convert}
  >
    <StyledLogo src={logo} alt="logo" />

    <Typography variant="h1" color="textPrimary" sx={{ marginLeft: 2 }}>
      BABELFISH
    </Typography>
  </Box>
);
