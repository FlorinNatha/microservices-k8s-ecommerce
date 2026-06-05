import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { Loader, Truck, RefreshCw, Phone, ShieldCheck } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Ensure this hits the API Gateway
        const response = await axios.get('http://localhost:8000/api/products');
        setProducts(response.data.data.products);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-wrapper">
      <div className="hero-banner">
        <div className="container hero-container">
          <div className="hero-content">
            <p className="hero-subtitle">WIRELESS BLUETOOTH GAMING</p>
            <h1 className="hero-title">Bluetooth Gamepad<br/>IPEGA PG-9023</h1>
            <button className="btn-primary shop-now-btn">SHOP NOW</button>
          </div>
          <div className="hero-image-container">
            <img src="https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80" alt="Gamepad" className="hero-image" />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="features-bar glass-panel">
          <div className="feature-item">
            <Truck size={32} className="feature-icon" />
            <div>
              <h4>Free Shipping</h4>
              <p>On all orders over $75.00</p>
            </div>
          </div>
          <div className="feature-item">
            <RefreshCw size={32} className="feature-icon" />
            <div>
              <h4>Free Returns</h4>
              <p>Returns are free within 9 days</p>
            </div>
          </div>
          <div className="feature-item">
            <Phone size={32} className="feature-icon" />
            <div>
              <h4>Support 24/7</h4>
              <p>Contact us 24 hours a day</p>
            </div>
          </div>
          <div className="feature-item">
            <ShieldCheck size={32} className="feature-icon" />
            <div>
              <h4>100% Payment Secure</h4>
              <p>Your payments are safe with us</p>
            </div>
          </div>
        </div>

        <div className="promo-banners">
          <div className="promo-banner" style={{background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)'}}>
            <div className="promo-content">
              <h3>LG V30<br/>Full Vision</h3>
              <p>Your Life, Through Your Lens</p>
            </div>
          </div>
          <div className="promo-banner" style={{background: '#111'}}>
            <div className="promo-content text-white">
              <h3 style={{color: 'white'}}>H2 Sport<br/>Earbuds</h3>
              <p style={{color: '#aaa'}}>Noise-Masking Sleepbuds™</p>
            </div>
          </div>
          <div className="promo-banner" style={{background: 'var(--accent-primary)'}}>
            <div className="promo-content text-white">
              <h3 style={{color: 'white'}}>Galaxy S10<br/>Samsung</h3>
              <p style={{color: '#eee'}}>4 Different Color High Resolution</p>
            </div>
          </div>
        </div>
        
        <div className="section-header">
          <h2 className="section-title">Popular Categories</h2>
          <div className="section-line"></div>
        </div>

      {loading ? (
        <div className="loader-container">
          <Loader className="spinner" size={48} />
          <p>Loading products from Redis Cache...</p>
        </div>
      ) : error ? (
        <div className="error-container glass-panel">
          <h3>Oops! Something went wrong.</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Home;
