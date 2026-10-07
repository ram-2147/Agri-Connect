import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-leaf-800/10 bg-white/70 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-leaf-800/10">
      <Link to={`/products/${product._id}`} className="block overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden bg-leaf-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-leaf-700">No image</div>
          )}
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-field">
          {product.category}
        </p>
        <Link to={`/products/${product._id}`}>
          <h3 className="font-display text-xl text-leaf-900">{product.name}</h3>
        </Link>
        <p className="line-clamp-2 text-sm text-soil-700">{product.description}</p>
        <div className="flex items-center justify-between pt-1">
          <p className="font-bold text-leaf-800">
            ₹{product.price}
            <span className="text-sm font-normal text-soil-700"> / {product.unit}</span>
          </p>
          {onAdd && (
            <button
              type="button"
              className="btn-primary px-3 py-2 text-sm"
              onClick={() => onAdd(product)}
              disabled={product.stock < 1}
            >
              {product.stock < 1 ? 'Sold out' : 'Add'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
