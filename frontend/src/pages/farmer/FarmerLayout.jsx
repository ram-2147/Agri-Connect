import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function FarmerLayout() {
  const { user } = useAuth();
  const approved = user?.farmerProfile?.approved;

  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold ${
      isActive ? 'bg-leaf-800 text-white' : 'text-soil-800 hover:bg-leaf-100'
    }`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl text-leaf-900">Farmer Hub</h1>
          <p className="text-soil-700">
            {user?.farmerProfile?.farmName || 'Your farm'} ·{' '}
            {approved ? (
              <span className="font-semibold text-leaf-700">Approved</span>
            ) : (
              <span className="font-semibold text-amber-field">Pending approval</span>
            )}
          </p>
        </div>
        <Link to="/shop" className="text-sm font-semibold text-leaf-700">
          View marketplace →
        </Link>
      </div>

      {!approved && (
        <div className="mb-6 rounded-xl border border-amber-field/30 bg-wheat-200/50 p-4 text-sm text-soil-800">
          Your farmer account is waiting for admin approval. You can update your profile now;
          product listings and farm records unlock after approval.
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        <NavLink to="/farmer" end className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/farmer/products" className={linkClass}>
          Products
        </NavLink>
        <NavLink to="/farmer/orders" className={linkClass}>
          Orders
        </NavLink>
        <NavLink to="/farmer/records" className={linkClass}>
          Farm records
        </NavLink>
        <NavLink to="/farmer/profile" className={linkClass}>
          Profile
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
}
