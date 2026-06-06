import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQty, removeFromCart, itemsPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/90 p-14 text-center shadow-2xl shadow-slate-950/20">
          <h2 className="text-3xl font-semibold text-white">Your cart is empty</h2>
          <p className="mt-4 text-slate-400">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/products"
            className="mt-8 inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-8 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110"
          >
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-20 pt-12">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Shopping Cart</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Your order summary</h1>
        </div>
        <p className="text-sm text-slate-400">{cartItems.length} items in your cart</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-5">
          {cartItems.map((item) => (
            <div key={item.product} className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/90 p-5 shadow-2xl shadow-slate-950/20 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img src={item.image} alt={item.name} className="h-28 w-28 rounded-3xl object-cover" />
                <div className="flex-1">
                  <Link to={`/product/${item.product}`} className="text-xl font-semibold text-white hover:text-cyan-300">
                    {item.name}
                  </Link>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.category || 'Electronics'} • ${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/90 px-3 py-2">
                  <button
                    className="text-lg font-semibold text-cyan-300 hover:text-cyan-200"
                    onClick={() => updateQty(item.product, Math.max(1, item.qty - 1))}
                  >
                    -
                  </button>
                  <span className="min-w-[2rem] text-center text-base font-semibold text-white">{item.qty}</span>
                  <button
                    className="text-lg font-semibold text-cyan-300 hover:text-cyan-200"
                    onClick={() => updateQty(item.product, item.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/90 text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"
                  onClick={() => removeFromCart(item.product)}
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
          <h2 className="text-2xl font-semibold text-white">Order summary</h2>
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Items</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between rounded-3xl bg-slate-900/80 px-4 py-4 text-sm text-slate-300">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex items-center justify-between text-lg font-semibold text-white">
              <span>Subtotal</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
          </div>
          <button
            className="mt-10 inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110"
            onClick={handleCheckout}
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
