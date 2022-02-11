import { Button } from '@mui/material';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppDialog } from './components/AppDialog/AppDialog.component';
import { Header } from './components/Header/Header.component';
import { Urls } from './constants';
import { DashboardContainer } from './pages/Dashboard/Dashboard.container';
import { ProposalsListContainer } from './pages/ProposalsList/ProposalsList.container';

import errorIcon from './assets/icons/error.svg';

function App() {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  return (
    <div className="App">
      <Header />

      <AppDialog
        isOpenDialog={isOpenDialog} 
        icon={errorIcon} 
        title='Minting Error' 
        description='We encountered an error in the minting process. Please try again' 
        onClose={() => { setIsOpenDialog(false) }}
      >
        <Button variant='outlined'>Try Again</Button>
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
              <Button variant="outlined" onClick={() => {setIsOpenDialog(true)}}>Outlined</Button>
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
            </>
          }
        />
        <Route path="about" element={<div>About</div>} />
        <Route path={Urls.ProposalsList} element={<ProposalsListContainer />} />
        <Route path={Urls.Dashboard} element={<DashboardContainer />} />
      </Routes>
    </div>
  );
}

export default App;
