import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import './Login.css';

const AdminDashboard = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newProduct = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        image
      };

      await axios.post('http://localhost:8000/api/products', newProduct);
      
      toast.success('Product created successfully!', { icon: '✅' });
      
      // Clear form
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setCategory('');
      setImage('');
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{maxWidth: '800px', paddingTop: '40px'}}>
      <div className="glass-panel" style={{padding: '40px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px'}}>
          <div style={{background: 'rgba(29, 78, 216, 0.1)', color: 'var(--accent-primary)', padding: '15px', borderRadius: '12px'}}>
            <ShieldAlert size={32} />
          </div>
          <div>
            <h2 style={{margin: 0}}>Admin Dashboard</h2>
            <p style={{color: 'var(--text-secondary)', margin: 0}}>Add new products to the catalog</p>
          </div>
        </div>

        <form onSubmit={handleAddProduct}>
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Mechanical Keyboard" />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
              placeholder="Detailed product description..."
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px', 
                border: '1px solid var(--glass-border)', background: '#f8f9fa',
                minHeight: '100px', fontFamily: 'inherit', color: 'var(--text-primary)'
              }}
            />
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <div className="form-group">
              <label>Price ($)</label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="99.99" />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required placeholder="50" />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <div className="form-group">
              <label>Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="e.g. Electronics" />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.png" />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '20px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'}} disabled={loading}>
            <PlusCircle size={20} />
            {loading ? 'Creating...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
