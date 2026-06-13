import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Package, Truck, Star, CreditCard, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data.data.orders);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const tabs = [
    { name: 'All', icon: <Package size={18} /> },
    { name: 'To Pay', icon: <CreditCard size={18} /> },
    { name: 'To Ship', icon: <Clock size={18} /> },
    { name: 'To Receive', icon: <Truck size={18} /> },
    { name: 'To Review', icon: <Star size={18} /> }
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All') return true;
    if (activeTab === 'To Pay') return !order.isPaid;
    if (activeTab === 'To Ship') return order.isPaid && !order.isDelivered; // Simplified: paid but not delivered
    if (activeTab === 'To Receive') return order.isPaid && !order.isDelivered; // Same as To Ship for now since we lack a shipped status
    if (activeTab === 'To Review') return order.isDelivered; // Delivered means ready to review
    return true;
  });

  const handlePayment = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const paymentDetails = {
        id: `mock-txn-${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        payer: {
          email_address: user.email
        }
      };

      await axios.put(`http://localhost:8000/api/orders/${orderId}/pay`, paymentDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Payment successful!');
      
      // Update local state to reflect payment
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, isPaid: true, paidAt: new Date().toISOString() } 
          : order
      ));
    } catch (err) {
      toast.error('Payment failed. Please try again.');
    }
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8 pt-8 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-slate-100">My Profile</h1>
        <p className="text-slate-400 mt-2">Manage your account and track your orders.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Profile Sidebar */}
        <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl h-fit">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl font-bold border border-cyan-500/30">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{user?.username}</h3>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-xl bg-cyan-500/10 text-cyan-400 font-medium">
              My Orders
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 font-medium transition">
              Account Settings
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 font-medium transition">
              Saved Addresses
            </button>
          </div>
        </div>

        {/* Orders Section */}
        <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">My Orders</h2>
          
          {/* Tabs */}
          <div className="flex flex-wrap border-b border-white/10 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.name}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition border-b-2 ${activeTab === tab.name ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>

          {/* Order List */}
          {loading ? (
            <div className="text-center py-10 text-slate-400">Loading your orders...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-400">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto mb-4 text-slate-600" />
              <h3 className="text-lg font-medium text-slate-300">No orders found</h3>
              <p className="text-slate-500 mt-2">You don't have any orders in this category yet.</p>
              <button 
                onClick={() => navigate('/products')}
                className="mt-6 px-6 py-2 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map(order => (
                <div key={order._id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-6">
                  <div className="flex flex-wrap justify-between items-center mb-4 pb-4 border-b border-white/5 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Order ID</p>
                      <p className="text-sm font-mono text-slate-300">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Date</p>
                      <p className="text-sm text-slate-300">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Amount</p>
                      <p className="text-sm font-semibold text-cyan-300">${order.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      {order.isDelivered ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                          Completed
                        </span>
                      ) : order.isPaid ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-500/20 text-sky-400">
                          Processing / To Ship
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-500/20 text-rose-400">
                          To Pay
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-slate-800" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-slate-200">{item.name}</h4>
                          <p className="text-xs text-slate-400 mt-1">Qty: {item.qty}</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-300">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    {!order.isPaid && (
                      <button 
                        onClick={() => handlePayment(order._id)}
                        className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-medium transition text-sm"
                      >
                        Pay Now
                      </button>
                    )}
                    {order.isDelivered && (
                      <button className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-100 font-medium transition text-sm">
                        Write Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
