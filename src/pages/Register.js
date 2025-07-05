// src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import '../styles/pages/Register.css';
import logoImage from '../assets/images/logo.png';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaGoogle, FaFacebook } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate fullName
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Validate phone
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate terms acceptance
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the Terms & Conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: formData.fullName
      });
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || '',
        createdAt: new Date().toISOString(),
        isAdmin: false,
        addresses: []
      });
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle different error codes
      switch (err.code) {
        case 'auth/email-already-in-use':
          setErrors({ ...errors, email: 'Email already in use' });
          break;
        case 'auth/invalid-email':
          setErrors({ ...errors, email: 'Invalid email address' });
          break;
        case 'auth/weak-password':
          setErrors({ ...errors, password: 'Password is too weak' });
          break;
        default:
          setErrors({ 
            ...errors, 
            general: 'An error occurred during registration. Please try again' 
          });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialSignup = async (provider) => {
    setLoading(true);
    
    try {
      const authProvider = provider === 'google' 
        ? new GoogleAuthProvider() 
        : new FacebookAuthProvider();
      
      const result = await signInWithPopup(auth, authProvider);
      const user = result.user;
      
      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        isAdmin: false,
        addresses: []
      }, { merge: true }); // merge: true to not overwrite existing data
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      console.error('Social signup error:', err);
      setErrors({ 
        ...errors, 
        general: 'Failed to sign up with social provider. Please try again' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-logo">
          <Link to="/">
            <img src={logoImage} alt="Licious Logo" />
          </Link>
        </div>
        
        <h1 className="register-title">Create an Account</h1>
        <p className="register-subtitle">Join the Licious family today</p>
        
        {errors.general && <div className="error-message general">{errors.general}</div>}
        
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-icon">
              <FaUser />
            </div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              className={errors.fullName ? 'error' : ''}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <div className="input-icon">
              <FaEnvelope />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <div className="input-icon">
              <FaPhone />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number (Optional)"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>
          
          <div className="form-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <div className="input-icon">
              <FaLock />
            </div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>
          
          <div className="terms-checkbox">
            <label className={errors.terms ? 'error' : ''}>
              <input 
                type="checkbox" 
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                disabled={loading}
              />
              <span>I agree to the <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link></span>
            </label>
            {errors.terms && <span className="field-error">{errors.terms}</span>}
          </div>
          
          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="social-register">
          <p className="or-divider">
            <span>or sign up with</span>
          </p>
          
          <div className="social-buttons">
            <button 
              className="google-button"
              onClick={() => handleSocialSignup('google')}
              disabled={loading}
            >
              <FaGoogle /> Google
            </button>
            <button 
              className="facebook-button"
              onClick={() => handleSocialSignup('facebook')}
              disabled={loading}
            >
              <FaFacebook /> Facebook
            </button>
          </div>
        </div>
        
        <div className="login-link">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;