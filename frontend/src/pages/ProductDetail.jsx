import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Check, Shield } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${id}`);
        setProduct(response.data.data.product);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="container px-4 sm:px-6 lg:px-8 pt-20">Loading product details...</div>;
  if (error) return <div className="container px-4 sm:px-6 lg:px-8 pt-20 text-red-400">{error}</div>;
  if (!product) return <div className="container px-4 sm:px-6 lg:px-8 pt-20">Product not found</div>;

  const imageUrl = product.image || product.images?.[0]?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=00F0FF&color=050505&size=800&font-size=0.33`;

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${qty}x ${product.name} added to your cart!`, { icon: '🛒' });
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-20 pt-12">
      <button
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-200 shadow-lg shadow-slate-950/10 hover:bg-slate-900/95"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} /> Back to products
      </button>

      <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/20 sm:p-8">
          <img src={imageUrl} alt={product.name} className="mx-auto h-[520px] w-full rounded-[28px] object-cover shadow-xl shadow-slate-950/20" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Battery life</p>
              <p className="mt-3 text-lg font-semibold text-slate-100">Up to 48 hrs</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Connectivity</p>
              <p className="mt-3 text-lg font-semibold text-slate-100">Bluetooth 5.3</p>
            </div>
          </div>
        </div>

        <div className="space-y-7">
          <div className="rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
            <span className="inline-flex rounded-full bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-cyan-200">{product.category || 'Electronics'}</span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white">{product.name}</h1>
            <p className="mt-5 text-3xl font-semibold text-cyan-300">${product.price.toFixed(2)}</p>
            <p className="mt-6 text-base leading-7 text-slate-400">{product.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Availability</p>
              <p className={`mt-4 text-lg font-semibold ${product.stock > 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Shipping</p>
              <p className="mt-4 text-lg font-semibold text-slate-200">Free delivery on orders over $150</p>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-inner shadow-slate-950/20">
              <div className="mb-6 flex items-center justify-between rounded-3xl bg-slate-900/90 p-4">
                <span className="text-sm uppercase tracking-[0.35em] text-slate-500">Quantity</span>
                <div className="inline-flex items-center rounded-full border border-white/10 bg-slate-900 px-3 py-2 text-slate-100">
                  <button
                    className="h-10 w-10 text-xl font-semibold text-cyan-300 hover:text-cyan-200"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                  >
                    -
                  </button>
                  <span className="mx-4 min-w-[2rem] text-center text-base font-semibold">{qty}</span>
                  <button
                    className="h-10 w-10 text-xl font-semibold text-cyan-300 hover:text-cyan-200"
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          )}

          <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 text-slate-300">
            <div className="flex items-center gap-3 text-slate-200">
              <Shield size={20} />
              <p className="font-semibold">Secure checkout and protected payment</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">Experience safe ordering with encrypted transactions and full order protection.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
