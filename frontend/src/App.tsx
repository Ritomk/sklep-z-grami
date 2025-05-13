import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamesCatalog from './pages/GamesCatalog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<GamesCatalog />} />
      </Routes>
    </Router>
  );
}

export default App;
