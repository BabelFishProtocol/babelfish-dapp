import { Button } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
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
                <div>Main</div>
                <Button>About</Button>
                <br />
                <br />
                <Button variant="outlined">Outlined</Button>
                <br />
                <br />
                <Button variant="outlined" color="error">
                  Error
                </Button>
                <br />
                <br />
                <Button variant="outlined" color="success">
                  Success
                </Button>
                <br />
                <br />
                <Button variant="text">Text</Button>
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
