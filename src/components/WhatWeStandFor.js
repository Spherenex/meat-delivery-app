




// // src/components/WhatWeStandFor.js
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ref as dbRef, onValue } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/components/WhatWeStandFor.css';
// import logoImage from '../assets/images/logo1.png';
// import supportImage from '../assets/images/support.png';
// import qualityImage from '../assets/images/quality.jpg';
// import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

// const WhatWeStandFor = () => {
//   const [content, setContent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Default content as fallback
//   const defaultContent = {
//     intro: {
//       title: 'What We Stand For',
//       tagline: 'At ZappCart, we connect customers with trusted local meat vendors, ensuring freshness, quality, and convenience without compromise.'
//     },
//     coreValues: {
//       title: 'Our Core Values',
//       values: [
//         {
//           id: 'fresh-not-frozen',
//           title: 'Fresh, Not Frozen',
//           description: 'We believe that fresh is always best. Unlike others, we don\'t keep meat in deep freezers or store it for days. Your meat is cleaned, cut, and packed only after you place your order, just like your neighborhood butcher, but faster.'
//         },
//         {
//           id: 'hygiene-first',
//           title: 'Hygiene First',
//           description: 'We prioritize health and safety above all. Our partner shops follow strict cleanliness protocols. All meat is handled with gloves, masks, and sealed in leak-proof, food-safe packaging to ensure the highest standards of hygiene.'
//         },
//         {
//           id: 'supporting-local',
//           title: 'Supporting Local',
//           description: 'We\'re proud to partner with carefully selected local shops in your neighborhood. We empower local meat vendors through our platform while ensuring customers receive premium service with a local touch.'
//         }
//       ]
//     },
//     commitment: {
//       title: 'Our Commitment',
//       commitments: [
//         {
//           id: 'super-fast-delivery',
//           title: 'Super-Fast Delivery',
//           description: 'We understand that time is valuable. Your meat is packed and out the door within minutes of cutting, reaching you in under 60 minutes in most areas. No waiting, no compromises.'
//         },
//         {
//           id: 'satisfaction-guaranteed',
//           title: 'Satisfaction Guaranteed',
//           description: 'Your happiness is our priority. Not happy with your order? We\'ll make it right with a replacement or refund based on our refund policy - no hassle, no stress.'
//         },
//         {
//           id: 'customer-centric-approach',
//           title: 'Customer-Centric Approach',
//           description: 'We\'re building ZappCart around you. From our easy-to-use app to our responsive customer support, we\'re dedicated to creating an experience that makes ordering meat simple, reliable, and stress-free.'
//         }
//       ]
//     },
//     community: {
//       title: 'What this means for our community:',
//       points: [
//         'We verify and regularly audit all partner vendors for quality and hygiene',
//         'We ensure timely delivery and transparent communication',
//         'We maintain the highest standards for food safety and handling',
//         'We actively listen to customer feedback to continuously improve our service',
//         'We support the growth of local businesses in the communities we serve'
//       ],
//       note: 'Our goal is to build a great experience for all our customers and partners - and we mean everyone. We\'re committed to offering the freshest meat with a focus on customer convenience, supporting local vendors, and ensuring the highest quality standards.'
//     },
//     contact: {
//       title: 'Have questions or suggestions?',
//       description: 'We\'d love to hear from you! Contact us at',
//       email: 'official.tazatabutchers@gmail.com'
//     },
//     footer: {
//       text: 'Thank you for supporting a ZappCart that supports local.'
//     }
//   };

//   useEffect(() => {
//     const loadContent = () => {
//       try {
//         const contentRef = dbRef(db, 'pages/whatWeStandFor');
//         const unsubscribe = onValue(contentRef, (snapshot) => {
//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             setContent(data);
//           } else {
//             // Use default content if no data exists in Firebase
//             setContent(defaultContent);
//           }
//           setLoading(false);
//         }, (error) => {
//           console.error("Error loading content:", error);
//           setError(error.message);
//           setContent(defaultContent); // Fallback to default content
//           setLoading(false);
//         });

//         return unsubscribe;
//       } catch (error) {
//         console.error("Error setting up content listener:", error);
//         setError(error.message);
//         setContent(defaultContent); // Fallback to default content
//         setLoading(false);
//       }
//     };

//     const unsubscribe = loadContent();
    
//     // Cleanup subscription on unmount
//     return () => {
//       if (unsubscribe && typeof unsubscribe === 'function') {
//         unsubscribe();
//       }
//     };
//   }, []);

//   if (loading) {
//     return (
//       <div className="values-container loading-container">
//         <div className="values-header">
//           <Link to="/" className="back-link">
//             <FaArrowLeft /> Back to Home
//           </Link>
//         </div>
//         <div className="loading-section">
//           <div className="loading-spinner">
//             <FaSpinner className="spinner-icon" />
//           </div>
//           <p>Loading content...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !content) {
//     return (
//       <div className="values-container error-container">
//         <div className="values-header">
//           <Link to="/" className="back-link">
//             <FaArrowLeft /> Back to Home
//           </Link>
//         </div>
//         <div className="error-section">
//           <h2>Error Loading Content</h2>
//           <p>We're having trouble loading the content. Please try refreshing the page.</p>
//           <button onClick={() => window.location.reload()}>Refresh Page</button>
//         </div>
//       </div>
//     );
//   }

