import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const name = params.get('name');
    const role = params.get('role');
    const id = params.get('id');

    if (token && name) {
      const userData = { id, name, email: '', role };
      login(userData, token);
      toast.success(`Welcome, ${name}! 🎉`);
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/menu');
      }
    } else {
      toast.error('OAuth login failed!');
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl animate-bounce mb-4">🍔</div>
        <p className="text-gray-600 text-lg font-medium">Logging you in...</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;