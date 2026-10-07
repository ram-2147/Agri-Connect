import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const empty = {
  name: '',
  category: 'vegetables',
  description: '',
  price: '',
  unit: 'kg',
  stock: '',
  imageUrl: '',
};

export default function FarmerProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/products/mine/list');
    setProducts(data);
  };

  useEffect(() => {
    if (user?.farmerProfile?.approved) load().catch(() => {});
  }, [user]);

  if (!user?.farmerProfile?.approved) {
    return <div className="panel">Product management unlocks after approval.</div>;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      if (editing) {
        await api.put(`/products/${editing}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setForm(empty);
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    }
  };

  const edit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      unit: p.unit,
      stock: p.stock,
      imageUrl: p.imageUrl || '',
    });
  };

  const remove = async (id) => {
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form className="panel space-y-3" onSubmit={submit}>
        <h2 className="font-display text-2xl">{editing ? 'Edit product' : 'Add product'}</h2>
        <input className="input" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {['vegetables', 'fruits', 'grains', 'dairy', 'other'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid grid-cols-3 gap-2">
          <input className="input" type="number" placeholder="Price" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <select className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
            {['kg', 'quintal', 'dozen', 'litre', 'piece'].map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <input className="input" type="number" placeholder="Stock" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
        <input className="input" placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div className="flex gap-2">
          <button className="btn-primary" type="submit">{editing ? 'Update' : 'Create'}</button>
          {editing && (
            <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm(empty); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p._id} className="panel flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl">{p.name}</h3>
              <p className="text-sm text-soil-700">
                ₹{p.price}/{p.unit} · Stock {p.stock} · {p.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-sm font-semibold text-leaf-700" onClick={() => edit(p)}>Edit</button>
              <button type="button" className="text-sm font-semibold text-red-700" onClick={() => remove(p._id)}>Deactivate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
