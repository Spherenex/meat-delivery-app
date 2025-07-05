


// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ref as dbRef, onValue } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/components/Blog.css';
// import { 
//   FaArrowLeft, 
//   FaSpinner, 
//   FaExclamationTriangle
// } from 'react-icons/fa';

// // Import the Coming Soon component
// import BlogComingSoon from './BlogComingSoon';

// const Blog = () => {
//   const [content, setContent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Default content as fallback
//   const defaultContent = {
//     intro: {
//       title: 'ZappCart Blog',
//       subtitle: 'Fresh insights, recipes, and meat knowledge',
//       description: 'Discover the latest news, cooking tips, and meat expertise from ZappCart.'
//     },
//     categories: ['Recipes', 'Meat Guide', 'Health & Nutrition', 'Company News'],
//     featuredPosts: [
//       {
//         id: 'post-1',
//         title: 'Best Cuts for Grilling This Season',
//         excerpt: 'Discover which meat cuts are perfect for your barbecue sessions.',
//         category: 'Meat Guide',
//         readTime: '5 min read',
//         date: '2025-01-15'
//       }
//     ],
//     comingSoon: {
//       enabled: true,
//       message: 'Our blog is coming soon! Stay tuned for amazing content about meat, recipes, and more.',
//       launchDate: '2025-02-01'
//     }
//   };

//   useEffect(() => {
//     const loadContent = () => {
//       try {
//         const contentRef = dbRef(db, 'pages/blog');
//         const unsubscribe = onValue(contentRef, (snapshot) => {
//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             console.log("Loaded blog content:", data);
//             setContent(data);
//           } else {
//             console.log("No blog content found, using default");
//             setContent(defaultContent);
//           }
//           setLoading(false);
//         }, (error) => {
//           console.error("Error loading content:", error);
//           setError(error.message);
//           setContent(defaultContent);
//           setLoading(false);
//         });

//         return unsubscribe;
//       } catch (error) {
//         console.error("Error setting up content listener:", error);
//         setError(error.message);
//         setContent(defaultContent);
//         setLoading(false);
//       }
//     };

//     const unsubscribe = loadContent();
    
//     return () => {
//       if (unsubscribe && typeof unsubscribe === 'function') {
//         unsubscribe();
//       }
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="blog-container loading-container">
//         <Link to="/" className="back-button">
//           <FaArrowLeft /> Back to Home
//         </Link>
//         <div className="loading-section">
//           <div className="loading-spinner">
//             <FaSpinner className="spinning" />
//           </div>
//           <p>Loading blog content...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !content) {
//     return (
//       <div className="blog-container error-container">
//         <Link to="/" className="back-button">
//           <FaArrowLeft /> Back to Home
//         </Link>
//         <div className="error-section">
//           <FaExclamationTriangle className="error-icon" />
//           <h2>Error Loading Content</h2>
//           <p>We're having trouble loading the blog content. Please try refreshing the page.</p>
//           <p className="error-message">{error}</p>
//           <button onClick={() => window.location.reload()} className="refresh-button">
//             Refresh Page
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const displayContent = content || defaultContent;

//   // If coming soon is enabled, show coming soon page
//   if (displayContent.comingSoon?.enabled) {
//     return <BlogComingSoon content={displayContent} />;
//   }

//   // For the main blog content when coming soon is disabled
//   // You can expand this part later
//   return (
//     <div className="blog-container">
//       <Link to="/" className="back-button">
//         <FaArrowLeft /> Back to Home
//       </Link>
      
//       <div className="blog-content">
//         <h1>Blog Content Will Go Here</h1>
//         <p>The blog is currently set to display full content mode.</p>
//         <p>To enable the coming soon page, set comingSoon.enabled to true in the admin panel.</p>
//       </div>
//     </div>
//   );
// };

// export default Blog;

// src/components/Blog.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref as dbRef, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/components/Blog.css';
import { 
  FaArrowLeft, 
  FaSpinner, 
  FaCalendarAlt, 
  FaClock, 
  FaTag, 
  FaNewspaper, 
  FaBullhorn,
  FaExclamationTriangle,
  FaTwitter,
  FaLinkedin,
  FaInstagram
} from 'react-icons/fa';

