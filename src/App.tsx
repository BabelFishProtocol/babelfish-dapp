import { useState } from 'react';
import { Button, Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { utils } from 'ethers';
import { Header } from './components/Header/Header.component';
import { InputWithButtonPillGroup } from './components/InputPillGroup/InputWithButtonPillGroup.component';
import { Urls } from './constants';
import { DashboardContainer } from './pages/Dashboard/Dashboard.container';
import { ProposalDetailsContainer } from './pages/ProposalDetails/ProposalDetails.container';
import { ProposalsListContainer } from './pages/ProposalsList/ProposalsList.container';
import { StakingContainer } from './pages/Staking/Staking.container';
import { DateSelector } from './components/DateSelector/DateSelector.component';

function App() {
  const [selectedDate, setSelectedDate] = useState<number>();

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div>Main</div>
              <Button>About</Button>
              <br />
              <br />
              <Button variant="outlined">Outlined</Button>
              <br />
              <br />
              <Button
                variant="outlined"
                color="success"
                sx={({ palette }) => ({
                  boxShadow: `inset 0 0 0 2px ${palette.success.main}`,
                  backgroundColor: 'rgba(50, 240, 95, 0.1)',
                  ':hover': {
                    backgroundColor: `rgba(50, 240, 95, 0.2)`,
                  },
                })}
              >
                Success
              </Button>
              <br />
              <br />
              <Button
                variant="outlined"
                color="error"
                sx={({ palette }) => ({
                  boxShadow: `inset 0 0 0 2px ${palette.error.main}`,
                  backgroundColor: `rgba(239, 5, 18, 0.1)`,
                  ':hover': {
                    backgroundColor: `rgba(239, 5, 18, 0.2)`,
                  },
                })}
              >
                Error
              </Button>
              <br />
              <br />
              <Button variant="text">Text</Button>
              <br />
              <br />
              <Box sx={{ maxWidth: 350, m: 10 }}>
                <InputWithButtonPillGroup
                  symbol="XUSD"
                  totalAmount={utils.parseUnits('2.234')}
                />
              </Box>
              <DateSelector
                kickoffTs={1635379200}
                stakes={[]}
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </>
          }
        />
        <Route path="about" element={<div>About</div>} />
        <Route path={Urls.Proposals} element={<ProposalsListContainer />} />
        <Route path={Urls.Staking} element={<StakingContainer />} />
        <Route path={Urls.Dashboard} element={<DashboardContainer />} />
        <Route
          path={`${Urls.Proposals}/:id`}
          element={<ProposalDetailsContainer />}
        />
      </Routes>
    </div>
  );
}

export default App;
