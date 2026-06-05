import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Check, Shield } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

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

  if (loading) return <div className="container" style={{paddingTop: '50px'}}>Loading product details...</div>;
  if (error) return <div className="container" style={{color: '#EF4444', paddingTop: '50px'}}>{error}</div>;
  if (!product) return <div className="container" style={{paddingTop: '50px'}}>Product not found</div>;

  const imageUrl = product.image 
    ? product.image 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=00F0FF&color=050505&size=800&font-size=0.33`;

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${qty}x ${product.name} added to your cart!`, { icon: '🛒' });
  };

  return (
    <div className="container product-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back to Products
      </button>

      <div className="product-detail-grid">
        <div className="product-image-section glass-panel">
          <img src={imageUrl} alt={product.name} className="product-large-image" />
        </div>

        <div className="product-info-section">
          <div className="category-tag">{product.category || 'Tech'}</div>
          <h1 className="product-title-large">{product.name}</h1>
          <p className="product-price-large">${product.price.toFixed(2)}</p>
          
          <div className="product-description-full">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock"><Check size={16} /> In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="add-to-cart-section glass-panel">
              <div className="qty-selector">
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <span className="qty-display">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
              </div>
              <button className="btn-primary add-to-cart-btn" onClick={handleAddToCart}>
                <ShoppingCart size={20} style={{ marginRight: '8px' }} />
                Add to Cart
              </button>
            </div>
          )}

          <div className="trust-badges">
            <div className="trust-badge">
              <Shield size={20} />
              <span>Secure Payment processed by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
