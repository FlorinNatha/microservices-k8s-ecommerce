import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  // Strictly check if image exists and is a valid URL, otherwise fallback to a premium default
  const isValidUrl = (url) => url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('data:image') || url.startsWith('/'));
  
  const validImage = isValidUrl(product.image) ? product.image : null;
  const validArrayImage = (product.images && product.images[0]?.url && isValidUrl(product.images[0].url)) ? product.images[0].url : null;
  const defaultImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'; // Premium Headphone fallback
  const imageUrl = validImage || validArrayImage || defaultImage;

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
