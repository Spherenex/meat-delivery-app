



// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ref as dbRef, onValue } from 'firebase/database';
// import { db } from '../firebase/config';
// import logoImage from '../assets/images/logo1.png';
// import { FaArrowLeft, FaNewspaper, FaCalendarAlt, FaBullhorn, FaLinkedinIn, FaTwitter, FaInstagram, FaSpinner } from 'react-icons/fa';

// const Newsroom = () => {
//   const [content, setContent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Default content as fallback
//   const defaultContent = {
//     hero: {
//       title: 'ZappCart Newsroom',
//       subtitle: 'Latest news, announcements, and media resources'
//     },
//     comingSoon: {
//       enabled: true,
//       message: 'We\'re preparing a dedicated space to share our latest news, announcements, and media resources with you.',
//       features: [
//         'Latest ZappCart announcements and press releases',
//         'Expansion updates as we grow across Bengaluru',
//         'Media coverage and featured stories',
//         'Downloadable resources for media partners',
//         'Company milestones and achievements'
//       ]
//     },
//     socialLinks: [
//       { platform: 'Twitter', url: 'https://x.com/zappcart' },
//       { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/zapp-cart-31b9aa365/' },
//       { platform: 'Instagram', url: 'https://www.instagram.com/_zappcart/' }
//     ],
//     pressReleases: [],
//     mediaKit: {
//       available: false,
//       description: 'Media resources and brand assets will be available here soon.'
//     }
//   };

//   useEffect(() => {
//     const loadContent = () => {
//       try {
//         const contentRef = dbRef(db, 'pages/newsroom');
//         const unsubscribe = onValue(contentRef, (snapshot) => {
//           if (snapshot.exists()) {
//             const data = snapshot.val();
            
//             // Check if the data has the old format with 'articles' instead of 'pressReleases'
//             if (data.articles && (!data.pressReleases || data.pressReleases.length === 0)) {
//               // Convert articles to pressReleases format
//               data.pressReleases = data.articles.map(article => ({
//                 title: article.title,
//                 date: article.date,
//                 excerpt: article.summary || article.excerpt,
//                 content: article.content,
//                 imageUrl: article.imageUrl,
//                 link: article.source || article.link || '#'
//               }));
//             }
            
//             setContent(data);
//           } else {
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

//   const getSocialIcon = (platform) => {
//     switch(platform.toLowerCase()) {
//       case 'twitter':
//         return <FaTwitter />;
//       case 'linkedin':
//         return <FaLinkedinIn />;
//       case 'instagram':
//         return <FaInstagram />;
//       default:
//         return <FaNewspaper />;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="newsroom-container loading-container">
//         <div className="newsroom-header">
//           <Link to="/" className="back-link">
//             <FaArrowLeft /> Back to Home
//           </Link>
//         </div>
//         <div className="loading-section">
//           <div className="loading-spinner">
//             <FaSpinner className="spinner-icon" />
//           </div>
//           <p>Loading newsroom content...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !content) {
//     return (
//       <div className="newsroom-container error-container">
//         <div className="newsroom-header">
//           <Link to="/" className="back-link">
//             <FaArrowLeft /> Back to Home
//           </Link>
//         </div>
//         <div className="error-section">
//           <h2>Error Loading Content</h2>
//           <p>We're having trouble loading the newsroom content. Please try refreshing the page.</p>
//           <button onClick={() => window.location.reload()}>Refresh Page</button>
//         </div>
//       </div>
//     );
//   }

//   const displayContent = content || defaultContent;

//   // If coming soon is enabled or no press releases, show coming soon page
//   if (displayContent.comingSoon?.enabled || !displayContent.pressReleases || displayContent.pressReleases.length === 0) {
//     return (
//       <div className="newsroom-container">
//         <header className="newsroom-header">
//           <Link to="/" className="back-link">
//             <FaArrowLeft /> Back to Home
//           </Link>
//         </header>

//         <main className="newsroom-content">
//           <div className="coming-soon-wrapper">
//             <div className="coming-soon-icon">
//               <FaNewspaper />
//             </div>
//             <h1>{displayContent.hero?.title || 'ZappCart Newsroom'}</h1>
//             <div className="coming-soon-badge">
//               <FaCalendarAlt /> Coming Soon
//             </div>
//             <p className="coming-soon-message">
//               {displayContent.comingSoon?.message || 'We\'re preparing a dedicated space to share our latest news, announcements, and media resources with you.'}
//             </p>
            
