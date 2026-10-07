import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const empty = {
  cropName: '',
  season: 'kharif',
  areaAcres: '',
  expectedYield: '',
  notes: '',
  status: 'planned',
};

export default function FarmRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await api.get('/farmers/records');
    setRecords(data);
  };

  useEffect(() => {
    if (user?.farmerProfile?.approved) load().catch(() => {});
  }, [user]);

  if (!user?.farmerProfile?.approved) {
    return <div className="panel">Farm records unlock after approval.</div>;
  }

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/farmers/records', { ...form, areaAcres: Number(form.areaAcres) });
    setForm(empty);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/farmers/records/${id}`);
    load();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form className="panel space-y-3" onSubmit={submit}>
        <h2 className="font-display text-2xl">Add farm record</h2>
        <input className="input" placeholder="Crop name" required value={form.cropName} onChange={(e) => setForm({ ...form, cropName: e.target.value })} />
        <select className="input" value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })}>
          {['kharif', 'rabi', 'zaid', 'year-round'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input className="input" type="number" step="0.1" placeholder="Area (acres)" required value={form.areaAcres} onChange={(e) => setForm({ ...form, areaAcres: e.target.value })} />
        <input className="input" placeholder="Expected yield" value={form.expectedYield} onChange={(e) => setForm({ ...form, expectedYield: e.target.value })} />
        <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          {['planned', 'growing', 'harvested'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <textarea className="input" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        <button className="btn-primary" type="submit">Save record</button>
      </form>

      <div className="space-y-3">
        {records.map((r) => (
          <div key={r._id} className="panel flex justify-between gap-3">
            <div>
              <h3 className="font-display text-xl">{r.cropName}</h3>
              <p className="text-sm text-soil-700">
                {r.season} · {r.areaAcres} acres · {r.status}
              </p>
              {r.expectedYield && <p className="text-sm">Yield: {r.expectedYield}</p>}
              {r.notes && <p className="text-sm text-soil-700">{r.notes}</p>}
            </div>
            <button type="button" className="text-sm font-semibold text-red-700" onClick={() => remove(r._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
