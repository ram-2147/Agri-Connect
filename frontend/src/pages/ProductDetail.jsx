import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError('Product not found'));
  }, [id]);

  if (error) return <p className="mx-auto max-w-6xl px-4 py-10 text-red-700">{error}</p>;
  if (!product) return <p className="mx-auto max-w-6xl px-4 py-10">Loading…</p>;

  const farm = product.farmerId?.farmerProfile?.farmName || product.farmerId?.name;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl bg-leaf-100">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full min-h-[320px] w-full object-cover" />
        ) : (
          <div className="flex min-h-[320px] items-center justify-center">No image</div>
        )}
      </div>
      <div className="panel">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-field">{product.category}</p>
        <h1 className="mt-2 font-display text-4xl text-leaf-900">{product.name}</h1>
        <p className="mt-3 text-soil-700">{product.description}</p>
        <p className="mt-4 text-2xl font-bold text-leaf-800">
          ₹{product.price} <span className="text-base font-normal">/ {product.unit}</span>
        </p>
        <p className="mt-2 text-sm text-soil-700">Stock: {product.stock} {product.unit}</p>
        <p className="mt-1 text-sm text-soil-700">Sold by: {farm}</p>

        {user?.role === 'buyer' && (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <input
              className="input w-24"
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
            <button
              type="button"
              className="btn-primary"
              disabled={product.stock < 1}
              onClick={() => {
                addItem(product, qty);
                navigate('/cart');
              }}
            >
              Add to cart
            </button>
          </div>
        )}
        {!user && (
          <button type="button" className="btn-primary mt-6" onClick={() => navigate('/login')}>
            Login to buy
          </button>
        )}
      </div>
    </div>
  );
}