//             <div className="coming-soon-details">
//               <div className="detail-item">
//                 <FaBullhorn />
//                 <h3>What to expect in our upcoming Newsroom:</h3>
//                 <ul>
//                   {(displayContent.comingSoon?.features || []).map((feature, index) => (
//                     <li key={index}>{feature}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             <div className="media-preview">
//               <h3>Media Highlights</h3>
//               <div className="highlights-grid">
//                 <div className="highlight-card">
//                   <div className="highlight-icon">📈</div>
//                   <h4>Growth Stories</h4>
//                   <p>Follow our journey as we expand across Bengaluru and beyond</p>
//                 </div>
//                 <div className="highlight-card">
//                   <div className="highlight-icon">🏆</div>
//                   <h4>Awards & Recognition</h4>
//                   <p>Celebrating our achievements in the food delivery industry</p>
//                 </div>
//                 <div className="highlight-card">
//                   <div className="highlight-icon">🤝</div>
//                   <h4>Partnerships</h4>
//                   <p>Announcements about our strategic partnerships and collaborations</p>
//                 </div>
//               </div>
//             </div>

//             <div className="subscribe-section">
//               <h3>Be the first to know</h3>
//               <p>Want updates when our Newsroom launches? Follow us on social media:</p>
//               <div className="social-links">
//                 {(displayContent.socialLinks || []).map((social, index) => (
//                   <a 
//                     key={index}
//                     href={social.url} 
//                     target="_blank" 
//                     rel="noopener noreferrer" 
//                     className="social-link"
//                     title={`Follow us on ${social.platform}`}
//                   >
//                     {getSocialIcon(social.platform)}
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </main>

//         <footer className="newsroom-footer">
//           <p>© 2025 ZappCart | TAZATA BUTCHERS PRIVATE LIMITED</p>
//           <Link to="/" className="footer-home-link">Return to Main Website</Link>
//         </footer>

//         <style jsx>{`
//           .newsroom-container {
//             font-family: 'Arial', sans-serif;
//             max-width: 1200px;
//             margin: 0 auto;
//             padding: 0 20px;
//             color: #333;
//             line-height: 1.6;
//           }

//           .newsroom-header {
//             display: flex;
//             justify-content: space-between;
//             align-items: center;
//             padding: 20px 0;
//             border-bottom: 1px solid #eee;
//           }

//           .back-link {
//             display: flex;
//             align-items: center;
//             color:rgb(252, 249, 250);
//             text-decoration: none;
//             font-weight: 600;
//             transition: color 0.3s;
//           }

//           .back-link:hover {
//             color: #c1121f;
//           }

//           .back-link svg {
//             margin-right: 8px;
//           }

//           .newsroom-content {
//             padding: 40px 0;
//             min-height: 70vh;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           }

//           .coming-soon-wrapper {
//             text-align: center;
//             max-width: 800px;
//             margin: 0 auto;
//             padding: 60px 20px;
//             background-color: #fff;
//             border-radius: 15px;
//             box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
//           }

//           .coming-soon-icon {
//             font-size: 4rem;
//             color: #e63946;
//             margin-bottom: 20px;
//           }

//           .coming-soon-wrapper h1 {
//             font-size: 3rem;
//             color: #1d3557;
//             margin-bottom: 20px;
//           }

//           .coming-soon-badge {
//             display: inline-flex;
//             align-items: center;
//             background-color: #1d3557;
//             color: white;
//             padding: 8px 20px;
//             border-radius: 30px;
//             font-weight: 600;
//             font-size: 1.1rem;
//             margin-bottom: 25px;
//           }

//           .coming-soon-badge svg {
//             margin-right: 8px;
//           }

//           .coming-soon-message {
//             font-size: 1.3rem;
//             color: #555;
//             max-width: 600px;
//             margin: 0 auto 40px;
//           }

//           .coming-soon-details {
//             margin-bottom: 40px;
//           }

//           .detail-item {
//             background-color: #f8f9fa;
//             border-radius: 10px;
//             padding: 30px;
//             text-align: left;
//           }

//           .detail-item svg {
//             font-size: 2rem;
//             color: #e63946;
//             margin-bottom: 15px;
//           }

