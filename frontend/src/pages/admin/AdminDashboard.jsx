import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading…</p>;

  const cards = [
    { label: 'Buyers', value: stats.buyers },
    { label: 'Farmers', value: stats.farmers },
    { label: 'Pending farmers', value: stats.pendingFarmers },
    { label: 'Active products', value: stats.products },
    { label: 'Orders', value: stats.orders },
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
