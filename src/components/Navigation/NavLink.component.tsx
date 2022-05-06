import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import {
  NavLink as NavLinkBase,
  NavLinkProps as NavLinkBaseProps,
} from 'react-router-dom';

type NavLinkProps = NavLinkBaseProps & {
  theme?: Theme;
};

export const NavLink = styled(NavLinkBase)(({ theme }: NavLinkProps) => ({
  color: 'white',
  textDecoration: 'none',
  '&.active': {
    color: theme?.palette.primary.main,
  },
  '&:hover, &.active': {
    transform: 'translate(0, 1px)',
  },
  '&.active::after, &:hover::after': {
    content: "''",
    display: 'block',
    width: '50%',
    margin: '0 auto',
    position: 'relative',
    top: '10px',
    height: '2px',
    backgroundColor: theme?.palette.primary.main,
  },
}));
