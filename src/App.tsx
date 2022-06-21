import { Route, Routes, Navigate } from 'react-router-dom';

import { BottomBanner } from './components/BottomBanner/BottomBanner.component';
import { Header } from './components/Header/Header.component';
import { Urls } from './constants';
import { AggregatorContainer } from './pages/Aggregator/Aggregator.container';
import { ClaimContainer } from './pages/Claim/Claim.container';
import { DashboardContainer } from './pages/Dashboard/Dashboard.container';
import { ImprobabilityContainer } from './pages/Improbability/Improbability.container';
import { ProposalDetailsContainer } from './pages/ProposalDetails/ProposalDetails.container';
import { ProposalsListContainer } from './pages/ProposalsList/ProposalsList.container';
import { StakingContainer } from './pages/Staking/Staking.container';

export const App = () => (
  <div className="App">
    <Header />

    <Routes>
      <Route path={Urls.Proposals} element={<ProposalsListContainer />} />
      <Route path={Urls.Staking} element={<StakingContainer />} />
      <Route path={Urls.Dashboard} element={<DashboardContainer />} />
      <Route
        path={`${Urls.Proposals}/:governorType/:id`}
        element={<ProposalDetailsContainer />}
      />
      <Route path={Urls.Aggregator} element={<AggregatorContainer />} />
      <Route path={Urls.Improbability} element={<ImprobabilityContainer />} />
      <Route path={Urls.Claim} element={<ClaimContainer />} />
      <Route path="*" element={<Navigate to={Urls.Dashboard} />} />
    </Routes>

    <BottomBanner />
  </div>
);
