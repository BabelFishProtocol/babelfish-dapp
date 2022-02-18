import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { utils } from 'ethers';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import errorIcon from './assets/icons/error.svg';
import loadingIcon from './assets/icons/loading.svg';
import successIcon from './assets/icons/success.svg';
import { AppDialog } from './components/AppDialog/AppDialog.component';
import { DateSelector } from './components/DateSelector/DateSelector.component';
import { Header } from './components/Header/Header.component';
import { InputWithButtonPillGroup } from './components/InputPillGroup/InputWithButtonPillGroup.component';
import { Urls } from './constants';
import { DashboardContainer } from './pages/Dashboard/Dashboard.container';
import { ProposalDetailsContainer } from './pages/ProposalDetails/ProposalDetails.container';
import { ProposalsListContainer } from './pages/ProposalsList/ProposalsList.container';
import { StakingContainer } from './pages/Staking/Staking.container';

type MintingProcessInfo = {
  label: string;
  value: string;
  isProminant?: boolean;
};

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
          {dialogVals.map((dv) => (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 1,
                my: '5px',
              }}
            >
              <Typography
                sx={{
                  fontWeight: 'bold',
                  display: 'inline-grid',
                  textAlign: 'right',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                }}
                variant="body2"
              >
                {dv.label} :
              </Typography>
              <Typography
                sx={({ palette }) => ({
                  display: 'inline-grid',
                  textAlign: 'left',
                  color: dv.isProminant ? palette.primary.main : 'white',
                })}
                variant="body2"
              >
                {dv.value}
              </Typography>
            </Box>
          ))}
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
        {dialogVals.map((dv) => (
          <Box
            onClick={() => {
              setOpenDialogType('success');
            }}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1,
              my: '5px',
            }}
          >
            <Typography
              sx={{
                fontWeight: 'bold',
                display: 'inline-grid',
                textAlign: 'right',
                textTransform: 'uppercase',
                fontSize: '12px',
              }}
              variant="body2"
            >
              {dv.label} :
            </Typography>
            <Typography
              sx={({ palette }) => ({
                display: 'inline-grid',
                textAlign: 'left',
                color: dv.isProminant ? palette.primary.main : 'white',
              })}
              variant="body2"
            >
              {dv.value}
            </Typography>
          </Box>
        ))}
      </AppDialog>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div>Main</div>
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
