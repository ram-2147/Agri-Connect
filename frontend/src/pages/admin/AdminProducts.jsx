import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const { data } = await api.get('/admin/products');
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id) => {
    await api.put(`/admin/products/${id}/toggle`);
    load();
  };

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div key={p._id} className="panel flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-xl">{p.name}</h3>
            <p className="text-sm text-soil-700">
              ₹{p.price}/{p.unit} · {p.category} · Farmer: {p.farmerId?.name || '—'}
            </p>
          </div>
          <button type="button" className="btn-secondary text-sm" onClick={() => toggle(p._id)}>
            {p.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ))}
    </div>
  );
}
