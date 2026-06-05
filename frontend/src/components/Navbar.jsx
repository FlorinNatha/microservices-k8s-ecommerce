import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Package, LogOut, Search, Phone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItemsCount } = useContext(CartContext);

  return (
    <nav className="navbar glass-panel" style={{borderBottom: '1px solid #E5E7EB'}}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo" style={{color: 'var(--accent-primary)', fontSize: '2rem'}}>
          <Package className="logo-icon" size={32} />
          <span>Rozer</span>
        </Link>

        <div className="nav-search-bar">
          <select className="search-select">
            <option>All Categories</option>
          </select>
          <input type="text" placeholder="Search products here..." className="search-input" />
          <button className="search-btn"><Search size={20} /></button>
        </div>
        
        <div className="nav-contact">
          <Phone size={24} style={{color: 'var(--text-secondary)'}} />
          <div>
            <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block'}}>Call Us:</span>
            <strong style={{fontSize: '0.9rem'}}>(+123) 888 9999</strong>
          </div>
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-link">Products</Link>
          <Link to="/cart" className="nav-icon-link">
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && <span className="badge">{cartItemsCount}</span>}
          </Link>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link" style={{color: 'var(--accent-primary)'}}>Admin</Link>
              )}
              <span style={{ color: 'var(--text-secondary)' }}>Hi, {user.username}</span>
              <button onClick={logout} className="btn-primary" style={{ padding: '8px 16px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)' }}>
                <LogOut size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '8px 16px', marginLeft: '12px' }}>
              <User size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
