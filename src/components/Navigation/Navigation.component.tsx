import styled from '@mui/material/styles/styled';
import { Urls } from '../../constants';
import { NavLink } from './NavLink.component';

const StyledNav = styled('nav')`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 2rem;
`;

export const Navigation = () => (
  <StyledNav>
    <NavLink to={Urls.Aggregator}>DEPOSIT/WITHDRAW XUSD</NavLink>
    <NavLink to={Urls.Staking}>STAKE YOUR FISH</NavLink>
    <NavLink to={Urls.Proposals}>DAO/GOVERN WITH FISH</NavLink>
    <NavLink to={Urls.Claim}>CLAIM</NavLink>
  </StyledNav>
);
