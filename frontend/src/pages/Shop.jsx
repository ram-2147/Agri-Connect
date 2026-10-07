import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['', 'vegetables', 'fruits', 'grains', 'dairy', 'other'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products', {
          params: { search: search || undefined, category: category || undefined },
        });
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [search, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl text-leaf-900">Marketplace</h1>
          <p className="mt-1 text-soil-700">Fresh listings from approved farmers</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="input sm:w-56"
            placeholder="Search crops…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input sm:w-44" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c || 'all'} value={c}>
                {c ? c.charAt(0).toUpperCase() + c.slice(1) : 'All categories'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-leaf-800">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="panel text-soil-700">No products found. Try another search.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onAdd={user?.role === 'buyer' ? (prod) => addItem(prod, 1) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
