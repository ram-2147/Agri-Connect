import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const NEXT = {
  pending: 'confirmed',
  confirmed: 'shipped',
  shipped: 'delivered',
};

export default function FarmerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const { data } = await api.get('/orders/farmer');
    setOrders(data);
  };

  useEffect(() => {
    if (user?.farmerProfile?.approved) load().catch(() => {});
  }, [user]);

  if (!user?.farmerProfile?.approved) {
    return <div className="panel">Orders unlock after approval.</div>;
  }

  const advance = async (id, status) => {
    const next = NEXT[status];
    if (!next) return;
    await api.put(`/orders/${id}/status`, { status: next });
    load();
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="panel">No orders for your products yet.</div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="panel">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold">#{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-sm text-soil-700">
                  Buyer: {order.buyerId?.name} · {order.buyerId?.phone}
                </p>
              </div>
              <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-bold uppercase text-leaf-800">
                {order.status}
              </span>
            </div>
            <ul className="mt-3 text-sm">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.qty} — ₹{item.price * item.qty}
                </li>
              ))}
            </ul>
            <p className="mt-2 font-bold">Your subtotal: ₹{order.farmerSubtotal}</p>
            {NEXT[order.status] && (
              <button
                type="button"
                className="btn-primary mt-3 text-sm"
                onClick={() => advance(order._id, order.status)}
              >
                Mark as {NEXT[order.status]}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
