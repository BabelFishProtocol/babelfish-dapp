import styled from '@emotion/styled';
import { NavLink } from './NavLink.component';

const StyledNav = styled('nav')`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 2rem;
`;

export const Navigation = () => (
  <StyledNav>
    <NavLink to="/aggregator">DEPOSIT/WITHDRAW XUSD</NavLink>
    <NavLink to="/stake">STAKE YOUR FISH</NavLink>
    <NavLink to="/proposals">DAO/GOVERN WITH FISH</NavLink>
    <NavLink to="/claim">CLAIM</NavLink>
  </StyledNav>
);
