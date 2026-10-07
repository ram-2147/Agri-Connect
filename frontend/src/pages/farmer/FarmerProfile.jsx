import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function FarmerProfile() {
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({
    farmName: '',
    location: '',
    crops: '',
    phone: '',
    address: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/farmers/profile').then((res) => {
      const u = res.data;
      setForm({
        farmName: u.farmerProfile?.farmName || '',
        location: u.farmerProfile?.location || '',
        crops: (u.farmerProfile?.crops || []).join(', '),
        phone: u.phone || '',
        address: u.address || '',
      });
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.put('/farmers/profile', {
      ...form,
      crops: form.crops
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
    });
    await refreshUser();
    setMessage('Profile updated');
  };

  return (
    <form className="panel mx-auto max-w-xl space-y-3" onSubmit={submit}>
      <h2 className="font-display text-2xl">Farm profile</h2>
      <input className="input" placeholder="Farm name" value={form.farmName} onChange={(e) => setForm({ ...form, farmName: e.target.value })} />
      <input className="input" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      <input className="input" placeholder="Crops (comma separated)" value={form.crops} onChange={(e) => setForm({ ...form, crops: e.target.value })} />
      <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input className="input" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      {message && <p className="text-sm text-leaf-700">{message}</p>}
      <button className="btn-primary" type="submit">Save profile</button>
    </form>
  );
}
