import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './Login.css';

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
      const orderData = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'Credit Card',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      };

      const res = await axios.post('http://localhost:8000/api/orders', orderData);
      
      clearCart();
      toast.success('Order placed successfully! Redirecting...', {
        duration: 4000,
        icon: '🎉',
      });
      navigate('/');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{maxWidth: '800px', paddingTop: '20px'}}>
      <h2 style={{marginBottom: '30px'}}><Truck size={24} style={{verticalAlign: 'text-bottom', marginRight: '10px'}}/> Secure Checkout</h2>
      
      {error && (
        <div className="error-message" style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
          <AlertCircle /> {error}
        </div>
      )}

      <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '30px'}}>
        <div className="glass-panel" style={{padding: '30px'}}>
          <h3 style={{marginBottom: '20px'}}>Shipping Information</h3>
          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
              <div className="form-group">
                <label>City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label>Country</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
            </div>

            <h3 style={{marginTop: '30px', marginBottom: '20px'}}>Order Summary</h3>
            <div className="summary-row">
              <span>Items:</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>${shippingPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            <div style={{height: '1px', background: 'var(--glass-border)', margin: '15px 0'}}></div>
            <div className="summary-row" style={{fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '25px'}}>
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>

            <button type="submit" className="btn-primary" style={{width: '100%', padding: '16px', fontSize: '1.1rem'}} disabled={loading}>
              {loading ? 'Processing...' : <><CreditCard size={20} style={{verticalAlign: 'text-bottom', marginRight: '8px'}}/> Place Order</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
