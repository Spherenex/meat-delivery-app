





// src/components/MerchantRequestForm.js
import React, { useState } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../firebase/config';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/MerchantRequestForm.css';

const MerchantRequestForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    vendorName: '',
    address: '',
    phoneNumber: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.vendorName.trim()) return "Vendor name is required";
    if (!formData.address.trim()) return "Address is required";
    if (!formData.phoneNumber.trim()) return "Phone number is required";
    if (!/^\d{10}$/.test(formData.phoneNumber)) return "Please enter a valid 10-digit phone number";
    if (!formData.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Please enter a valid email address";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Create a reference directly to the merchantRequests node in Realtime Database
      const merchantRequestsRef = ref(db, 'merchantRequests');
      
      // Create the data object to be saved
      const requestData = {
        vendorName: formData.vendorName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        message: formData.message || '',
        status: "pending",
        createdAt: serverTimestamp()
      };
      
      // Push the data to create a new entry with a unique key
      await push(merchantRequestsRef, requestData);
      
      // Handle success
      setSuccess(true);
      toast.success("Your request has been submitted successfully. We'll contact you soon!");
      
      // Reset form
      setFormData({
        vendorName: '',
        address: '',
        phoneNumber: '',
        email: '',
        message: ''
      });
      
      // Close the form after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error.message);
      setError("Failed to submit your request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="merchant-form-overlay">
      <div className="merchant-form-container">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="merchant-form-header">
          <h2>Become a Merchant Partner</h2>
          <p>Fill out this form to request merchant access on ZappCart</p>
        </div>
        
        {success && (
          <div className="success-message">
            Your request has been submitted successfully! We'll review your application and contact you soon.
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="merchant-form">
          <div className="form-group">
            <label htmlFor="vendorName">Business/Vendor Name *</label>
            <input
              type="text"
              id="vendorName"
              name="vendorName"
              value={formData.vendorName}
              onChange={handleChange}
              placeholder="Enter your business name"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Business Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your complete business address"
              rows="3"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              disabled={loading}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Additional Information</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your business, products, etc."
              rows="4"
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="submit-button" disabled={loading || success}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
          
          <p className="form-note">
            * We'll review your application and get back to you via email.
          </p>
        </form>
      </div>
    </div>
  );
};

export default MerchantRequestForm;
