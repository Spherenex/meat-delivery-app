// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protected Route component that redirects to login if user is not authenticated
 * @param {object} user - Current user object (optional, will use AuthContext if not provided)
 * @param {boolean} isAdmin - Whether the route requires admin privileges
 * @param {React.ReactNode} children - Child components to render
 * @returns {React.ReactNode} - Protected component or redirect
 */
const ProtectedRoute = ({ user, isAdmin = false, children }) => {
  const location = useLocation();
  const { currentUser, userProfile, loading } = useAuth();
  
  // Use provided user or get from context
  const authUser = user || currentUser;
  const isAdminUser = isAdmin && (userProfile?.isAdmin || false);
  
  // Show loading indicator while auth state is being determined
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login with return URL
  if (!authUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // If route requires admin privileges but user is not admin
  if (isAdmin && !isAdminUser) {
    return <Navigate to="/" replace />;
  }
  
  // If user is authenticated (and has admin privileges if required), render children
  return children;
};

export default ProtectedRoute;