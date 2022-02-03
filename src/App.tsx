import { Button } from '@mui/material';
import { Routes, Route } from 'react-router-dom';

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
        </Routes>
      </header>
    </div>
  );
}

export default App;
