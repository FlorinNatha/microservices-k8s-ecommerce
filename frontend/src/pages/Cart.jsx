import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ArrowRight } from 'lucide-react';
import './Cart.css';

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
      <div className="container empty-cart-container">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="btn-primary" style={{marginTop: '20px'}}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container cart-container">
      <h2 style={{marginBottom: '30px'}}>Shopping Cart</h2>
      
      <div className="cart-grid">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.product} className="cart-item glass-panel">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <Link to={`/product/${item.product}`} className="cart-item-name">{item.name}</Link>
                <div className="cart-item-price">${item.price.toFixed(2)}</div>
              </div>
              <div className="cart-item-qty">
                <button onClick={() => updateQty(item.product, Math.max(1, item.qty - 1))} className="qty-btn">-</button>
                <span style={{margin: '0 10px'}}>{item.qty}</span>
                <button onClick={() => updateQty(item.product, item.qty + 1)} className="qty-btn">+</button>
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(item.product)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary glass-panel">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items:</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total-row">
            <span>Subtotal:</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>
          <button className="btn-primary checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout <ArrowRight size={18} style={{marginLeft: '8px'}}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
