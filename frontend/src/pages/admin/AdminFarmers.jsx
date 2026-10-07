import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState([]);

  const load = async () => {
    const { data } = await api.get('/admin/users', { params: { role: 'farmer' } });
    setFarmers(data);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await api.put(`/admin/farmers/${id}/approve`);
    load();
  };

  return (
    <div className="space-y-3">
      {farmers.map((f) => (
        <div key={f._id} className="panel flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-xl">{f.name}</h3>
            <p className="text-sm text-soil-700">
              {f.email} · {f.farmerProfile?.farmName} · {f.farmerProfile?.location}
            </p>
            <p className="text-xs text-soil-700">
              Crops: {(f.farmerProfile?.crops || []).join(', ') || '—'}
            </p>
          </div>
          {f.farmerProfile?.approved ? (
            <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-bold text-leaf-800">
              Approved
            </span>
          ) : (
            <button type="button" className="btn-primary text-sm" onClick={() => approve(f._id)}>
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
