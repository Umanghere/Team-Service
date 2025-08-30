import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userEmail } = useAuth();

  // If not authenticated or no user email, redirect to login
  if (!isAuthenticated || !userEmail) {
    return <Navigate to="/" replace />;
  }

  return children;
}; 

export default ProtectedRoute;