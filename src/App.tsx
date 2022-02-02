import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/" element={<div>Main</div>} />
          <Route path="about" element={<div>About</div>} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
