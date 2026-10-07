import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="panel text-center">
          <h1 className="font-display text-3xl text-leaf-900">Your cart is empty</h1>
          <Link to="/shop" className="btn-primary mt-6 inline-flex">
            Browse shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-display text-4xl text-leaf-900">Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="panel flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-xl">{item.name}</h3>
              <p className="text-sm text-soil-700">
                ₹{item.price} / {item.unit}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                className="input w-20"
                type="number"
                min={1}
                max={item.stock}
                value={item.qty}
                onChange={(e) => updateQty(item.productId, Number(e.target.value))}
              />
              <p className="w-20 font-semibold">₹{item.price * item.qty}</p>
              <button
                type="button"
                className="text-sm font-semibold text-red-700"
                onClick={() => removeItem(item.productId)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between panel">
        <p className="text-lg font-bold">Total: ₹{total}</p>
        <button type="button" className="btn-primary" onClick={() => navigate('/checkout')}>
          Checkout (COD)
        </button>
      </div>
    </div>
  );
}