//           .detail-item h3 {
//             color: #1d3557;
//             margin-bottom: 15px;
//             font-size: 1.4rem;
//           }

//           .detail-item ul {
//             padding-left: 20px;
//             margin: 0;
//           }

//           .detail-item li {
//             margin-bottom: 10px;
//             color: #555;
//           }

//           .media-preview {
//             margin-bottom: 40px;
//           }

//           .media-preview h3 {
//             color: #1d3557;
//             margin-bottom: 25px;
//             font-size: 1.5rem;
//           }

//           .highlights-grid {
//             display: grid;
//             grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//             gap: 20px;
//             margin-bottom: 30px;
//           }

//           .highlight-card {
//             background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
//             padding: 25px;
//             border-radius: 12px;
//             text-align: center;
//             border: 1px solid #dee2e6;
//             transition: transform 0.3s ease;
//           }

//           .highlight-card:hover {
//             transform: translateY(-5px);
//           }

//           .highlight-icon {
//             font-size: 2.5rem;
//             margin-bottom: 15px;
//           }

//           .highlight-card h4 {
//             color: #1d3557;
//             margin-bottom: 10px;
//             font-size: 1.2rem;
//           }

//           .highlight-card p {
//             color: #6c757d;
//             font-size: 0.9rem;
//             margin: 0;
//           }

//           .subscribe-section {
//             background: linear-gradient(135deg, #1d3557, #457b9d);
//             padding: 30px;
//             border-radius: 10px;
//             color: white;
//           }

//           .subscribe-section h3 {
//             margin: 0 0 15px;
//             font-size: 1.4rem;
//           }

//           .subscribe-section p {
//             margin: 0 0 20px;
//             opacity: 0.9;
//           }

//           .social-links {
//             display: flex;
//             justify-content: center;
//             gap: 15px;
//           }

//           .social-link {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             width: 45px;
//             height: 45px;
//             background-color: rgba(255, 255, 255, 0.2);
//             color: white;
//             border-radius: 50%;
//             text-decoration: none;
//             transition: background-color 0.3s, transform 0.3s;
//             font-size: 1.5rem;
//           }

//           .social-link:hover {
//             background-color: rgba(255, 255, 255, 0.3);
//             transform: translateY(-3px);
//           }

//           .newsroom-footer {
//             text-align: center;
//             padding: 20px 0;
//             border-top: 1px solid #eee;
//             color: #666;
//           }

//           .footer-home-link {
//             display: inline-block;
//             margin-top: 10px;
//             color: #e63946;
//             text-decoration: none;
//           }

//           .footer-home-link:hover {
//             text-decoration: underline;
//           }

//           /* Loading States */
//           .loading-container {
//             min-height: 100vh;
//           }

//           .loading-section {
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//             min-height: 60vh;
//             text-align: center;
//             padding: 60px 20px;
//           }

//           .loading-spinner {
//             margin-bottom: 20px;
//           }

//           .spinner-icon {
//             font-size: 3rem;
//             color: #e63946;
//             animation: spin 1s linear infinite;
//           }

//           @keyframes spin {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//           }

//           .loading-section p {
//             color: #64748b;
//             font-size: 1.3rem;
//             margin: 0;
//             font-weight: 500;
//           }

//           /* Error States */
//           .error-container {
//             min-height: 100vh;
//           }

//           .error-section {
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//             min-height: 60vh;
//             text-align: center;
//             padding: 60px 20px;
//             background: #fef2f2;
//             border-radius: 16px;
//             margin: 20px;
//             border: 2px solid #fecaca;
//           }

//           .error-section h2 {
//             color: #dc2626;
//             margin-bottom: 15px;
//             font-size: 2rem;
//             font-weight: 700;
//           }

//           .error-section p {
//             color: #6b7280;
//             margin-bottom: 30px;
//             font-size: 1.2rem;
//             max-width: 500px;
//             line-height: 1.6;
//           }

//           .error-section button {
//             background: linear-gradient(135deg, #e63946 0%, #c1121f 100%);
//             color: white;
//             padding: 14px 28px;
//             border: none;
//             border-radius: 10px;
//             font-weight: 600;
//             font-size: 1.1rem;
//             cursor: pointer;
//             transition: all 0.3s ease;
//           }

//           .error-section button:hover {
//             transform: translateY(-2px);
//             box-shadow: 0 6px 12px rgba(225, 57, 70, 0.4);
//           }

