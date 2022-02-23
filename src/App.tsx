import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import errorIcon from './assets/icons/error.svg';
import loadingIcon from './assets/icons/loading.svg';
import successIcon from './assets/icons/success.svg';
import { AppDialog } from './components/AppDialog/AppDialog.component';
import { DateSelector } from './components/DateSelector/DateSelector.component';
import { Header } from './components/Header/Header.component';
import { MintingInfo } from './components/MintingInfo/MintingInfo.component';
import { MintingProcessInfo } from './components/MintingInfo/MintingInfo.types';
import { Urls } from './constants';
import { AgregatorContainer } from './pages/Agregator/Agregator.container';
import { DashboardContainer } from './pages/Dashboard/Dashboard.container';
import { ProposalDetailsContainer } from './pages/ProposalDetails/ProposalDetails.container';
import { ProposalsListContainer } from './pages/ProposalsList/ProposalsList.container';
import { StakingContainer } from './pages/Staking/Staking.container';

function App() {
  const [selectedDate, setSelectedDate] = useState<number>();
  const [openDialogType, setOpenDialogType] = useState<string | null>(null);

  const dialogVals: MintingProcessInfo[] = [
    { label: 'Date/Time', value: '21/01/21-14:34 GMT' },
    { label: 'Amount Sent', value: '50.00 USDT' },
    { label: 'Amount Minted', value: '50.00 XUSD' },
    { label: 'GAS Fees', value: 'XXX ETH' },
    { label: 'ETH Deposit ID', value: '0X413.89054', isProminant: true },
    {
      label: 'RSK Relay Hash',
      value: '0X413.89054',
      isProminant: true,
    },
  ];

  return (
    <div className="App">
      <Header />

      {/* Error Dialog */}
      <AppDialog
        isOpenDialog={openDialogType === 'error'}
        icon={errorIcon}
        title="Minting Error"
        description="We encountered an error in the minting process. Please try again"
        onClose={() => {
          setOpenDialogType(null);
        }}
      >
        <Button variant="outlined">Try Again</Button>
      </AppDialog>

      {/* Success Dialog */}
      <AppDialog
        isOpenDialog={openDialogType === 'success'}
        icon={successIcon}
        title="Minting Complete"
        onClose={() => {
          setOpenDialogType(null);
        }}
      >
        <Box sx={{ mt: 3 }}>
          <MintingInfo data={dialogVals} />
        </Box>
        <Button sx={{ my: 5 }} size="small">
          View on Explorer
        </Button>
      </AppDialog>

      {/* Pending Dialog */}
      <AppDialog
        isOpenDialog={openDialogType === 'pending'}
        icon={loadingIcon}
        title="Minting In Progress"
        description="Minting can take a couple minutes, please make sure to approve the transaction in your wallet when prompted, and wait for minting to be complete"
      >
        <MintingInfo data={dialogVals} />
      </AppDialog>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Button>About</Button>
              <br />
              <br />
              <Button
                variant="outlined"
                onClick={() => {
                  setOpenDialogType('pending');
                }}
              >
                Outlined
              </Button>
              <br />
              <br />
              <Button
                variant="outlined"
                color="success"
                onClick={() => {
                  setOpenDialogType('success');
                }}
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
                onClick={() => {
                  setOpenDialogType('error');
                }}
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
        <Route path={Urls.Agregator} element={<AgregatorContainer />} />
      </Routes>
    </div>
  );
}

export default App;
