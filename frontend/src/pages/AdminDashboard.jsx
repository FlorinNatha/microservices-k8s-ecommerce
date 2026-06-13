import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, ShieldAlert, Trash2, Edit2, XCircle } from 'lucide-react';
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
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data.data.products);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Product deleted successfully');
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      const errorMsg = error.response?.data?.details || error.response?.data?.message || 'Failed to delete product';
      toast.error(errorMsg);
    }
  };

  const handleEditProduct = (product) => {
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setCategory(product.category);
    setImage(product.images && product.images.length > 0 ? product.images[0].url : '');
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setCategory('');
    setImage('');
    setEditingId(null);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        images: image ? [{ url: image }] : []
      };

      const token = localStorage.getItem('token');
      
      if (editingId) {
        await axios.put(`http://localhost:8000/api/products/${editingId}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product updated successfully!', { icon: '✅' });
        setEditingId(null);
      } else {
        await axios.post('http://localhost:8000/api/products', productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product created successfully!', { icon: '✅' });
      }
      
      // Clear form
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setCategory('');
      setImage('');
      fetchProducts(); // Refresh list
      
    } catch (err) {
      const errorMsg = err.response?.data?.details || err.response?.data?.message || 'Failed to save product';
      toast.error(errorMsg);
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
            <h2 style={{margin: 0}}>{editingId ? 'Edit Product' : 'Admin Dashboard'}</h2>
            <p style={{color: 'var(--text-secondary)', margin: 0}}>{editingId ? 'Update the details of the selected product' : 'Add new products to the catalog'}</p>
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
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '8px', 
                  background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '1rem',
                  appearance: 'none'
                }}
              >
                <option value="" disabled>Select Category</option>
                <option value="Headphones">Headphones</option>
                <option value="Earbuds">Earbuds</option>
                <option value="Smartwatches">Smartwatches</option>
                <option value="Speakers">Speakers</option>
                <option value="Audio Accessories">Audio Accessories</option>
              </select>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.png" />
            </div>
          </div>

          <div style={{display: 'flex', gap: '15px', marginTop: '20px'}}>
            <button type="submit" className="btn-primary" style={{flex: 1, padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'}} disabled={loading}>
              <PlusCircle size={20} />
              {loading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} style={{background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '8px', padding: '16px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'}}>
                <XCircle size={20} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-panel" style={{padding: '40px', marginTop: '40px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px'}}>
          <div>
            <h2 style={{margin: 0}}>Manage Products</h2>
            <p style={{color: 'var(--text-secondary)', margin: 0}}>Delete existing products from the catalog</p>
          </div>
        </div>

        {loadingProducts ? (
          <p style={{color: 'var(--text-secondary)'}}>Loading products...</p>
        ) : products.length === 0 ? (
          <p style={{color: 'var(--text-secondary)'}}>No products found.</p>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            {products.map(product => (
              <div key={product._id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                  {product.images && product.images.length > 0 && <img src={product.images[0].url} alt={product.name} style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px'}} />}
                  <div>
                    <h4 style={{margin: 0, color: 'var(--text-primary)'}}>{product.name}</h4>
                    <p style={{margin: 0, fontSize: '12px', color: 'var(--text-secondary)'}}>${product.price.toFixed(2)} - Stock: {product.stock}</p>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button 
                    type="button"
                    onClick={() => handleEditProduct(product)}
                    style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    title="Edit Product"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDeleteProduct(product._id)}
                    style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    title="Delete Product"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