//           @media (max-width: 768px) {
//             .coming-soon-wrapper h1 {
//               font-size: 2.2rem;
//             }
            
//             .coming-soon-message {
//               font-size: 1.1rem;
//             }
            
//             .coming-soon-badge {
//               font-size: 0.9rem;
//               padding: 6px 15px;
//             }
            
//             .detail-item {
//               padding: 20px;
//             }
            
//             .highlights-grid {
//               grid-template-columns: 1fr;
//               gap: 15px;
//             }
            
//             .social-links {
//               flex-direction: row;
//               gap: 15px;
//             }
//           }

//           @media (max-width: 600px) {
//             .newsroom-header {
//               flex-direction: column;
//               align-items: flex-start;
//             }
            
//             .coming-soon-wrapper h1 {
//               font-size: 1.8rem;
//             }
            
//             .coming-soon-message {
//               font-size: 1rem;
//             }
            
//             .detail-item h3 {
//               font-size: 1.2rem;
//             }
            
//             .subscribe-section h3 {
//               font-size: 1.2rem;
//             }
//           }
//         `}</style>
//       </div>
//     );
//   }

//   // Regular newsroom page (when coming soon is disabled and content exists)
//   return (
//     <div className="newsroom-container">
//       <header className="newsroom-header">
//         <Link to="/" className="back-link">
//           <FaArrowLeft /> Back to Home
//         </Link>
//       </header>

//       <main className="newsroom-content">
//         <section className="hero-section">
//           <h1>{displayContent.hero?.title || 'ZappCart Newsroom'}</h1>
//           <p>{displayContent.hero?.subtitle || 'Latest news, announcements, and media resources'}</p>
//         </section>

//         {/* Press Releases Section */}
//         {displayContent.pressReleases && displayContent.pressReleases.length > 0 && (
//           <section className="press-releases">
//             <h2>Press Releases</h2>
//             <div className="releases-grid">
//               {displayContent.pressReleases.map((release, index) => (
//                 <article key={index} className="release-card">
//                   <div className="release-date">
//                     <FaCalendarAlt />
//                     <span>{new Date(release.date).toLocaleDateString()}</span>
//                   </div>
//                   {release.imageUrl && (
//                     <div className="release-image">
//                       <img src={release.imageUrl} alt={release.title} />
//                     </div>
//                   )}
//                   <h3>{release.title}</h3>
//                   <p>{release.excerpt}</p>
//                   {/* <a href={release.link} target="_blank" rel="noopener noreferrer" className="read-more">
//                     Read Full Release →
//                   </a> */}
//                 </article>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Media Kit Section */}
//         {displayContent.mediaKit && (
//           <section className="media-kit">
//             <h2>Media Kit</h2>
//             <div className="media-kit-content">
//               <p>{displayContent.mediaKit.description}</p>
//               {displayContent.mediaKit.available && (
//                 <button className="download-kit-btn">
//                   Download Media Kit
//                 </button>
//               )}
//             </div>
//           </section>
//         )}
//       </main>

//       <footer className="newsroom-footer">
//         <p>© 2025 ZappCart | TAZATA BUTCHERS PRIVATE LIMITED</p>
//         <Link to="/" className="footer-home-link">Return to Main Website</Link>
//       </footer>

//       <style jsx>{`
//         .newsroom-container {
//           font-family: 'Arial', sans-serif;
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 0 20px;
//           color: #333;
//           line-height: 1.6;
//         }

//         .newsroom-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 20px 0;
//           border-bottom: 1px solid #eee;
//         }

//         .back-link {
//           display: flex;
//           align-items: center;
//           color: rgb(252, 249, 250);
//           text-decoration: none;
//           font-weight: 600;
//           transition: color 0.3s;
//         }

//         .back-link:hover {
//           color: #c1121f;
//         }

//         .back-link svg {
//           margin-right: 8px;
//         }

//         .newsroom-content {
//           padding: 40px 0;
//           min-height: 70vh;
//         }

//         .hero-section {
//           text-align: center;
//           margin-bottom: 50px;
//         }

//         .hero-section h1 {
//           font-size: 2.5rem;
//           color: #1d3557;
//           margin-bottom: 15px;
//         }

//         .hero-section p {
//           font-size: 1.2rem;
//           color: #555;
//           max-width: 700px;
//           margin: 0 auto;
//         }