const Blog = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default content as fallback
  const defaultContent = {
    intro: {
      title: 'ZappCart Blog',
      subtitle: 'Fresh insights, recipes, and meat knowledge',
      description: 'Discover the latest news, cooking tips, and meat expertise from ZappCart.'
    },
    categories: ['Recipes', 'Meat Guide', 'Health & Nutrition', 'Company News'],
    featuredPosts: [
      {
        id: 'post-1',
        title: 'Best Cuts for Grilling This Season',
        excerpt: 'Discover which meat cuts are perfect for your barbecue sessions.',
        category: 'Meat Guide',
        // readTime: '5 min read',
        date: '2025-01-15'
      }
    ],
    comingSoon: {
      enabled: true,
      message: 'Our blog is coming soon! Stay tuned for amazing content about meat, recipes, and more.',
      launchDate: '2025-02-01',
      features: [
        'Expert meat selection and preparation guides',
        'Delicious recipes from renowned chefs',
        'Health and nutrition insights',
        'Company updates and industry news',
        'Tips for cooking perfect meals at home',
        'Seasonal cooking recommendations'
      ]
    }
  };

  useEffect(() => {
    const loadContent = () => {
      try {
        // Important: This path should match exactly with where the admin panel saves the blog data
        const contentRef = dbRef(db, 'pages/blog');
        
        console.log("Attempting to load blog content from Firebase...");
        
        const unsubscribe = onValue(contentRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            console.log("Successfully loaded blog content:", data);
            setContent(data);
          } else {
            console.log("No blog content found in Firebase, using default content");
            setContent(defaultContent);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error loading content from Firebase:", error);
          setError(error.message);
          setContent(defaultContent);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error setting up Firebase listener:", error);
        setError(error.message);
        setContent(defaultContent);
        setLoading(false);
        return null;
      }
    };

    const unsubscribe = loadContent();
    
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="blog-container">
        <Link to="/" className="back-button">
          <FaArrowLeft /> Back to Home
        </Link>
        <div className="loading-section">
          <FaSpinner className="spinning" />
          <p>Loading blog content...</p>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="blog-container">
        <Link to="/" className="back-button">
          <FaArrowLeft /> Back to Home
        </Link>
        <div className="error-section">
          <FaExclamationTriangle className="error-icon" />
          <h2>Error Loading Content</h2>
          <p>We're having trouble loading the blog content. Please try refreshing the page.</p>
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="refresh-button">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const displayContent = content || defaultContent;
  console.log("Rendering with content:", displayContent);

  // If coming soon is enabled, show coming soon page
  if (displayContent.comingSoon?.enabled) {
    return (
      <div className="blog-container">
        <Link to="/" className="back-button">
          <FaArrowLeft /> Back to Home
        </Link>
        
        <div className="blog-header">
          <div className="blog-icon">
            <FaNewspaper />
          </div>
          <h1>{displayContent.intro?.title || 'ZappCart Blog'}</h1>
        </div>
        
        <div className="coming-soon-badge">
          <FaCalendarAlt /> Coming Soon
        </div>
        
        <p className="coming-soon-message">
          {displayContent.comingSoon?.message || 
            "Our blog is coming soon! Stay tuned for amazing content about meat, recipes, and more."}
        </p>
        
        <div className="launch-date-section">
          <h2>Expected Launch Date</h2>
          <div className="launch-date">
            {formatDate(displayContent.comingSoon?.launchDate || "2025-02-01")}
          </div>
        </div>
        
        <div className="blog-features">
          <div className="features-heading">
            <FaBullhorn />
            <span>What to expect in our upcoming Blog:</span>
          </div>
          <ul className="features-list">
            {displayContent.comingSoon?.features ? (
              displayContent.comingSoon.features.map((feature, index) => (
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
            {(displayContent.categories || [
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
  }

  // Regular blog page (when coming soon is disabled)
  return (
    <div className="blog-container">
      <div className="values-header">
               <Link to="/" className="back-link">
                 <FaArrowLeft /> Back to Home
               </Link>
             </div>

      <main className="blog-content">
        {/* Hero Section */}
         <div className="hero-content">
              <h1>{displayContent.intro.title}</h1>
              <p className="hero-subtitle">{displayContent.intro.subtitle}</p>
              <p className="hero-description">{displayContent.intro.description}</p>
            </div>
        {displayContent.intro && (
          <section className="blog-hero" style={displayContent.intro.imageUrl ? { backgroundImage: `url(${displayContent.intro.imageUrl})` } : {}}>
            {/* <div className="hero-content">
              <h1>{displayContent.intro.title}</h1>
              <p className="hero-subtitle">{displayContent.intro.subtitle}</p>
              <p className="hero-description">{displayContent.intro.description}</p>
            </div> */}
          </section>
        )}

        {/* Categories */}
        {displayContent.categories && displayContent.categories.length > 0 && (
          <section className="categories-section">
            <h2>Categories</h2>
            <div className="categories-list">
              {displayContent.categories.map((category, index) => (
                <div key={index} className="category-tag">
                  <FaTag />
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Posts */}
        {displayContent.featuredPosts && displayContent.featuredPosts.length > 0 && (
          <section className="posts-section">
            <h2>Featured Articles</h2>
            <div className="posts-grid">
              {displayContent.featuredPosts.map((post, index) => (
                <article key={post.id || index} className="post-card">
                  {post.imageUrl && (
                    <div className="post-image">
                      <img src={post.imageUrl} alt={post.title} />
                    </div>
                  )}
                  <div className="post-header">
                    <div className="post-category">
                      <FaTag />
                      <span>{post.category}</span>
                    </div>
                    <div className="post-meta">
                      <span className="post-date">
                        <FaCalendarAlt />
                        {formatDate(post.date)}
                      </span>
                      {/* <span className="post-read-time">
                        <FaClock />
                        {post.readTime}
                      </span> */}
                    </div>
                  </div>
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                  {/* <div className="post-footer">
                    <button 
                      className="read-more-btn"
                      onClick={() => alert('Full article feature coming soon!')}
                    >
                      Read More
                    </button>
                  </div> */}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        {/* <section className="newsletter-section">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Get notified when we publish new articles and recipes!</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
              />
              <button onClick={() => alert('Newsletter subscription feature coming soon!')}>
                Subscribe
              </button>
            </div>
          </div>
        </section> */}
      </main>

      <footer className="blog-footer">
        <p>© 2025 ZappCart | TAZATA BUTCHERS PRIVATE LIMITED</p>
      </footer>
    </div>
  );
};

export default Blog;