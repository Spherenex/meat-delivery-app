import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Blog.css';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaBullhorn, 
  FaTag, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram,
  FaNewspaper
} from 'react-icons/fa';

const BlogComingSoon = ({ content }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="blog-container">
      <Link to="/" className="back-button">
        <FaArrowLeft /> Back to Home
      </Link>
      
      <div className="blog-header">
        <div className="blog-icon">
          <FaNewspaper />
        </div>
        <h1>ZappCart Blog</h1>
      </div>
      
      <div className="coming-soon-badge">
        <FaCalendarAlt /> Coming Soon
      </div>
      
      <p className="coming-soon-message">
        {content.comingSoon?.message || 
          "Our blog is coming soon! Stay tuned for amazing content about meat, recipes, and more."}
      </p>
      
      <div className="launch-date-section">
        <h2>Expected Launch Date</h2>
        <div className="launch-date">
          {formatDate(content.comingSoon?.launchDate || "2025-02-01")}
        </div>
      </div>
      
      <div className="blog-features">
        <div className="features-heading">
          <FaBullhorn />
          <span>What to expect in our upcoming Blog:</span>
        </div>
        <ul className="features-list">
          {content.comingSoon?.features ? (
            content.comingSoon.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))
          ) : (
            <>
              <li>Expert meat selection and preparation guides</li>
              <li>Delicious recipes from renowned chefs</li>
              <li>Health and nutrition insights</li>
              <li>Company updates and industry news</li>
              <li>Tips for cooking perfect meals at home</li>
              <li>Seasonal cooking recommendations</li>
            </>
          )}
        </ul>
      </div>
      
      <div className="categories-section">
        <h2>Upcoming Categories</h2>
        <div className="categories-list">
          {(content.categories || [
            'Recipes', 
            'Meat Guide', 
            'Health & Nutrition', 
            'Company News'
          ]).map((category, index) => (
            <div key={index} className="category-tag">
              <FaTag />
              <span>{category}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="stay-updated-section">
        <h2>Stay Updated</h2>
        <p className="stay-updated-text">Be the first to know when our blog launches!</p>
        
        <div className="social-links-container">
          <a href="https://x.com/zappcart" target="_blank" rel="noopener noreferrer" className="social-link">
            <div className="social-icon twitter">
              <FaTwitter />
            </div>
            <span className="social-name">Follow on Twitter</span>
          </a>
          
          <a href="https://www.linkedin.com/in/zapp-cart-31b9aa365/" target="_blank" rel="noopener noreferrer" className="social-link">
            <div className="social-icon linkedin">
              <FaLinkedin />
            </div>
            <span className="social-name">Connect on LinkedIn</span>
          </a>
          
          <a href="https://www.instagram.com/_zappcart/" target="_blank" rel="noopener noreferrer" className="social-link">
            <div className="social-icon instagram">
              <FaInstagram />
            </div>
            <span className="social-name">Follow on Instagram</span>
          </a>
        </div>
      </div>
      
      <div className="blog-footer">
        <p>© 2025 ZappCart | TAZATA BUTCHERS PRIVATE LIMITED</p>
      </div>
    </div>
  );
};

export default BlogComingSoon;