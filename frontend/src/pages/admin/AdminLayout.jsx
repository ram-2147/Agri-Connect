import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold ${
      isActive ? 'bg-leaf-800 text-white' : 'text-soil-800 hover:bg-leaf-100'
    }`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-2 font-display text-4xl text-leaf-900">Admin Panel</h1>
      <p className="mb-6 text-soil-700">Platform oversight for AgriConnect</p>
      <div className="mb-6 flex flex-wrap gap-2">
        <NavLink to="/admin" end className={linkClass}>
          Stats
        </NavLink>
        <NavLink to="/admin/farmers" className={linkClass}>
          Farmers
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          Users
        </NavLink>
        <NavLink to="/admin/products" className={linkClass}>
          Products
        </NavLink>
        <NavLink to="/admin/orders" className={linkClass}>
          Orders
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