//   // Use content from Firebase or fallback to default
//   const displayContent = content || defaultContent;

//   return (
//     <div className="values-container">
//       <div className="values-header">
//         <Link to="/" className="back-link">
//           <FaArrowLeft /> Back to Home
//         </Link>
//       </div>

//       <div className="values-content">
//         {/* Introduction Section */}
//         {displayContent.intro && (
//           <div className="values-intro">
//             <h1>{displayContent.intro.title}</h1>
//             <p className="values-tagline">
//               {displayContent.intro.tagline}
//             </p>
//           </div>
//         )}

//         {/* Core Values Section */}
//         {displayContent.coreValues && (
//           <div className="values-section">
//             <h2>{displayContent.coreValues.title}</h2>
            
//             {displayContent.coreValues.values && displayContent.coreValues.values.map((value, index) => (
//               <div key={value.id || index} className="value-item">
//                 <h3>{value.title}</h3>
//                 <p>{value.description}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Support Image */}
//         <div className="values-image-section">
//           <img src={supportImage} alt="ZappCart supporting local vendors" className="values-image" />
//         </div>

//         {/* Commitment Section */}
//         {displayContent.commitment && (
//           <div className="values-section">
//             <h2>{displayContent.commitment.title}</h2>
            
//             {displayContent.commitment.commitments && displayContent.commitment.commitments.map((commitment, index) => (
//               <div key={commitment.id || index} className="value-item">
//                 <h3>{commitment.title}</h3>
//                 <p>{commitment.description}</p>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Quality Image */}
//         <div className="values-image-section">
//           <img src={qualityImage} alt="ZappCart quality assurance" className="values-image" />
//         </div>

//         {/* Community Section */}
//         {displayContent.community && (
//           <div className="values-respect-section">
//             <h2>{displayContent.community.title}</h2>
            
//             {displayContent.community.points && displayContent.community.points.length > 0 && (
//               <ul className="respect-list">
//                 {displayContent.community.points.map((point, index) => (
//                   <li key={index}>{point}</li>
//                 ))}
//               </ul>
//             )}
            
//             {displayContent.community.note && (
//               <p className="respect-note">
//                 {displayContent.community.note}
//               </p>
//             )}
//           </div>
//         )}

//         {/* Contact Section */}
//         {displayContent.contact && (
//           <div className="values-contact">
//             <h3>{displayContent.contact.title}</h3>
//             <p>
//               {displayContent.contact.description}{' '}
//               <a href={`mailto:${displayContent.contact.email}`}>
//                 {displayContent.contact.email}
//               </a>
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Footer Section */}
//       {displayContent.footer && (
//         <div className="values-footer">
//           <p>{displayContent.footer.text}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default WhatWeStandFor;





// src/components/WhatWeStandFor.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref as dbRef, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/components/WhatWeStandFor.css';
import logoImage from '../assets/images/logo1.png';
import supportImageDefault from '../assets/images/support.png';
import qualityImageDefault from '../assets/images/quality.jpg';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

