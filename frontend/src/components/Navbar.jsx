import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${isActive ? 'text-leaf-700' : 'text-soil-800 hover:text-leaf-700'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-leaf-800/10 bg-wheat-100/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight text-leaf-900">
          Agri<span className="text-amber-field">Connect</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <NavLink to="/shop" className={linkClass}>
            Shop
          </NavLink>
          {user?.role === 'buyer' && (
            <>
              <NavLink to="/cart" className={linkClass}>
                Cart {count > 0 && <span className="text-amber-field">({count})</span>}
              </NavLink>
              <NavLink to="/orders" className={linkClass}>
                My Orders
              </NavLink>
            </>
          )}
          {user?.role === 'farmer' && (
            <NavLink to="/farmer" className={linkClass}>
              Farmer Hub
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login" className="btn-secondary px-3 py-2 text-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary px-3 py-2 text-sm">
                Join
              </Link>
            </>
          ) : (
            <>
              <span className="hidden text-sm text-soil-700 sm:inline">
                {user.name}
              </span>
              <button
                type="button"
                className="btn-secondary px-3 py-2 text-sm"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
