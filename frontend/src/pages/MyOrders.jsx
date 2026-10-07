import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/mine');
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    await api.put(`/orders/${id}/status`, { status: 'cancelled' });
    load();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 font-display text-4xl text-leaf-900">My Orders</h1>
      {loading ? (
        <p>Loading…</p>
      ) : orders.length === 0 ? (
        <div className="panel">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="panel">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-leaf-900">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
                <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-bold uppercase text-leaf-800">
                  {order.status}
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-soil-700">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.qty} — ₹{item.price * item.qty}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-bold">Total: ₹{order.totalAmount} · COD</p>
              <p className="text-sm text-soil-700">{order.shippingAddress}</p>
              {['pending', 'confirmed'].includes(order.status) && (
                <button
                  type="button"
                  className="mt-3 text-sm font-semibold text-red-700"
                  onClick={() => cancel(order._id)}
                >
                  Cancel order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
