import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Block browser back button after logout
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      if (!localStorage.getItem('token')) {
        navigate('/login', { replace: true });
      }
    };
    return () => {
      window.onpopstate = null;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🍔</div>
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !localStorage.getItem('token')) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;