import styled from '@mui/material/styles/styled';
import { Link as MuiLink } from '@mui/material';
import { NavLink as NavLinkBase } from 'react-router-dom';
import { LinkProps } from './NavLink.types';

const Link = (props: LinkProps) => (
  <MuiLink component={NavLinkBase} {...props} />
);

export const NavLink = styled(Link)(({ theme }) => ({
  color: 'white',
  textDecoration: 'none',
  '&.active': {
    color: theme.palette.primary.main,
  },
  '&::after': {
    transition: 'width 0.1s',
    content: "''",
    display: 'block',
    width: '0',
    margin: '0 auto',
    position: 'relative',
    top: '10px',
    height: '2px',
    backgroundColor: theme.palette.primary.main,
  },
  '&:hover::after, &.active::after': {
    width: '50%',
  },
}));
