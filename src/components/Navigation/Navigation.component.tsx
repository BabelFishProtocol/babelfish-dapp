import styled from '@mui/material/styles/styled';
import { UrlNames, Urls } from '../../constants';
import { NavLink } from './NavLink.component';

const StyledNav = styled('nav')`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 2rem;
`;

export const Navigation = () => (
  <StyledNav>
    <NavLink to={Urls.Convert}>{UrlNames.Convert}</NavLink>
    <NavLink to={Urls.Staking}>{UrlNames.Staking}</NavLink>
    <NavLink to={Urls.Bitocracy}>{UrlNames.Bitocracy}</NavLink>
    <NavLink to={Urls.Claim}>{UrlNames.Claim}</NavLink>
  </StyledNav>
);
