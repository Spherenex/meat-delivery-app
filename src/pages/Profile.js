// src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import '../styles/pages/Profile.css';
import { FaUser, FaClipboardList, FaMapMarkerAlt, FaHeart, FaCreditCard, FaPen } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: ''
  });
  
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  
  const [addingAddress, setAddingAddress] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          // Get user document from Firestore
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              ...userData
            });
            
            // Set form data
            setFormData({
              fullName: currentUser.displayName || '',
              phone: userData.phone || '',
              email: currentUser.email || ''
            });
            
            // Set addresses
            setAddresses(userData.addresses || []);
          }
          
          // Fetch user orders
          const q = query(
            collection(db, 'orders'),
            where('userId', '==', currentUser.uid)
          );
          
          const querySnapshot = await getDocs(q);
          const ordersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setOrders(ordersData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const currentUser = auth.currentUser;
      
      // Update displayName in Firebase Auth
      await updateProfile(currentUser, {
        displayName: formData.fullName
      });
      
      // Update user document in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        fullName: formData.fullName,
        phone: formData.phone
      });
      
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      
      // Update local user state
      setUser({
        ...user,
        displayName: formData.fullName,
        fullName: formData.fullName,
        phone: formData.phone
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };
  
  const handleAddAddress = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      // Validate address fields
      if (!newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
        setError('Please fill all required fields');
        return;
      }
      
      // Make this address default if it's the first one
      if (addresses.length === 0) {
        newAddress.isDefault = true;
      }
      
      // If this address is set as default, update other addresses
      const updatedAddresses = [...addresses];
      if (newAddress.isDefault) {
        updatedAddresses.forEach(addr => {
          addr.isDefault = false;
        });
      }
      
      // Add new address
      const addressToAdd = {
        ...newAddress,
        id: Date.now().toString()
      };
      
      updatedAddresses.push(addressToAdd);
      
      // Update in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses
      });
      
      // Update local state
      setAddresses(updatedAddresses);
      setNewAddress({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
      setAddingAddress(false);
      setSuccess('Address added successfully!');
    } catch (error) {
      console.error('Error adding address:', error);
      setError('Failed to add address. Please try again.');
    }
  };
  
  const setDefaultAddress = async (addressId) => {
    try {
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      
      // Update in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses
      });
      
      // Update local state
      setAddresses(updatedAddresses);
      setSuccess('Default address updated!');
    } catch (error) {
      console.error('Error updating default address:', error);
      setError('Failed to update default address.');
    }
  };
  
  const removeAddress = async (addressId) => {
    try {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      
      // If we're removing the default address and there are other addresses,
      // make the first one default
      if (updatedAddresses.length > 0 && !updatedAddresses.some(addr => addr.isDefault)) {
        updatedAddresses[0].isDefault = true;
      }
      
      // Update in Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        addresses: updatedAddresses
      });
      
      // Update local state
      setAddresses(updatedAddresses);
      setSuccess('Address removed successfully!');
    } catch (error) {
      console.error('Error removing address:', error);
      setError('Failed to remove address.');
    }
  };
  
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="profile-not-logged-in">
        <h2>Please log in to view your profile</h2>
        <Link to="/login" className="login-button">Log In</Link>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="user-info">
            <div className="user-avatar">
              <FaUser />
            </div>
            <h3>{user.displayName || 'User'}</h3>
            <p>{user.email}</p>
          </div>
          
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser /> <span>My Profile</span>
            </button>
            
            <button 
              className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <FaClipboardList /> <span>My Orders</span>
            </button>
            
            <button 
              className={`nav-tab ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <FaMapMarkerAlt /> <span>My Addresses</span>
            </button>
            
            <button 
              className={`nav-tab ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('wishlist')}
            >
              <FaHeart /> <span>My Wishlist</span>
            </button>
            
            <button 
              className={`nav-tab ${activeTab === 'payment' ? 'active' : ''}`}
              onClick={() => setActiveTab('payment')}
            >
              <FaCreditCard /> <span>Payment Methods</span>
            </button>
          </div>
        </div>
        
        <div className="profile-content">
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}
          
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="tab-header">
                <h2>My Profile</h2>
                <button 
                  className="edit-button"
                  onClick={() => setEditMode(!editMode)}
                >
                  <FaPen /> {editMode ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              {editMode ? (
                <form className="profile-form" onSubmit={handleProfileUpdate}>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                    />
                    <small>Email cannot be changed</small>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <button type="submit" className="save-button">Save Changes</button>
                </form>
              ) : (
                <div className="profile-details">
                  <div className="profile-field">
                    <span className="field-label">Full Name:</span>
                    <span className="field-value">{user.displayName || 'Not set'}</span>
                  </div>
                  
                  <div className="profile-field">
                    <span className="field-label">Email:</span>
                    <span className="field-value">{user.email}</span>
                  </div>
                  
                  <div className="profile-field">
                    <span className="field-label">Phone:</span>
                    <span className="field-value">{user.phone || 'Not set'}</span>
                  </div>
                  
                  <div className="profile-field">
                    <span className="field-label">Member Since:</span>
                    <span className="field-value">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="orders-tab">
              <h2>My Orders</h2>
              
              {orders.length === 0 ? (
                <div className="no-orders">
                  <p>You haven't placed any orders yet.</p>
                  <Link to="/" className="shop-now-button">Shop Now</Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-id">
                          <span>Order ID:</span> #{order.id}
                        </div>
                        <div className="order-date">
                          <span>Ordered on:</span> {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div className={`order-status ${order.status}`}>
                          {order.status}
                        </div>
                      </div>
                      
                      <div className="order-items">
                        {order.items.map(item => (
                          <div key={item.id} className="order-item">
                            <div className="item-image">
                              <img src={item.image} alt={item.name} />
                            </div>
                            <div className="item-details">
                              <h4>{item.name}</h4>
                              <p>Qty: {item.quantity} × ₹{item.price}</p>
                            </div>
                            <div className="item-price">
                              ₹{item.price * item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-summary">
                        <div className="order-total">
                          <span>Total:</span> ₹{order.totalAmount}
                        </div>
                        
                        <Link to={`/orders/${order.id}`} className="view-details-button">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'addresses' && (
            <div className="addresses-tab">
              <div className="tab-header">
                <h2>My Addresses</h2>
                <button 
                  className="add-address-button"
                  onClick={() => setAddingAddress(!addingAddress)}
                >
                  {addingAddress ? 'Cancel' : '+ Add New Address'}
                </button>
              </div>
              
              {addingAddress && (
                <form className="address-form" onSubmit={handleAddAddress}>
                  <div className="form-group">
                    <label htmlFor="addressLine1">Address Line 1 *</label>
                    <input
                      type="text"
                      id="addressLine1"
                      name="addressLine1"
                      value={newAddress.addressLine1}
                      onChange={handleAddressInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="addressLine2">Address Line 2</label>
                    <input
                      type="text"
                      id="addressLine2"
                      name="addressLine2"
                      value={newAddress.addressLine2}
                      onChange={handleAddressInputChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="state">State *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="pincode">PIN Code *</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={newAddress.pincode}
                        onChange={handleAddressInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-checkbox">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={newAddress.isDefault}
                      onChange={handleAddressInputChange}
                    />
                    <label htmlFor="isDefault">Make this my default address</label>
                  </div>
                  
                  <button type="submit" className="save-button">Save Address</button>
                </form>
              )}
              
              {addresses.length === 0 && !addingAddress ? (
                <div className="no-addresses">
                  <p>You haven't added any addresses yet.</p>
                  <button 
                    className="add-address-button inline"
                    onClick={() => setAddingAddress(true)}
                  >
                    + Add New Address
                  </button>
                </div>
              ) : (
                <div className="addresses-list">
                  {addresses.map(address => (
                    <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                      {address.isDefault && <span className="default-badge">Default</span>}
                      
                      <div className="address-details">
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>{address.city}, {address.state}, {address.pincode}</p>
                      </div>
                      
                      <div className="address-actions">
                        {!address.isDefault && (
                          <button 
                            className="make-default-button"
                            onClick={() => setDefaultAddress(address.id)}
                          >
                            Set as Default
                          </button>
                        )}
                        
                        <button 
                          className="remove-address-button"
                          onClick={() => removeAddress(address.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'wishlist' && (
            <div className="wishlist-tab">
              <h2>My Wishlist</h2>
              <p className="coming-soon">Wishlist feature coming soon!</p>
            </div>
          )}
          
          {activeTab === 'payment' && (
            <div className="payment-tab">
              <h2>Payment Methods</h2>
              <p className="coming-soon">Payment method management coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;