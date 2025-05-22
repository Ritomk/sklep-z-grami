import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GamesCatalog from './pages/GamesCatalog';
import Login from './pages/Login';
import Register from './pages/Register';
import NavBar from './components/NavBar';
import { isAuthenticated } from './lib/auth';


function PrivateRoute({ children }: { children: JSX.Element }) {
  return isAuthenticated() 
    ? children 
    : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      {/* Pasek nawigacyjny widoczny na każdej stronie */}
      <NavBar />

      <Routes>
        {/* Strony publiczne */}
        <Route path="/" element={<HomePage />} />
        <Route path="/store" element={<GamesCatalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Przykładowa prywatna ścieżka */}
        <Route 
          path="/my-library" 
          element={
            <PrivateRoute>
              {/* Komponent biblioteki użytkownika */}
              <div>Moja biblioteka</div>
            </PrivateRoute>
          } 
        />

        {/* Przekierowanie nieznanych ścieżki na stronę główną */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
