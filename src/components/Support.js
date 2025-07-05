
// Description: Updated support component with Firebase integration for dynamic content

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ref as dbRef, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import { 
  FaArrowLeft, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaQuestionCircle, 
  FaBoxOpen, 
  FaTruck, 
  FaMoneyBillWave, 
  FaUserCircle, 
  FaWhatsapp, 
  FaSpinner,
  FaChevronDown
} from 'react-icons/fa';

const Support = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Default content as fallback
  const defaultContent = {
    hero: {
      title: 'How Can We Help You?',
      subtitle: 'Find answers to frequently asked questions or reach out to our support team'
    },
    contactMethods: [
      {
        id: 'phone',
        title: 'Call Us',
        value: '+91 8722237574',
        description: '7 AM - 10 PM, All days',
        icon: 'phone'
      },
      {
        id: 'email',
        title: 'Email Support',
        value: 'official.tazatabutchers@gmail.com',
        description: 'Response within 24 hours',
        icon: 'email'
      },
      {
        id: 'whatsapp',
        title: 'WhatsApp',
        value: '+91 8722237574',
        description: 'Quick support via WhatsApp',
        icon: 'whatsapp'
      }
    ],
    faqCategories: [
      {
        id: 'ordering',
        name: 'Ordering',
        faqs: [
          {
            question: 'How do I place an order on ZappCart?',
            answer: 'Ordering on ZappCart is simple! Download our app from the App Store or Google Play, create an account, browse through available meat products, add items to your cart, and proceed to checkout. Your fresh meat will be delivered to your doorstep in under 60 minutes.'
          },
          {
            question: 'What areas do you serve?',
            answer: 'ZappCart currently serves most areas in Bengaluru. When you open the app, it will automatically detect if we deliver to your location. We\'re constantly expanding our service areas, so check back soon if we don\'t yet deliver to your neighborhood.'
          }
        ]
      },
      {
        id: 'delivery',
        name: 'Delivery',
        faqs: [
          {
            question: 'How long does delivery take?',
            answer: 'ZappCart promises delivery within 60 minutes after order placement in most service areas. Actual delivery times may vary slightly depending on your location, traffic conditions, and order volume, but we strive to be as quick as possible.'
          }
        ]
      }
    ]
  };

  // Map of category IDs to icons
  const categoryIcons = {
    'ordering': <FaQuestionCircle />,
    'delivery': <FaTruck />,
    'product': <FaBoxOpen />,
    'payment': <FaMoneyBillWave />,
    'account': <FaUserCircle />
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadContent = () => {
      try {
        const contentRef = dbRef(db, 'pages/support');
        const unsubscribe = onValue(contentRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setContent(data);
            
            // Set the first category as active if none is selected
            if (!activeCategory && data.faqCategories && data.faqCategories.length > 0) {
              setActiveCategory(data.faqCategories[0].id);
            }
          } else {
            setContent(defaultContent);
            
            // Set the first category as active if none is selected
            if (!activeCategory && defaultContent.faqCategories && defaultContent.faqCategories.length > 0) {
              setActiveCategory(defaultContent.faqCategories[0].id);
            }
          }
          setLoading(false);
        }, (error) => {
          console.error("Error loading content:", error);
          setError(error.message);
          setContent(defaultContent);
          
          // Set the first category as active if none is selected
          if (!activeCategory && defaultContent.faqCategories && defaultContent.faqCategories.length > 0) {
            setActiveCategory(defaultContent.faqCategories[0].id);
          }
          
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error setting up content listener:", error);
        setError(error.message);
        setContent(defaultContent);
        
        // Set the first category as active if none is selected
        if (!activeCategory && defaultContent.faqCategories && defaultContent.faqCategories.length > 0) {
          setActiveCategory(defaultContent.faqCategories[0].id);
        }
        
        setLoading(false);
      }
    };

    const unsubscribe = loadContent();
    
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [activeCategory]);

  const getIconComponent = (iconType) => {
    switch(iconType) {
      case 'phone':
        return <FaPhoneAlt />;
      case 'email':
        return <FaEnvelope />;
      case 'whatsapp':
        return <FaWhatsapp />;
      default:
        return <FaPhoneAlt />;
    }
  };

  const getCategoryIcon = (categoryId) => {
    return categoryIcons[categoryId] || <FaQuestionCircle />;
  };

  const getCurrentFaqs = () => {
    if (!activeCategory) return [];
    
    const displayContent = content || defaultContent;
    const category = displayContent.faqCategories?.find(cat => cat.id === activeCategory);
    return category?.faqs || [];
  };

  const getCurrentCategoryName = () => {
    if (!activeCategory) return 'Select Category';
    
    const displayContent = content || defaultContent;
    const category = displayContent.faqCategories?.find(cat => cat.id === activeCategory);
    return category?.name || 'Select Category';
  };

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    setShowCategoryDropdown(false);
  };

  if (loading) {
    return (
      <div className="support-container loading-container">
        <div className="support-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        <div className="loading-section">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
          </div>
          <p>Loading support content...</p>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="support-container error-container">
        <div className="support-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        <div className="error-section">
          <h2>Error Loading Content</h2>
          <p>We're having trouble loading the support content. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      </div>
    );
  }

  const displayContent = content || defaultContent;

  return (
    <div className="support-container">
      <header className="support-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
      </header>

      <main className="support-content">
        <div className="support-banner">
          <h1>{displayContent.hero?.title || 'How Can We Help You?'}</h1>
          <p>{displayContent.hero?.subtitle || 'Find answers to frequently asked questions or reach out to our support team'}</p>
        </div>

        <div className="support-contact-bar">
          {(displayContent.contactMethods || []).map((method) => (
            <div key={method.id} className="contact-method">
              {getIconComponent(method.icon)}
              <div className="contact-info">
                <h3>{method.title}</h3>
                <p>
                  {method.id === 'phone' ? (
                    <a href={`tel:${method.value}`}>{method.value}</a>
                  ) : method.id === 'email' ? (
                    <a href={`mailto:${method.value}`}>{method.value}</a>
                  ) : method.id === 'whatsapp' ? (
                    <a href={`https://wa.me/${method.value.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">{method.value}</a>
                  ) : (
                    method.value
                  )}
                </p>
                <span>{method.description}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          
          {/* Mobile dropdown for categories */}
          <div className="category-dropdown-container" ref={dropdownRef}>
            <button 
              className="category-dropdown-button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              {activeCategory && getCategoryIcon(activeCategory)}
              <span>{getCurrentCategoryName()}</span>
              <FaChevronDown className={`dropdown-arrow ${showCategoryDropdown ? 'open' : ''}`} />
            </button>
            
            {showCategoryDropdown && (
              <div className="category-dropdown">
                {displayContent.faqCategories?.map((category) => (
                  <button 
                    key={category.id}
                    className={`dropdown-item ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    {getCategoryIcon(category.id)}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="faq-container">
            <div className="faq-categories desktop-categories">
              {displayContent.faqCategories?.map((category) => (
                <button 
                  key={category.id}
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {/* {getCategoryIcon(category.id)} */}
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
            
            <div className="faq-questions">
              {getCurrentFaqs().length > 0 ? (
                getCurrentFaqs().map((faq, index) => (
                  <details key={index} className="faq-item">
                    <summary className="faq-question">{faq.question}</summary>
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))
              ) : (
                <div className="no-faqs">
                  <p>No FAQs available for this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="support-footer">
        <p>© 2025 ZappCart | TAZATA BUTCHERS PRIVATE LIMITED</p>
        <Link to="/" className="footer-home-link">Return to Main Website</Link>
      </footer>

      <style jsx>{`
        .support-container {
          font-family: 'Arial', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          color: #333;
          line-height: 1.6;
        }

        .support-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }

        .back-link {
          display: flex;
          align-items: center;
          color:rgb(250, 246, 246);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }

        .back-link:hover {
          color: #c1121f;
        }

        .back-link svg {
          margin-right: 8px;
        }

        .support-content {
          padding: 40px 0;
        }

        .support-banner {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px 20px;
          background-color: #f8f9fa;
          border-radius: 10px;
        }

        .support-banner h1 {
          font-size: 2.6rem;
          color: #1d3557;
          margin-bottom: 15px;
        }

        .support-banner p {
          font-size: 1.2rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        .support-contact-bar {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 50px;
        }

        .contact-method {
          display: flex;
          align-items: center;
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
          min-width: 300px;
        }

        .contact-method svg {
          font-size: 2rem;
          color: #e63946;
          margin-right: 20px;
        }

        .contact-info h3 {
          margin: 0 0 5px;
          color: #1d3557;
          font-size: 1.1rem;
        }

        .contact-info p {
          margin: 0 0 5px;
          font-weight: 600;
          color: #333;
        }

        .contact-info a {
          color: #e63946;
          text-decoration: none;
        }

        .contact-info a:hover {
          text-decoration: underline;
        }

        .contact-info span {
          font-size: 0.85rem;
          color: #666;
        }

        .faq-section {
          margin-bottom: 50px;
        }

        .faq-section h2 {
          text-align: center;
          font-size: 2rem;
          color: #1d3557;
          margin-bottom: 30px;
        }

        /* Category Dropdown (Mobile) */
        .category-dropdown-container {
          position: relative;
          margin-bottom: 20px;
          display: none; /* Hidden on desktop */
        }

        .category-dropdown-button {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 15px;
          background-color: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 8px;
          text-align: left;
          cursor: pointer;
          font-weight: 600;
          color: #1d3557;
        }

        .category-dropdown-button svg:first-child {
          margin-right: 10px;
          font-size: 1.2rem;
          color: #e63946;
        }

        .dropdown-arrow {
          margin-left: auto;
          transition: transform 0.3s ease;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .category-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 10;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-height: 300px;
          overflow-y: auto;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 15px;
          border: none;
          border-bottom: 1px solid #eee;
          background: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .dropdown-item:hover {
          background-color: #f8f9fa;
        }

        .dropdown-item.active {
          background-color: #e63946;
          color: white;
        }

        .dropdown-item svg {
          margin-right: 10px;
          font-size: 1.1rem;
        }

        .faq-container {
          display: flex;
          gap: 30px;
          background-color: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
        }

        .faq-categories {
          flex: 0 0 250px;
          background-color: #f8f9fa;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
        }

        .category-btn {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s;
          color: #555;
          font-weight: 500;
        }

        .category-btn svg {
          margin-right: 10px;
          font-size: 1.1rem;
        }

        .category-btn:hover {
          background-color: #e6e6e6;
        }

        .category-btn.active {
          background-color: #e63946;
          color: white;
        }

        .faq-questions {
          flex: 1;
          padding: 30px;
        }

        .no-faqs {
          padding: 20px 0;
          text-align: center;
          color: #666;
        }

        .faq-item {
          border-bottom: 1px solid #eee;
          margin-bottom: 15px;
        }

        .faq-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .faq-question {
          font-weight: 600;
          color: #1d3557;
          padding: 15px 0;
          cursor: pointer;
          position: relative;
          list-style: none;
        }

        .faq-question::-webkit-details-marker {
          display: none;
        }

        .faq-question::after {
          content: '+';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.5rem;
          color: #e63946;
        }

        details[open] .faq-question::after {
          content: '−';
        }

        .faq-answer {
          padding: 0 0 15px;
        }

        .faq-answer p {
          margin: 0;
          color: #555;
        }

        .support-footer {
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

        @media (max-width: 900px) {
          .support-contact-bar {
            flex-direction: column;
            align-items: center;
          }

          .contact-method {
            width: 100%;
            max-width: 500px;
          }

          .faq-container {
            flex-direction: column;
          }

          /* Hide desktop categories and show dropdown on mobile */
          .desktop-categories {
            display: none;
          }

          .category-dropdown-container {
            display: block;
          }
        }

        @media (max-width: 600px) {
          .support-banner h1 {
            font-size: 2rem;
          }
          
          .support-banner p {
            font-size: 1rem;
          }
          
          .faq-question {
            padding-right: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Support;