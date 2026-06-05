import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Temporarily creating admins automatically on the backend!
      await axios.post('http://localhost:8000/api/auth/register', { username, email, password });
      
      // Auto login after register
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError('Registered successfully, but auto-login failed. Please try logging in manually.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container container">
      <div className="login-card glass-panel">
        <h2>Create Account</h2>
        <p className="login-subtitle">Join Rozer to start shopping</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="Enter a username"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Create a strong password"
              minLength="6"
            />
          </div>
          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div style={{marginTop: '20px', textAlign: 'center'}}>
          <span style={{color: 'var(--text-secondary)'}}>Already have an account? </span>
          <Link to="/login" style={{color: 'var(--accent-primary)', fontWeight: 'bold', textDecoration: 'none'}}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
