import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="panel">Cart is empty.</div>
      </div>
    );
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/orders', {
        shippingAddress,
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="panel">
        <h1 className="font-display text-3xl text-leaf-900">Checkout</h1>
        <p className="mt-1 text-soil-700">Payment method: Cash on Delivery (COD)</p>
        <p className="mt-4 font-semibold">Order total: ₹{total}</p>
        <form className="mt-6 space-y-4" onSubmit={placeOrder}>
          <div>
            <label className="label">Shipping address</label>
            <textarea
              className="input min-h-24"
              required
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>
            {busy ? 'Placing…' : 'Place COD order'}
          </button>
        </form>
      </div>
    </div>
  );
}
