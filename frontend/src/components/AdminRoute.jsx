import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but not an admin, show Access Denied
  if (user.role !== 'admin') {
    return (
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '100px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ padding: '50px', maxWidth: '500px' }}>
          <ShieldAlert size={64} style={{ color: '#EF4444', marginBottom: '20px' }} />
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)' }}>You must be an administrator to view this page. If you believe this is an error, contact support.</p>
        </div>
      </div>
    );
  }

  // If user is an admin, render the requested component
  return children;
};

export default AdminRoute;
