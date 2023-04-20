import { Route, Routes, Navigate } from 'react-router-dom';

import { ErrorAlert } from './components/ErrorAlert/ErrorAlert.component';
import { Header } from './components/Header/Header.component';
import { Urls } from './constants';
import { AggregatorContainer } from './pages/Aggregator/Aggregator.container';
import { ImprobabilityContainer } from './pages/Improbability/Improbability.container';
import { ProposalDetailsContainer } from './pages/ProposalDetails/ProposalDetails.container';
import { ProposalsListContainer } from './pages/ProposalsList/ProposalsList.container';
import { StakingContainer } from './pages/Staking/Staking.container';
import { Footer } from './components/Footer/Footer.component';

export const App = () => (
  <div
    className="App"
    style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
  >
    <Header />
    <Routes>
      <Route path={Urls.Bitocracy} element={<ProposalsListContainer />} />
      <Route path={Urls.Staking} element={<StakingContainer />} />
      <Route
        path={`${Urls.Bitocracy}/:governorType/:id`}
        element={<ProposalDetailsContainer />}
      />
      <Route path={Urls.Convert} element={<AggregatorContainer />} />
      <Route path={Urls.Improbability} element={<ImprobabilityContainer />} />
      <Route path="*" element={<Navigate to={Urls.Convert} />} />
    </Routes>

    <ErrorAlert />
    <Footer />
  </div>
);