//         .press-releases {
//           margin-bottom: 60px;
//         }

//         .press-releases h2 {
//           font-size: 1.8rem;
//           color: #1d3557;
//           margin-bottom: 30px;
//           padding-bottom: 10px;
//           border-bottom: 2px solid #f1faee;
//         }

//         .releases-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//           gap: 30px;
//         }

//         .release-card {
//           background-color: #fff;
//           border-radius: 12px;
//           overflow: hidden;
//           box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
//           transition: transform 0.3s, box-shadow 0.3s;
//         }

//         .release-card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
//         }

//         .release-image {
//           height: 180px;
//           overflow: hidden;
//         }

//         .release-image img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           transition: transform 0.5s;
//         }

//         .release-card:hover .release-image img {
//           transform: scale(1.05);
//         }

//         .release-date {
//           display: flex;
//           align-items: center;
//           padding: 15px 20px 0;
//           color: #6c757d;
//           font-size: 0.9rem;
//         }

//         .release-date svg {
//           margin-right: 8px;
//           color: #e63946;
//         }

//         .release-card h3 {
//           padding: 0 20px;
//           margin: 15px 0;
//           font-size: 1.3rem;
//           color: #1d3557;
//           line-height: 1.4;
//         }

//         .release-card p {
//           padding: 0 20px;
//           margin-bottom: 25px;
//           color: #6c757d;
//           font-size: 0.95rem;
//           line-height: 1.6;
//         }

//         .read-more {
//           display: block;
//           padding: 12px 20px;
//           background-color: #f8f9fa;
//           color: #1d3557;
//           text-decoration: none;
//           text-align: right;
//           font-weight: 600;
//           transition: background-color 0.3s;
//           border-top: 1px solid #e9ecef;
//         }

//         .read-more:hover {
//           background-color: #e9ecef;
//           color: #e63946;
//         }

//         .media-kit {
//           background-color: #f8f9fa;
//           padding: 40px;
//           border-radius: 12px;
//           margin-bottom: 60px;
//         }

//         .media-kit h2 {
//           font-size: 1.8rem;
//           color: #1d3557;
//           margin-bottom: 20px;
//         }

//         .media-kit-content {
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//         }

//         .media-kit p {
//           margin-bottom: 25px;
//           color: #555;
//           font-size: 1.1rem;
//           max-width: 800px;
//         }

//         .download-kit-btn {
//           padding: 12px 24px;
//           background: linear-gradient(135deg, #1d3557, #457b9d);
//           color: white;
//           border: none;
//           border-radius: 30px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: transform 0.3s, box-shadow 0.3s;
//         }

//         .download-kit-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 5px 15px rgba(29, 53, 87, 0.3);
//         }

//         .newsroom-footer {
//           text-align: center;
//           padding: 20px 0;
//           border-top: 1px solid #eee;
//           color: #666;
//         }

//         .footer-home-link {
//           display: inline-block;
//           margin-top: 10px;
//           color: #e63946;
//           text-decoration: none;
//         }

//         .footer-home-link:hover {
//           text-decoration: underline;
//         }

//         @media (max-width: 768px) {
//           .releases-grid {
//             grid-template-columns: 1fr;
//           }
          
//           .media-kit {
//             padding: 30px 20px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Newsroom;






import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref as dbRef, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import logoImage from '../assets/images/logo1.png';
import { FaArrowLeft, FaNewspaper, FaCalendarAlt, FaBullhorn, FaLinkedinIn, FaTwitter, FaInstagram, FaSpinner } from 'react-icons/fa';

