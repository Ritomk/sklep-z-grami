import { Link } from 'react-router-dom';
import { isAuthenticated, logout } from '../lib/auth';

export default function NavBar() {
  return (
    <nav className="p-4 flex justify-between bg-gray-100">
      <div>
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/store">Store</Link>
      </div>
      <div>
        {isAuthenticated() ? (
          <>
            <Link to="/my-library" className="mr-4">Library</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
