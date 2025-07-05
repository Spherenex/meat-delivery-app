// src/components/Contact.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref as dbRef, set, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import logoImage from '../assets/images/logo1.png';
import { FaArrowLeft, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaLinkedinIn, FaTwitter, FaInstagram, FaPaperPlane, FaSpinner, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState(null);
  const [content, setContent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [editContent, setEditContent] = useState(null);

  // Default content as fallback
  const defaultContent = {
    hero: {
      title: 'Contact Us',
      subtitle: 'We\'d love to hear from you. Get in touch with the ZappCart team.'
    },
    contactInfo: {
      address: {
        title: 'Our Location',
        line1: 'Sri kalabhairaveshwara chicken center,',
        line2: 'Rajeev Gandhi circle, kebbehala sunkadakatte',
        line3: 'Bangalore - 560091'
      },
      phone: {
        title: 'Phone Contact',
        customer: '+91 8722237574',
        hours: '7:00 AM - 10:00 PM, All days'
      },
      email: {
        title: 'Email Us',
        general: 'official.tazatabutchers@gmail.com',
        partnership: 'official.tazatabutchers@gmail.com',
        security: 'official.tazatabutchers@gmail.com'
      }
    },
    socialLinks: [
      { platform: 'Twitter', url: 'https://x.com/zappcart' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/zapp-cart-31b9aa365/' },
      { platform: 'Instagram', url: 'https://www.instagram.com/_zappcart/' }
    ],
    mapLocation: {
      lat: '12.9895',
      lng: '77.5090',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497.2672663551975!2d77.50879767534478!3d12.989511169948475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU5JzIxLjUiTiA3N8KwMzAnMzIuNSJF!5e0!3m2!1sen!2sin!4v1715705423853!5m2!1sen!2sin'
    }
  };

  useEffect(() => {
    const loadContent = () => {
      try {
        const contentRef = dbRef(db, 'pages/contact');
        const unsubscribe = onValue(contentRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setContent(data);
            setEditContent(JSON.parse(JSON.stringify(data))); // Deep copy for editing
          } else {
            setContent(defaultContent);
            setEditContent(JSON.parse(JSON.stringify(defaultContent))); // Deep copy for editing
          }
          setContentLoading(false);
        }, (error) => {
          console.error("Error loading content:", error);
          setContentError(error.message);
          setContent(defaultContent);
          setEditContent(JSON.parse(JSON.stringify(defaultContent))); // Deep copy for editing
          setContentLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error setting up content listener:", error);
        setContentError(error.message);
        setContent(defaultContent);
        setEditContent(JSON.parse(JSON.stringify(defaultContent))); // Deep copy for editing
        setContentLoading(false);
      }
    };

    const unsubscribe = loadContent();
    
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);
  
  // Handle edit content change
  const handleEditChange = (path, value) => {
    const keys = path.split('.');
    
    setEditContent(prev => {
      const updated = { ...prev };
      let current = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };
  
  // Handle saving edited content
  const saveEditedContent = async () => {
    try {
      setSavingContent(true);
      const contentRef = dbRef(db, 'pages/contact');
      
      // Merge the edited content with existing content to preserve any fields
      // that might not be part of the edit form
      const mergedContent = { ...content, ...editContent };
      
      await set(contentRef, mergedContent);
      setContent(mergedContent);
      setEditMode(false);
      setError('');
    } catch (err) {
      console.error("Error saving content:", err);
      setError("Failed to save changes. Please try again.");
    } finally {
      setSavingContent(false);
    }
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditContent(JSON.parse(JSON.stringify(content))); // Reset to original
    setEditMode(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }, 1500);
  };

  const getSocialIcon = (platform) => {
    switch(platform.toLowerCase()) {
      case 'twitter':
        return <FaTwitter />;
      case 'linkedin':
        return <FaLinkedinIn />;
      case 'instagram':
        return <FaInstagram />;
      default:
        return <FaEnvelope />;
    }
  };

  if (contentLoading) {
    return (
      <div className="contact-page-container loading-container">
        <div className="contact-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        <div className="loading-section">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
          </div>
          <p>Loading contact information...</p>
        </div>
      </div>
    );
  }

  const displayContent = content || defaultContent;

  return (
    <div className="contact-page-container">
      <header className="contact-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
       
      </header>

      <main className="contact-content">
        <div className="contact-banner">
          {/* {displayContent.hero?.imageUrl && (
            <div className="hero-image">
              <img src={displayContent.hero.imageUrl} alt="Contact Us Hero" />
            </div>
          )} */}
          {editMode ? (
            <>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={displayContent.hero?.title || ''}
                  onChange={(e) => handleEditChange('hero.title', e.target.value)}
                  placeholder="Contact page title"
                  className="edit-input"
                />
              </div>
              <div className="form-group">
                <label>Subtitle:</label>
                <textarea
                  value={displayContent.hero?.subtitle || ''}
                  onChange={(e) => handleEditChange('hero.subtitle', e.target.value)}
                  placeholder="Contact page subtitle"
                  rows={2}
                  className="edit-input"
                />
              </div>
            </>
          ) : (
            <>
              <h1>{displayContent.hero?.title || 'Contact Us'}</h1>
              <p>{displayContent.hero?.subtitle || 'We\'d love to hear from you. Get in touch with the ZappCart team.'}</p>
            </>
          )}
        </div>

        <div className="contact-grid">
          <div className="contact-info-section">
            {/* Address Card */}
            {displayContent.contactInfo?.address && (
              <div className="contact-card">
                <div className="contact-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="contact-details">
                  {editMode ? (
                    <>
                      <div className="form-group">
                        <label>Title:</label>
                        <input
                          type="text"
                          value={displayContent.contactInfo?.address?.title || ''}
                          onChange={(e) => handleEditChange('contactInfo.address.title', e.target.value)}
                          className="edit-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Line 1:</label>
                        <input
                          type="text"
                          value={displayContent.contactInfo?.address?.line1 || ''}
                          onChange={(e) => handleEditChange('contactInfo.address.line1', e.target.value)}
                          className="edit-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Line 2:</label>
                        <input
                          type="text"
                          value={displayContent.contactInfo?.address?.line2 || ''}
                          onChange={(e) => handleEditChange('contactInfo.address.line2', e.target.value)}
                          className="edit-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Line 3:</label>
                        <input
                          type="text"
                          value={displayContent.contactInfo?.address?.line3 || ''}
                          onChange={(e) => handleEditChange('contactInfo.address.line3', e.target.value)}
                          className="edit-input"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>{displayContent.contactInfo.address.title}</h3>
                      <p>
                        {displayContent.contactInfo.address.line1}<br />
                        {displayContent.contactInfo.address.line2}<br />
                        {displayContent.contactInfo.address.line3}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Phone Card */}
            {displayContent.contactInfo?.phone && (
              <div className="contact-card">
                <div className="contact-icon">
                  <FaPhoneAlt />
                </div>
                <div className="contact-details">
                  {editMode ? (
                    <>
                      <div className="form-group">
                        <label>Title:</label>
                        <input
                          type="text"
                          value={displayContent.contactInfo?.phone?.title || ''}
                          onChange={(e) => handleEditChange('contactInfo.phone.title', e.target.value)}
                          className="edit-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number:</label>
                        <input
                          type="text"
                          value={displayContent.contactInfo?.phone?.customer || ''}
                          onChange={(e) => handleEditChange('contactInfo.phone.customer', e.target.value)}
                          className="edit-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Hours:</label>
                        <input
                          type="text"
                          value={displayContent.contactInfo?.phone?.hours || ''}
                          onChange={(e) => handleEditChange('contactInfo.phone.hours', e.target.value)}
                          className="edit-input"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>{displayContent.contactInfo.phone.title}</h3>
                      <p>
                        <strong>Customer Support:</strong> <a href={`tel:${displayContent.contactInfo.phone.customer}`}>{displayContent.contactInfo.phone.customer}</a><br />
                        <strong>Working Hours:</strong> {displayContent.contactInfo.phone.hours}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Email Card */}
            {displayContent.contactInfo?.email && (
              <div className="contact-card">
                <div className="contact-icon">
                  <FaEnvelope />
                </div>
                <div className="contact-details">
                  {editMode ? (
                    <>
                      <div className="form-group">
                        <label>Title:</label>
                        <input
                          type="text"
                          value={displayContent.contactInfo?.email?.title || ''}
                          onChange={(e) => handleEditChange('contactInfo.email.title', e.target.value)}
                          className="edit-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>General Email:</label>
                        <input
                          type="email"
                          value={displayContent.contactInfo?.email?.general || ''}
                          onChange={(e) => handleEditChange('contactInfo.email.general', e.target.value)}
                          className="edit-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Partnership Email:</label>
                        <input
                          type="email"
                          value={displayContent.contactInfo?.email?.partnership || ''}
                          onChange={(e) => handleEditChange('contactInfo.email.partnership', e.target.value)}
                          className="edit-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Security Email:</label>
                        <input
                          type="email"
                          value={displayContent.contactInfo?.email?.security || ''}
                          onChange={(e) => handleEditChange('contactInfo.email.security', e.target.value)}
                          className="edit-input"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>{displayContent.contactInfo.email.title}</h3>
                      <p>
                        <strong>General Inquiries:</strong> <a href={`mailto:${displayContent.contactInfo.email.general}`}>{displayContent.contactInfo.email.general}</a><br />
                        {displayContent.contactInfo.email.partnership && (
                          <>
                            <strong>Merchant Partnerships:</strong> <a href={`mailto:${displayContent.contactInfo.email.partnership}`}>{displayContent.contactInfo.email.partnership}</a><br />
                          </>
                        )}
                        {displayContent.contactInfo.email.security && (
                          <>
                            <strong>Security Concerns:</strong> <a href={`mailto:${displayContent.contactInfo.email.security}`}>{displayContent.contactInfo.email.security}</a>
                          </>
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* WhatsApp Card */}
            {displayContent.contactInfo?.phone && (
              <div className="contact-card">
                <div className="contact-icon">
                  <FaWhatsapp />
                </div>
                <div className="contact-details">
                  <h3>WhatsApp Support</h3>
                  <p>
                    Quick solutions to your queries via WhatsApp<br />
                    <a href={`https://wa.me/${displayContent.contactInfo.phone.customer.replace(/[^0-9]/g, '')}`} className="whatsapp-button">
                      <FaWhatsapp /> Chat with Us
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Social Media Card */}
            {displayContent.socialLinks && displayContent.socialLinks.length > 0 && (
              <div className="social-card">
                <h3>Connect With Us</h3>
                <div className="social-links">
                  {displayContent.socialLinks.map((social, index) => (
                    <a 
                      key={index}
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`social-link ${social.platform.toLowerCase()}`}
                      title={`Follow us on ${social.platform}`}
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
                {editMode && (
                  <div className="edit-social-links">
                    <h4>Edit Social Links</h4>
                    {displayContent.socialLinks.map((social, index) => (
                      <div key={index} className="social-edit-item">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Platform:</label>
                            <input
                              type="text"
                              value={social.platform}
                              onChange={(e) => {
                                const updatedLinks = [...displayContent.socialLinks];
                                updatedLinks[index] = {
                                  ...updatedLinks[index],
                                  platform: e.target.value
                                };
                                handleEditChange('socialLinks', updatedLinks);
                              }}
                              className="edit-input"
                            />
                          </div>
                          <div className="form-group">
                            <label>URL:</label>
                            <input
                              type="url"
                              value={social.url}
                              onChange={(e) => {
                                const updatedLinks = [...displayContent.socialLinks];
                                updatedLinks[index] = {
                                  ...updatedLinks[index],
                                  url: e.target.value
                                };
                                handleEditChange('socialLinks', updatedLinks);
                              }}
                              className="edit-input"
                            />
                          </div>
                        </div>
                        <button 
                          className="remove-btn"
                          onClick={() => {
                            const updatedLinks = [...displayContent.socialLinks];
                            updatedLinks.splice(index, 1);
                            handleEditChange('socialLinks', updatedLinks);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button 
                      className="add-btn"
                      onClick={() => {
                        const updatedLinks = [...displayContent.socialLinks];
                        updatedLinks.push({ platform: 'New Platform', url: 'https://' });
                        handleEditChange('socialLinks', updatedLinks);
                      }}
                    >
                      Add Social Link
                    </button>
                  </div>
                )}
                <p>Follow us on social media for updates, offers, and more!</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        {displayContent.mapLocation && (
          <div className="map-section">
            <h2>Find Us</h2>
            {editMode && (
              <div className="map-edit-section">
                <div className="form-group">
                  <label>Latitude:</label>
                  <input
                    type="text"
                    value={displayContent.mapLocation?.lat || ''}
                    onChange={(e) => handleEditChange('mapLocation.lat', e.target.value)}
                    placeholder="e.g., 12.9895"
                    className="edit-input"
                  />
                </div>
                <div className="form-group">
                  <label>Longitude:</label>
                  <input
                    type="text"
                    value={displayContent.mapLocation?.lng || ''}
                    onChange={(e) => handleEditChange('mapLocation.lng', e.target.value)}
                    placeholder="e.g., 77.5090"
                    className="edit-input"
                  />
                </div>
                <div className="form-group">
                  <label>Google Maps Embed URL:</label>
                  <textarea
                    value={displayContent.mapLocation?.embedUrl || ''}
                    onChange={(e) => handleEditChange('mapLocation.embedUrl', e.target.value)}
                    placeholder="Paste Google Maps embed URL here"
                    rows={3}
                    className="edit-input"
                  />
                  <div className="hint-text">
                    Get this URL from Google Maps by clicking "Share" , "Embed a map" , Copy HTML
                  </div>
                </div>
              </div>
            )}
            <div className="map-container">
              <iframe
                src={displayContent.mapLocation.embedUrl}
                width="100%"
                height="450"
                style={{border: 0}}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ZappCart Office Location"
              ></iframe>
            </div>
            <div className="map-directions">
              <p>
                <strong>{displayContent.contactInfo?.address?.title || 'Our Location'}</strong><br />
                {displayContent.contactInfo?.address?.line1}<br />
                {displayContent.contactInfo?.address?.line2}<br />
                {displayContent.contactInfo?.address?.line3}
              </p>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${displayContent.contactInfo?.address?.line1}, ${displayContent.contactInfo?.address?.line2}, ${displayContent.contactInfo?.address?.line3}`)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="directions-button"
              >
                Get Directions
              </a>
            </div>
          </div>
        )}

        {editMode && (
          <div className="additional-fields-section">
            <h2>Additional Information</h2>
            <p>Add any additional fields that aren't covered by the standard sections:</p>
            
            <div className="form-group">
              <label>Field Name:</label>
              <input
                type="text"
                id="newFieldName"
                className="edit-input"
                placeholder="Enter new field name"
              />
            </div>
            
            <div className="form-group">
              <label>Field Value:</label>
              <input
                type="text"
                id="newFieldValue"
                className="edit-input"
                placeholder="Enter new field value"
              />
            </div>
            
            <button 
              className="add-field-btn"
              onClick={() => {
                const fieldName = document.getElementById('newFieldName').value.trim();
                const fieldValue = document.getElementById('newFieldValue').value.trim();
                
                if (fieldName && fieldValue) {
                  // Add the new field to editContent at the top level
                  handleEditChange(fieldName, fieldValue);
                  
                  // Clear the input fields
                  document.getElementById('newFieldName').value = '';
                  document.getElementById('newFieldValue').value = '';
                }
              }}
            >
              Add Field
            </button>
            
            {/* Display current custom fields */}
            {Object.entries(displayContent).filter(([key]) => 
              !['hero', 'contactInfo', 'socialLinks', 'mapLocation'].includes(key)
            ).map(([key, value]) => (
              <div key={key} className="custom-field">
                <div className="form-row">
                  <div className="form-group">
                    <label>Field Name:</label>
                    <input
                      type="text"
                      value={key}
                      readOnly
                      className="edit-input readonly"
                    />
                  </div>
                  <div className="form-group">
                    <label>Field Value:</label>
                    <input
                      type="text"
                      value={typeof value === 'object' ? JSON.stringify(value) : value}
                      onChange={(e) => handleEditChange(key, e.target.value)}
                      className="edit-input"
                    />
                  </div>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => {
                    const updatedContent = { ...displayContent };
                    delete updatedContent[key];
                    setEditContent(updatedContent);
                  }}
                >
                  Remove Field
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="contact-footer">
        <p>© 2025 ZappCart | TAZATA BUTCHERS PRIVATE LIMITED</p>
        <Link to="/" className="footer-home-link">Return to Main Website</Link>
      </footer>

      <style jsx>{`
        .contact-page-container {
          font-family: 'Arial', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          color: #333;
          line-height: 1.6;
        }

        .contact-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }

        .edit-controls {
          display: flex;
          gap: 10px;
        }

        .edit-btn, .save-btn, .cancel-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 8px 15px;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }

        .edit-btn {
          background-color: #4a90e2;
          color: white;
        }

        .save-btn {
          background-color: #2ecc71;
          color: white;
        }

        .cancel-btn {
          background-color: #e74c3c;
          color: white;
        }

        .edit-btn:hover, .save-btn:hover, .cancel-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }

        .edit-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .edit-input.readonly {
          background-color: #f8f8f8;
          cursor: not-allowed;
        }

        .social-edit-item, .faq-edit-item, .custom-field {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          border: 1px solid #e9ecef;
        }

        .add-btn, .remove-btn, .add-field-btn {
          background-color: #4a90e2;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          margin: 10px 0;
          transition: all 0.3s;
        }

        .remove-btn {
          background-color: #e74c3c;
        }

        .add-btn:hover, .remove-btn:hover, .add-field-btn:hover {
          opacity: 0.9;
        }

        .map-edit-section, .additional-fields-section, .add-faq-section {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #e9ecef;
        }

        .hint-text {
          font-size: 12px;
          color: #6c757d;
          margin-top: 5px;
          font-style: italic;
        }

        .back-link {
          display: flex;
          align-items: center;
          color:rgb(247, 241, 242);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }

        .back-link:hover {
          color:rgb(241, 234, 235);
        }

        .back-link svg {
          margin-right: 8px;
        }

        .contact-content {
          padding: 40px 0;
        }

        .contact-banner {
          text-align: center;
          margin-bottom: 50px;
        }

        .hero-image {
          max-width: 100%;
          margin: 0 auto 30px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          max-height: 400px;
        }

        .hero-image img {
          width: 100%;
          display: block;
        }

        .contact-banner h1 {
          font-size: 3rem;
          color: #1d3557;
          margin-bottom: 15px;
        }

        .contact-banner p {
          font-size: 1.2rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-grid {
          display: grid;
          gap: 40px;
          margin-bottom: 60px;
        }

        .contact-info-section {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .contact-card {
          display: flex;
          align-items: flex-start;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s;
          height: 100%;
        }

        .contact-card:hover {
          transform: translateY(-5px);
        }

        .contact-icon {
          background-color: #e63946;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          flex-shrink: 0;
        }

        .contact-icon svg {
          font-size: 1.3rem;
        }

        .contact-details h3 {
          margin: 0 0 10px;
          color: #1d3557;
          font-size: 1.2rem;
        }

        .contact-details p {
          margin: 0;
          color: #555;
          font-size: 0.95rem;
        }

        .contact-details a {
          color: #e63946;
          text-decoration: none;
          transition: color 0.3s;
        }

        .contact-details a:hover {
          color: #c1121f;
          text-decoration: underline;
        }

        .whatsapp-button {
          display: inline-flex;
          align-items: center;
          background-color: #25D366;
          color: white !important;
          padding: 8px 15px;
          border-radius: 20px;
          margin-top: 10px;
          text-decoration: none !important;
          font-weight: 600;
          transition: background-color 0.3s !important;
        }

        .whatsapp-button:hover {
          background-color: #128C7E;
          text-decoration: none !important;
        }

        .whatsapp-button svg {
          margin-right: 5px;
        }

        .social-card {
          background-color: #1d3557;
          color: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          text-align: center;
          grid-column: span 2;
        }

        .social-card h3 {
          margin: 0 0 15px;
          font-size: 1.2rem;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          font-size: 1.2rem;
          transition: transform 0.3s, background-color 0.3s;
        }

        .social-link:hover {
          transform: translateY(-3px);
        }

        .social-link.twitter {
          background-color: #1DA1F2;
        }

        .social-link.linkedin {
          background-color: #0077B5;
        }

        .social-link.instagram {
          background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D);
        }

        .social-card p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .contact-form-section {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
        }

        .form-container {
          padding: 30px;
        }

        .form-container h2 {
          margin: 0 0 10px;
          color: #1d3557;
          font-size: 1.8rem;
        }

        .form-container > p {
          margin-bottom: 25px;
          color: #555;
        }

        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 12px;
          border-radius: 5px;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .success-message {
          background-color: #e8f5e9;
          color: #2e7d32;
          padding: 12px;
          border-radius: 5px;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: flex;
          gap: 20px;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          margin-bottom: 8px;
          color: #1d3557;
          font-weight: 500;
        }

        .form-group input,
        .form-group textarea {
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: #1d3557;
          outline: none;
        }

        .submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e63946;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 5px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
          align-self: flex-start;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #c1121f;
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submit-button svg {
          margin-right: 8px;
        }

        .form-note {
          font-size: 0.85rem;
          color: #666;
          margin-top: 5px;
        }

        .map-section {
          margin-bottom: 60px;
        }

        .map-section h2 {
          text-align: center;
          color: #1d3557;
          font-size: 1.8rem;
          margin-bottom: 20px;
        }

        .map-container {
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
          border: 2px solid #e63946;
        }

        .map-directions {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-top: 20px;
          text-align: center;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
        }
        
        .map-directions p {
          margin-bottom: 15px;
          font-size: 1.1rem;
          color: #1d3557;
        }
        
        .directions-button {
          display: inline-block;
          background-color: #e63946;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          font-weight: 600;
          transition: background-color 0.3s;
        }
        
        .directions-button:hover {
          background-color: #c1121f;
        }

        .faq-section {
          margin-bottom: 40px;
        }

        .faq-section h2 {
          text-align: center;
          color: #1d3557;
          font-size: 1.8rem;
          margin-bottom: 30px;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
          gap: 20px;
        }

        .faq-item {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          border-left: 3px solid #e63946;
        }

        .faq-item h3 {
          margin: 0 0 10px;
          color: #1d3557;
          font-size: 1.1rem;
        }

        .faq-item p {
          margin: 0;
          color: #555;
        }

        .contact-footer {
          text-align: center;
          padding: 20px 0;
          border-top: 1px solid #eee;
          color: #666;
        }

        .footer-home-link {
          display: inline-block;
          margin-top: 10px;
          color: #e63946;
          text-decoration: none;
        }

        .footer-home-link:hover {
          text-decoration: underline;
        }

        /* Loading States */
        .loading-container {
          min-height: 100vh;
        }

        .loading-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          margin-bottom: 20px;
        }

        .spinner-icon {
          font-size: 3rem;
          color: #e63946;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .loading-section p {
          color: #64748b;
          font-size: 1.3rem;
          margin: 0;
          font-weight: 500;
        }

        /* Error States */
        .error-container {
          min-height: 100vh;
        }

        .error-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          padding: 60px 20px;
          background: #fef2f2;
          border-radius: 16px;
          margin: 20px;
          border: 2px solid #fecaca;
        }

        .error-section h2 {
          color: #dc2626;
          margin-bottom: 15px;
          font-size: 2rem;
          font-weight: 700;
        }

        .error-section p {
          color: #6b7280;
          margin-bottom: 30px;
          font-size: 1.2rem;
          max-width: 500px;
          line-height: 1.6;
        }

        .error-section button {
          background: linear-gradient(135deg, #e63946 0%, #c1121f 100%);
          color: white;
          padding: 14px 28px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .error-section button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(225, 57, 70, 0.4);
        }

        @media (max-width: 1000px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
          
          .faq-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 20px;
          }
          
          .contact-banner h1 {
            font-size: 2.2rem;
          }
          
          .contact-info-section {
            grid-template-columns: 1fr;
          }
          
          .social-card {
            grid-column: 1;
          }
        }

        @media (max-width: 600px) {
          .contact-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .contact-banner h1 {
            font-size: 1.8rem;
          }
          
          .contact-banner p {
            font-size: 1rem;
          }
          
          .submit-button {
            width: 100%;
          }
          
          .contact-details p {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;

