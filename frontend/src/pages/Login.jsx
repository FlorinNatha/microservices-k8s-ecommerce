import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container container">
      <div className="login-card glass-panel">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue to LuminaCart</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn-primary login-btn">Login</button>
        </form>
        
        <div style={{marginTop: '20px', textAlign: 'center'}}>
          <span style={{color: 'var(--text-secondary)'}}>Don't have an account? </span>
          <Link to="/register" style={{color: 'var(--accent-primary)', fontWeight: 'bold', textDecoration: 'none'}}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
