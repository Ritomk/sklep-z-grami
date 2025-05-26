import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from "react";
import HomePage from './pages/HomePage';
import GamesCatalog from './pages/GamesCatalog';
import Login from './pages/Login';
import Register from './pages/Register';
import LibraryPage from './pages/LibraryPage';
import LoggedOut from "./pages/LoggedOutPage";
import Sidebar from './components/SideBar';
import { AuthProvider, useAuth } from './contexts/AuthContext';


function PrivateRoute({ children }: { children: ReactNode}) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const hideSidebar = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="flex h-screen">
      {!hideSidebar && <Sidebar />}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/store" element={<GamesCatalog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<LoggedOut />} />
            {/* Protected route */}
            <Route 
              path="/library" 
              element={
                <PrivateRoute>
                  <LibraryPage/>
                </PrivateRoute>
              } 
            />
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
