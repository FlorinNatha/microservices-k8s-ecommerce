import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const imageUrl = product.image || product.images?.[0]?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=00F0FF&color=050505&size=400&font-size=0.33`;

  return (
    <Link to={`/product/${product._id}`} className="group">
      <article className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 shadow-2xl shadow-slate-950/20 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/95">
        <div className="relative overflow-hidden bg-slate-900/70">
          <img src={imageUrl} alt={product.name} className="h-72 w-full object-cover transition duration-700 group-hover:scale-105" />
          <span className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-4 py-2 text-xs uppercase tracking-[0.25em] text-cyan-200 shadow-lg shadow-slate-950/20">
            {product.category || 'Electronics'}
          </span>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Featured</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-100">{product.name}</h3>
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-slate-400">{product.description}</p>

          <div className="flex items-center justify-between gap-4 pt-4">
            <div>
              <p className="text-lg font-semibold text-slate-100">${product.price.toFixed(2)}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Fast shipping</p>
            </div>
            <button className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-300">
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;
