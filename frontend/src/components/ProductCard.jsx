import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  // Use the image string from the backend, or a fallback placeholder
  const imageUrl = product.image 
    ? product.image 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=00F0FF&color=050505&size=400&font-size=0.33`;

  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="product-card glass-panel">
      <div className="card-image-wrapper">
        <img src={imageUrl} alt={product.name} className="card-image" />
        <div className="category-badge">{product.category || 'Tech'}</div>
      </div>
      
      <div className="card-content">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        
        <div className="card-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="btn-icon">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
      </div>
    </Link>
  );
};

export default ProductCard;