const WhatWeStandFor = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default content as fallback
  const defaultContent = {
    intro: {
      title: 'What We Stand For',
      tagline: 'At ZappCart, we connect customers with trusted local meat vendors, ensuring freshness, quality, and convenience without compromise.'
    },
    coreValues: {
      title: 'Our Core Values',
      values: [
        {
          id: 'fresh-not-frozen',
          title: 'Fresh, Not Frozen',
          description: 'We believe that fresh is always best. Unlike others, we don\'t keep meat in deep freezers or store it for days. Your meat is cleaned, cut, and packed only after you place your order, just like your neighborhood butcher, but faster.'
        },
        {
          id: 'hygiene-first',
          title: 'Hygiene First',
          description: 'We prioritize health and safety above all. Our partner shops follow strict cleanliness protocols. All meat is handled with gloves, masks, and sealed in leak-proof, food-safe packaging to ensure the highest standards of hygiene.'
        },
        {
          id: 'supporting-local',
          title: 'Supporting Local',
          description: 'We\'re proud to partner with carefully selected local shops in your neighborhood. We empower local meat vendors through our platform while ensuring customers receive premium service with a local touch.'
        }
      ]
    },
    commitment: {
      title: 'Our Commitment',
      commitments: [
        {
          id: 'super-fast-delivery',
          title: 'Super-Fast Delivery',
          description: 'We understand that time is valuable. Your meat is packed and out the door within minutes of cutting, reaching you in under 60 minutes in most areas. No waiting, no compromises.'
        },
        {
          id: 'satisfaction-guaranteed',
          title: 'Satisfaction Guaranteed',
          description: 'Your happiness is our priority. Not happy with your order? We\'ll make it right with a replacement or refund based on our refund policy - no hassle, no stress.'
        },
        {
          id: 'customer-centric-approach',
          title: 'Customer-Centric Approach',
          description: 'We\'re building ZappCart around you. From our easy-to-use app to our responsive customer support, we\'re dedicated to creating an experience that makes ordering meat simple, reliable, and stress-free.'
        }
      ]
    },
    community: {
      title: 'What this means for our community:',
      points: [
        'We verify and regularly audit all partner vendors for quality and hygiene',
        'We ensure timely delivery and transparent communication',
        'We maintain the highest standards for food safety and handling',
        'We actively listen to customer feedback to continuously improve our service',
        'We support the growth of local businesses in the communities we serve'
      ],
      note: 'Our goal is to build a great experience for all our customers and partners - and we mean everyone. We\'re committed to offering the freshest meat with a focus on customer convenience, supporting local vendors, and ensuring the highest quality standards.'
    },
    contact: {
      title: 'Have questions or suggestions?',
      description: 'We\'d love to hear from you! Contact us at',
      email: 'official.tazatabutchers@gmail.com'
    },
    footer: {
      text: 'Thank you for supporting a ZappCart that supports local.'
    },
    images: {
      supportImage: supportImageDefault,
      qualityImage: qualityImageDefault
    }
  };

  useEffect(() => {
    const loadContent = () => {
      try {
        const contentRef = dbRef(db, 'pages/whatWeStandFor');
        const unsubscribe = onValue(contentRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            // Merge with default content to ensure all properties exist
            setContent({
              ...defaultContent,
              ...data,
              images: {
                ...defaultContent.images,
                ...(data.images || {})
              }
            });
          } else {
            // Use default content if no data exists in Firebase
            setContent(defaultContent);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error loading content:", error);
          setError(error.message);
          setContent(defaultContent); // Fallback to default content
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error setting up content listener:", error);
        setError(error.message);
        setContent(defaultContent); // Fallback to default content
        setLoading(false);
      }
    };

    const unsubscribe = loadContent();
    
    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="values-container loading-container">
        <div className="values-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        <div className="loading-section">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
          </div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="values-container error-container">
        <div className="values-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        <div className="error-section">
          <h2>Error Loading Content</h2>
          <p>We're having trouble loading the content. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      </div>
    );
  }

  // Use content from Firebase or fallback to default
  const displayContent = content || defaultContent;

  return (
    <div className="values-container">
      <div className="values-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>

      <div className="values-content">
        {/* Introduction Section */}
        {displayContent.intro && (
          <div className="values-intro">
            <h1>{displayContent.intro.title}</h1>
            <p className="values-tagline">
              {displayContent.intro.tagline}
            </p>
          </div>
        )}

        {/* Core Values Section */}
        {displayContent.coreValues && (
          <div className="values-section">
            <h2>{displayContent.coreValues.title}</h2>
            
            {displayContent.coreValues.values && displayContent.coreValues.values.map((value, index) => (
              <div key={value.id || index} className="value-item">
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Support Image */}
        <div className="values-image-section">
          <img 
            src={displayContent.images?.supportImage || supportImageDefault} 
            alt="ZappCart supporting local vendors" 
            className="values-image"
            onError={(e) => {
              e.target.src = supportImageDefault;
            }}
          />
        </div>

        {/* Commitment Section */}
        {displayContent.commitment && (
          <div className="values-section">
            <h2>{displayContent.commitment.title}</h2>
            
            {displayContent.commitment.commitments && displayContent.commitment.commitments.map((commitment, index) => (
              <div key={commitment.id || index} className="value-item">
                <h3>{commitment.title}</h3>
                <p>{commitment.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quality Image */}
        <div className="values-image-section">
          <img 
            src={displayContent.images?.qualityImage || qualityImageDefault} 
            alt="ZappCart quality assurance" 
            className="values-image"
            onError={(e) => {
              e.target.src = qualityImageDefault;
            }}
          />
        </div>

        {/* Community Section */}
        {displayContent.community && (
          <div className="values-respect-section">
            <h2>{displayContent.community.title}</h2>
            
            {displayContent.community.points && displayContent.community.points.length > 0 && (
              <ul className="respect-list">
                {displayContent.community.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            )}
            
            {displayContent.community.note && (
              <p className="respect-note">
                {displayContent.community.note}
              </p>
            )}
          </div>
        )}

        {/* Contact Section */}
        {displayContent.contact && (
          <div className="values-contact">
            <h3>{displayContent.contact.title}</h3>
            <p>
              {displayContent.contact.description}{' '}
              <a href={`mailto:${displayContent.contact.email}`}>
                {displayContent.contact.email}
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Footer Section */}
      {displayContent.footer && (
        <div className="values-footer">
          <p>{displayContent.footer.text}</p>
        </div>
      )}
    </div>
  );
};

export default WhatWeStandFor;