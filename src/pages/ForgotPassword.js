// src/pages/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/ForgotPassword.css';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import logoImage from '../assets/images/logo.png';

const ForgotPassword = () => {
  const { resetPassword, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }
    
    setMessage('');
    clearError();
    setLoading(true);
    
    try {
      await resetPassword(email);
      setMessage('Password reset instructions sent to your email!');
      setEmail('');
    } catch (error) {
      console.error('Password reset error:', error);
      // Error is handled by AuthContext
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-logo">
          <img src={logoImage} alt="Licious Logo" />
        </div>
        
        <h1 className="forgot-password-title">Reset Your Password</h1>
        <p className="forgot-password-subtitle">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="reset-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </form>
        
        <div className="back-to-login">
          <Link to="/login">
            <FaArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;