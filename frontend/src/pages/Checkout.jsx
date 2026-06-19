import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, Truck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, itemsPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('123 Tech Avenue');
  const [city, setCity] = useState('Silicon Valley');
  const [postalCode, setPostalCode] = useState('94000');
  const [country, setCountry] = useState('USA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cartItems.length === 0) navigate('/cart');
    if (!user) navigate('/login');
  }, [cartItems, navigate, user]);

  const taxPrice = Number((0.10 * itemsPrice).toFixed(2));
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = (itemsPrice + taxPrice + shippingPrice).toFixed(2);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const orderData = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'Credit Card',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      };

      // 1. Create the order
      const res = await axios.post('http://localhost:8000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const createdOrder = res.data.data.order;

      // 2. Automatically mark as paid (since this is a simulated checkout)
      const paymentDetails = {
        id: `mock-txn-${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        payer: { email_address: user.email }
      };

      await axios.put(`http://localhost:8000/api/orders/${createdOrder._id}/pay`, paymentDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      clearCart();
      toast.success('Payment successful! Order placed.', {
        duration: 4000,
        icon: '🎉',
      });
      navigate('/profile');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pb-20 pt-12">
      <div className="mb-10 rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Secure checkout</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Complete your order</h1>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100">
            <Truck size={18} /> Shipping & payment
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-[28px] border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-200 shadow-lg shadow-rose-500/10">
          <div className="inline-flex items-center gap-3 text-rose-200">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
          <h2 className="text-2xl font-semibold text-white">Shipping information</h2>
          <form onSubmit={handlePlaceOrder} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200">Address</label>
              <input
                className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-5 py-4 text-base text-slate-100 outline-none ring-1 ring-transparent transition focus:border-cyan-400 focus:ring-cyan-400/30"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-200">City</label>
                <input
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-5 py-4 text-base text-slate-100 outline-none ring-1 ring-transparent transition focus:border-cyan-400 focus:ring-cyan-400/30"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-200">Postal Code</label>
                <input
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-5 py-4 text-base text-slate-100 outline-none ring-1 ring-transparent transition focus:border-cyan-400 focus:ring-cyan-400/30"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">Country</label>
              <input
                className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-5 py-4 text-base text-slate-100 outline-none ring-1 ring-transparent transition focus:border-cyan-400 focus:ring-cyan-400/30"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6">
              <h3 className="text-lg font-semibold text-white">Order summary</h3>
              <div className="mt-6 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span>${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>${shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax (10%)</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex items-center justify-between text-lg font-semibold text-white">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CreditCard size={20} />
              {loading ? 'Processing...' : 'Place order'}
            </button>
          </form>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/20">
          <div className="flex items-center gap-4 rounded-[28px] border border-cyan-400/10 bg-cyan-400/10 p-5">
            <Truck size={22} className="text-cyan-300" />
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Fast delivery</p>
              <p className="mt-2 text-base font-semibold text-white">Free shipping on orders over $150</p>
            </div>
          </div>
          <div className="mt-6 space-y-5 text-slate-400">
            <div className="rounded-[28px] bg-slate-900/80 p-5">
              <p className="font-semibold text-white">Trusted payment</p>
              <p className="mt-2 text-sm">Secure checkout with encrypted card processing.</p>
            </div>
            <div className="rounded-[28px] bg-slate-900/80 p-5">
              <p className="font-semibold text-white">24/7 support</p>
              <p className="mt-2 text-sm">Our team is available anytime for order assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
