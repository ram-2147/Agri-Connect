import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id) => {
    await api.put(`/admin/users/${id}/toggle`);
    load();
  };

  return (
    <div className="overflow-x-auto panel">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-leaf-800/10 text-soil-700">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-leaf-800/5">
              <td className="py-3 font-semibold">{u.name}</td>
              <td>{u.email}</td>
              <td className="capitalize">{u.role}</td>
              <td>{u.isActive ? 'Active' : 'Inactive'}</td>
              <td>
                {u.role !== 'admin' && (
                  <button
                    type="button"
                    className="font-semibold text-leaf-700"
                    onClick={() => toggle(u._id)}
                  >
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