const Newsroom = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default content as fallback
  const defaultContent = {
    hero: {
      title: 'ZappCart Newsroom',
      subtitle: 'Latest news, announcements, and media resources'
    },
    comingSoon: {
      enabled: true,
      message: 'We\'re preparing a dedicated space to share our latest news, announcements, and media resources with you.',
      features: [
        'Latest ZappCart announcements and press releases',
        'Expansion updates as we grow across Bengaluru',
        'Media coverage and featured stories',
        'Downloadable resources for media partners',
        'Company milestones and achievements'
      ]
    },
    socialLinks: [
      { platform: 'Twitter', url: 'https://x.com/zappcart' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/zapp-cart-31b9aa365/' },
      { platform: 'Instagram', url: 'https://www.instagram.com/_zappcart/' }
    ],
    pressReleases: [],
    mediaKit: {
      available: false,
      description: 'Media resources and brand assets will be available here soon.'
    }
  };

  useEffect(() => {
    const loadContent = () => {
      try {
        const contentRef = dbRef(db, 'pages/newsroom');
        const unsubscribe = onValue(contentRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            
            // Check if the data has the old format with 'articles' instead of 'pressReleases'
            if (data.articles && (!data.pressReleases || data.pressReleases.length === 0)) {
              // Convert articles to pressReleases format
              data.pressReleases = data.articles.map(article => ({
                title: article.title,
                date: article.date,
                excerpt: article.summary || article.excerpt,
                content: article.content,
                imageUrl: article.imageUrl,
                link: article.source || article.link || '#'
              }));
            }
            
            setContent(data);
          } else {
            setContent(defaultContent);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error loading content:", error);
          setError(error.message);
          setContent(defaultContent);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error setting up content listener:", error);
        setError(error.message);
        setContent(defaultContent);
        setLoading(false);
      }
    };

    const unsubscribe = loadContent();
    
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const getSocialIcon = (platform) => {
    switch(platform.toLowerCase()) {
      case 'twitter':
        return <FaTwitter />;
      case 'linkedin':
        return <FaLinkedinIn />;
      case 'instagram':
        return <FaInstagram />;
      default:
        return <FaNewspaper />;
    }
  };

  if (loading) {
    return (
      <div className="newsroom-container loading-container">
        <div className="newsroom-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        <div className="loading-section">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
          </div>
          <p>Loading newsroom content...</p>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="newsroom-container error-container">
        <div className="newsroom-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        <div className="error-section">
          <h2>Error Loading Content</h2>
          <p>We're having trouble loading the newsroom content. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      </div>
    );
  }

  const displayContent = content || defaultContent;

  // If coming soon is enabled or no press releases, show coming soon page
  if (displayContent.comingSoon?.enabled || !displayContent.pressReleases || displayContent.pressReleases.length === 0) {
    return (
      <div className="newsroom-container">
        <header className="newsroom-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </header>

        <main className="newsroom-content">
          <div className="coming-soon-wrapper">
            {displayContent.hero?.imageUrl && (
              <div className="hero-image">
                <img src={displayContent.hero.imageUrl} alt="Newsroom Hero" />
              </div>
            )}
            <div className="coming-soon-icon">
              <FaNewspaper />
            </div>
            <h1>{displayContent.hero?.title || 'ZappCart Newsroom'}</h1>
            <div className="coming-soon-badge">
              <FaCalendarAlt /> Coming Soon
            </div>
            <p className="coming-soon-message">
              {displayContent.comingSoon?.message || 'We\'re preparing a dedicated space to share our latest news, announcements, and media resources with you.'}
            </p>
            
            <div className="coming-soon-details">
              <div className="detail-item">
                <FaBullhorn />
                <h3>What to expect in our upcoming Newsroom:</h3>
                <ul>
                  {(displayContent.comingSoon?.features || []).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="media-preview">
              <h3>Media Highlights</h3>
              <div className="highlights-grid">
                <div className="highlight-card">
                  <div className="highlight-icon">📈</div>
                  <h4>Growth Stories</h4>
                  <p>Follow our journey as we expand across Bengaluru and beyond</p>
                </div>
                <div className="highlight-card">
                  <div className="highlight-icon">🏆</div>
                  <h4>Awards & Recognition</h4>
                  <p>Celebrating our achievements in the food delivery industry</p>
                </div>
                <div className="highlight-card">
                  <div className="highlight-icon">🤝</div>
                  <h4>Partnerships</h4>
                  <p>Announcements about our strategic partnerships and collaborations</p>
                </div>
              </div>
            </div>

            <div className="subscribe-section">
              <h3>Be the first to know</h3>
              <p>Want updates when our Newsroom launches? Follow us on social media:</p>
              <div className="social-links">
                {(displayContent.socialLinks || []).map((social, index) => (
                  <a 
                    key={index}
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-link"
                    title={`Follow us on ${social.platform}`}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="newsroom-footer">
          <p>© 2025 ZappCart | TAZATA BUTCHERS PRIVATE LIMITED</p>
          <Link to="/" className="footer-home-link">Return to Main Website</Link>
        </footer>

        <style jsx>{`
          .newsroom-container {
            font-family: 'Arial', sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            color: #333;
            line-height: 1.6;
          }

          .newsroom-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid #eee;
          }

          .back-link {
            display: flex;
            align-items: center;
            color:rgb(252, 249, 250);
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

          .newsroom-content {
            padding: 40px 0;
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .coming-soon-wrapper {
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
            padding: 60px 20px;
            background-color: #fff;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          }

          .coming-soon-icon {
            font-size: 4rem;
            color: #e63946;
            margin-bottom: 20px;
          }

          .hero-image {
            max-width: 100%;
            margin-bottom: 30px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }

          .hero-image img {
            width: 100%;
            display: block;
          }

          .coming-soon-wrapper h1 {
            font-size: 3rem;
            color: #1d3557;
            margin-bottom: 20px;
          }

          .coming-soon-badge {
            display: inline-flex;
            align-items: center;
            background-color: #1d3557;
            color: white;
            padding: 8px 20px;
            border-radius: 30px;
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 25px;
          }

          .coming-soon-badge svg {
            margin-right: 8px;
          }

          .coming-soon-message {
            font-size: 1.3rem;
            color: #555;
            max-width: 600px;
            margin: 0 auto 40px;
          }

          .coming-soon-details {
            margin-bottom: 40px;
          }

          .detail-item {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 30px;
            text-align: left;
          }

          .detail-item svg {
            font-size: 2rem;
            color: #e63946;
            margin-bottom: 15px;
          }

          .detail-item h3 {
            color: #1d3557;
            margin-bottom: 15px;
            font-size: 1.4rem;
          }

          .detail-item ul {
            padding-left: 20px;
            margin: 0;
          }

          .detail-item li {
            margin-bottom: 10px;
            color: #555;
          }

          .media-preview {
            margin-bottom: 40px;
          }

          .media-preview h3 {
            color: #1d3557;
            margin-bottom: 25px;
            font-size: 1.5rem;
          }

          .highlights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }

          .highlight-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #dee2e6;
            transition: transform 0.3s ease;
          }

          .highlight-card:hover {
            transform: translateY(-5px);
          }

          .highlight-icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
          }

          .highlight-card h4 {
            color: #1d3557;
            margin-bottom: 10px;
            font-size: 1.2rem;
          }

          .highlight-card p {
            color: #6c757d;
            font-size: 0.9rem;
            margin: 0;
          }

          .subscribe-section {
            background: linear-gradient(135deg, #1d3557, #457b9d);
            padding: 30px;
            border-radius: 10px;
            color: white;
          }

          .subscribe-section h3 {
            margin: 0 0 15px;
            font-size: 1.4rem;
          }

          .subscribe-section p {
            margin: 0 0 20px;
            opacity: 0.9;
          }

          .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
          }

          .social-link {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 45px;
            height: 45px;
            background-color: rgba(255, 255, 255, 0.2);
            color: white;
            border-radius: 50%;
            text-decoration: none;
            transition: background-color 0.3s, transform 0.3s;
            font-size: 1.5rem;
          }

          .social-link:hover {
            background-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-3px);
          }

          .newsroom-footer {
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

          @media (max-width: 768px) {
            .coming-soon-wrapper h1 {
              font-size: 2.2rem;
            }
            
            .coming-soon-message {
              font-size: 1.1rem;
            }
            
            .coming-soon-badge {
              font-size: 0.9rem;
              padding: 6px 15px;
            }
            
            .detail-item {
              padding: 20px;
            }
            
            .highlights-grid {
              grid-template-columns: 1fr;
              gap: 15px;
            }
            
            .social-links {
              flex-direction: row;
              gap: 15px;
            }
          }

          @media (max-width: 600px) {
            .newsroom-header {
              flex-direction: column;
              align-items: flex-start;
            }
            
            .coming-soon-wrapper h1 {
              font-size: 1.8rem;
            }
            
            .coming-soon-message {
              font-size: 1rem;
            }
            
            .detail-item h3 {
              font-size: 1.2rem;
            }
            
            .subscribe-section h3 {
              font-size: 1.2rem;
            }
          }
        `}</style>
      </div>
    );
  }

  // Regular newsroom page (when coming soon is disabled and content exists)
  return (
    <div className="newsroom-container">
      <header className="newsroom-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
      </header>

      <main className="newsroom-content">
        <section className="hero-section">
         
          <h1>{displayContent.hero?.title || 'ZappCart Newsroom'}</h1>
          <p>{displayContent.hero?.subtitle || 'Latest news, announcements, and media resources'}</p>
        </section>

        {/* Press Releases Section */}
        {displayContent.pressReleases && displayContent.pressReleases.length > 0 && (
          <section className="press-releases">
            <h2>Press Releases</h2>
            <div className="releases-grid">
              {displayContent.pressReleases.map((release, index) => (
                <article key={index} className="release-card">
                  <div className="release-date">
                    <FaCalendarAlt />
                    <span>{new Date(release.date).toLocaleDateString()}</span>
                  </div>
                  {release.imageUrl && (
                    <div className="release-image">
                      <img src={release.imageUrl} alt={release.title} />
                    </div>
                  )}
                  <h3>{release.title}</h3>
                  <p>{release.excerpt}</p>
                  {/* <a href={release.link} target="_blank" rel="noopener noreferrer" className="read-more">
                    Read Full Release →
                  </a> */}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Media Kit Section */}
        {displayContent.mediaKit && (
          <section className="media-kit">
            <h2>Media Kit</h2>
            <div className="media-kit-content">
              <p>{displayContent.mediaKit.description}</p>
              {displayContent.mediaKit.available && (
                <button className="download-kit-btn">
                  Download Media Kit
                </button>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="newsroom-footer">
        <p>© 2025 ZappCart | TAZATA BUTCHERS PRIVATE LIMITED</p>
        <Link to="/" className="footer-home-link">Return to Main Website</Link>
      </footer>

      <style jsx>{`
        .newsroom-container {
          font-family: 'Arial', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          color: #333;
          line-height: 1.6;
        }

        .newsroom-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }

        .back-link {
          display: flex;
          align-items: center;
          color: rgb(252, 249, 250);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }

        .back-link:hover {
          color:rgb(245, 237, 238);
        }

        .back-link svg {
          margin-right: 8px;
        }

        .newsroom-content {
          padding: 40px 0;
          min-height: 70vh;
        }

        .hero-section {
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

        .hero-section h1 {
          font-size: 2.5rem;
          color: #1d3557;
          margin-bottom: 15px;
        }

        .hero-section p {
          font-size: 1.2rem;
          color: #555;
          max-width: 700px;
          margin: 0 auto;
        }

        .press-releases {
          margin-bottom: 60px;
        }

        .press-releases h2 {
          font-size: 1.8rem;
          color: #1d3557;
          margin-bottom: 30px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f1faee;
        }

        .releases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
        }

        .release-card {
          background-color: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .release-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .release-image {
          height: 180px;
          overflow: hidden;
        }

        .release-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .release-card:hover .release-image img {
          transform: scale(1.05);
        }

        .release-date {
          display: flex;
          align-items: center;
          padding: 15px 20px 0;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .release-date svg {
          margin-right: 8px;
          color: #e63946;
        }

        .release-card h3 {
          padding: 0 20px;
          margin: 15px 0;
          font-size: 1.3rem;
          color: #1d3557;
          line-height: 1.4;
        }

        .release-card p {
          padding: 0 20px;
          margin-bottom: 25px;
          color: #6c757d;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .read-more {
          display: block;
          padding: 12px 20px;
          background-color: #f8f9fa;
          color: #1d3557;
          text-decoration: none;
          text-align: right;
          font-weight: 600;
          transition: background-color 0.3s;
          border-top: 1px solid #e9ecef;
        }

        .read-more:hover {
          background-color: #e9ecef;
          color: #e63946;
        }

        .media-kit {
          background-color: #f8f9fa;
          padding: 40px;
          border-radius: 12px;
          margin-bottom: 60px;
        }

        .media-kit h2 {
          font-size: 1.8rem;
          color: #1d3557;
          margin-bottom: 20px;
        }

        .media-kit-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .media-kit p {
          margin-bottom: 25px;
          color: #555;
          font-size: 1.1rem;
          max-width: 800px;
        }

        .download-kit-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #1d3557, #457b9d);
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .download-kit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(29, 53, 87, 0.3);
        }

        .newsroom-footer {
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

        @media (max-width: 768px) {
          .releases-grid {
            grid-template-columns: 1fr;
          }
          
          .media-kit {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Newsroom;