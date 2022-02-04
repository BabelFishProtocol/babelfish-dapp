import { Button } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header.component';
import { WalletDropdown } from './components/WalletDropdown/WalletDropdown';
import { Urls } from './constants';
import { ProposalsListContainer } from './pages/ProposalsList/ProposalsList.container';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                Main
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
                <WalletDropdown />
              </>
            }
          />
          <Route path="about" element={<div>About</div>} />
          <Route
            path={Urls.ProposalsList}
            element={<ProposalsListContainer />}
          />
        </Routes>
      </header>
    </div>
  );
}

export default App;
