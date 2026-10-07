import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/all').then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="space-y-3">
      {orders.length === 0 ? (
        <div className="panel">No orders yet.</div>
      ) : (
        orders.map((o) => (
          <div key={o._id} className="panel">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-semibold">
                #{o._id.slice(-6).toUpperCase()} · {o.buyerId?.name}
              </p>
              <span className="text-xs font-bold uppercase text-leaf-800">{o.status}</span>
            </div>
            <p className="mt-1 text-sm text-soil-700">
              ₹{o.totalAmount} · COD · {new Date(o.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
