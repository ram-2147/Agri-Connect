import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user?.farmerProfile?.approved) return;
    api
      .get('/farmers/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, [user]);

  if (!user?.farmerProfile?.approved) {
    return <div className="panel">Dashboard unlocks after admin approval.</div>;
  }

  if (!stats) return <p>Loading dashboard…</p>;

  const cards = [
    { label: 'Active products', value: stats.products },
    { label: 'Orders', value: stats.totalOrders },
    { label: 'Pending orders', value: stats.pendingOrders },
    { label: 'Farm records', value: stats.records },
    { label: 'Revenue (₹)', value: stats.revenue },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="panel">
          <p className="text-sm text-soil-700">{c.label}</p>
          <p className="mt-2 font-display text-3xl text-leaf-900">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
