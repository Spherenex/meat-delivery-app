




// // src/components/Footer.js
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import '../styles/components/Footer.css';
// import logoImage from '../assets/images/logo1.png';
// import AppStoreImage from '../assets/images/app-store.png';
// import GooglePlayImage from '../assets/images/google-play.png';
// import { FaTwitter, FaFacebookF, FaInstagram, FaTimes, FaLinkedinIn } from 'react-icons/fa';
// import { ref, push, serverTimestamp, onValue } from 'firebase/database'; // Changed imports
// import { db } from '../firebase/config';
// import emailjs from 'emailjs-com';

// const Footer = () => {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     vendorName: '',
//     address: '',
//     phoneNumber: '',
//     email: '',
//     message: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
  
//   // Social media links from Firebase
//   const [socialLinks, setSocialLinks] = useState({
//     twitter: { url: 'https://x.com/zappcart', enabled: true },
//     linkedin: { url: 'https://www.linkedin.com/in/zapp-cart-31b9aa365/', enabled: true },
//     instagram: { url: 'https://www.instagram.com/_zappcart/', enabled: true }
//   });
  
//   // Additional links from Firebase
//   const [additionalLinks, setAdditionalLinks] = useState({
//     company: [],
//     usefulLinks: [],
//     socialLinks: []
//   });
  
//   // Load footer links from Firebase
//   useEffect(() => {
//     const footerRef = ref(db, 'footerSections'); // Using ref instead of dbRef
//     const unsubscribe = onValue(footerRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
        
//         // Extract main social links (Twitter, LinkedIn, Instagram)
//         const twitterLink = data.socialLinks.find(link => link.title === 'Twitter');
//         const linkedinLink = data.socialLinks.find(link => link.title === 'LinkedIn');
//         const instagramLink = data.socialLinks.find(link => link.title === 'Instagram');
        
//         // Update the social links state
//         setSocialLinks({
//           twitter: twitterLink ? { url: twitterLink.url, enabled: twitterLink.enabled } : { url: 'https://x.com/zappcart', enabled: true },
//           linkedin: linkedinLink ? { url: linkedinLink.url, enabled: linkedinLink.enabled } : { url: 'https://www.linkedin.com/in/zapp-cart-31b9aa365/', enabled: true },
//           instagram: instagramLink ? { url: instagramLink.url, enabled: instagramLink.enabled } : { url: 'https://www.instagram.com/_zappcart/', enabled: true }
//         });
        
//         // Filter out main social links to get additional links
//         const existingCompanyTitles = ['Why Zappcart?', 'What we stand for', 'BLOG'];
//         const existingUsefulLinksTitles = ['Support', 'Newsroom', 'Contact'];
//         const existingSocialPlatforms = ['Twitter', 'LinkedIn', 'Instagram'];
        
//         const filteredData = {
//           company: data.company ? data.company.filter(item => 
//             !existingCompanyTitles.includes(item.title) && item.enabled
//           ) : [],
//           usefulLinks: data.usefulLinks ? data.usefulLinks.filter(item => 
//             !existingUsefulLinksTitles.includes(item.title) && item.enabled
//           ) : [],
//           socialLinks: data.socialLinks ? data.socialLinks.filter(item => 
//             !existingSocialPlatforms.includes(item.title) && item.enabled
//           ) : []
//         };
        
//         setAdditionalLinks(filteredData);
//       }
//     }, (error) => {
//       console.error('Error loading footer sections:', error);
//     });
    
//     // Return cleanup function
//     return () => {
//       // No need to call unsubscribe for onValue as it returns void
//     };
//   }, []);

//   const openForm = (e) => {
//     e.preventDefault();
//     setIsFormOpen(true);
//   };

//   const closeForm = () => {
//     setIsFormOpen(false);
//     // Reset form after a delay to allow animation
//     setTimeout(() => {
//       setFormData({
//         vendorName: '',
//         address: '',
//         phoneNumber: '',
//         email: '',
//         message: ''
//       });
//       setError('');
//       setSuccess(false);
//     }, 300);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const validateForm = () => {
//     if (!formData.vendorName.trim()) return "Vendor name is required";
//     if (!formData.address.trim()) return "Address is required";
//     if (!formData.phoneNumber.trim()) return "Phone number is required";
//     if (!/^\d{10}$/.test(formData.phoneNumber)) return "Please enter a valid 10-digit phone number";
//     if (!formData.email.trim()) return "Email is required";
//     if (!/\S+@\S+\.\S+/.test(formData.email)) return "Please enter a valid email address";
//     return "";
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate form
//     const validationError = validateForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // 1. Save to Realtime Database (instead of Firestore)
//       const merchantRequestsRef = ref(db, "merchantRequests");
//       const requestData = {
//         vendorName: formData.vendorName,
//         address: formData.address,
//         phoneNumber: formData.phoneNumber,
//         email: formData.email,
//         message: formData.message || '',
//         status: "pending",
//         createdAt: serverTimestamp()
//       };
      
//       // Push data to create a new entry with a unique key
//       const newRequestRef = await push(merchantRequestsRef, requestData);

//       // 2. Send email notification using EmailJS
//       const templateParams = {
//         to_email: 'official.tazatabutchers@gmail.com',
//         from_name: formData.vendorName,
//         vendor_name: formData.vendorName,
//         vendor_email: formData.email,
//         vendor_phone: formData.phoneNumber,
//         vendor_address: formData.address,
//         message: formData.message || 'No additional message',
//         request_id: newRequestRef.key // Using the key from Firebase Realtime Database
//       };

//       await emailjs.send(
//         'service_dmeda33', // Your EmailJS service ID
//         'template_jvvgl4h', // Your EmailJS template ID
//         templateParams,
//         'j5UiZABMwKV2_WV8Y' // Your EmailJS user ID
//       );

//       setSuccess(true);

//       // Clear form data after successful submission
//       setFormData({
//         vendorName: '',
//         address: '',
//         phoneNumber: '',
//         email: '',
//         message: ''
//       });

//       // Close modal after 3 seconds
//       setTimeout(() => {
//         closeForm();
//       }, 3000);

//     } catch (error) {
//       console.error("Error submitting form:", error.message);
//       setError("Failed to submit your request. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to render additional links
//   const renderAdditionalLink = (item) => {
//     if (!item.enabled) return null;

//     if (item.url && (item.url.startsWith('http://') || item.url.startsWith('https://'))) {
//       // External link
//       return (
//         <li key={item.id}>
//           <a href={item.url} target="_blank" rel="noopener noreferrer">
//             {item.title}
//           </a>
//         </li>
//       );
//     } else if (item.contentType && item.contentType !== 'generic') {
//       // Internal page with specific content type
//       return (
//         <li key={item.id}>
//           <Link to={`/${item.contentType}`}>{item.title}</Link>
//         </li>
//       );
//     } else {
//       // Simple internal link
//       return (
//         <li key={item.id}>
//           <Link to={`/${item.url || item.title.toLowerCase().replace(/\s+/g, '-')}`}>
//             {item.title}
//           </Link>
//         </li>
//       );
//     }
//   };

//   // Function to render additional social link
//   const renderAdditionalSocialLink = (item) => {
//     if (!item.enabled || !item.url) return null;

//     const getSocialIcon = (platform) => {
//       switch(platform.toLowerCase()) {
//         case 'twitter':
//           return <FaTwitter />;
//         case 'facebook':
//           return <FaFacebookF />;
//         case 'instagram':
//           return <FaInstagram />;
//         case 'linkedin':
//           return <FaLinkedinIn />;
//         default:
//           return <FaTwitter />;
//       }
//     };

//     return (
//       <a 
//         key={item.id}
//         href={item.url} 
//         target="_blank" 
//         rel="noopener noreferrer"
//       >
//         {getSocialIcon(item.title)}
//       </a>
//     );
//   };

//   return (
//     <footer className="footer">
//       <div className="footer-container">
//         <div className="logo">
//             <Link to="/">
//               <img src={logoImage} alt="ZappCart Logo" />
//             </Link>
//           </div>

//         <div className="footer-sections">
//           {/* Experience section */}
//           <div className="footer-section experience-section">
//             <h4>Experience Zappcart App on Mobile</h4>
//           </div>

//           {/* Partner section */}
//           <div className="footer-section partner-section">
//             <h4>Partner with Zappcart</h4>
//             <ul className="footer-links">
//               <li><a href="#" onClick={openForm}>For Merchants</a></li>
//             </ul>
//           </div>

//           {/* Company section */}
//           <div className="footer-section company-section">
//             <h4>Company</h4>
//             <ul className="footer-links">
//               <li><Link to="https://npk-values-4a297.web.app/" target='_main'>Why Zappcart?</Link></li>
//               <li><Link to="/what-we-stand-for">What we stand for</Link></li>
//               <li><Link to="/blog">BLOG</Link></li>
              
//               {/* Additional company links from Firebase */}
//               {additionalLinks.company.map(item => renderAdditionalLink(item))}
//             </ul>
//           </div>

//           {/* Useful Links section */}
//           <div className="footer-section useful-links-section">
//             <h4>Useful Links</h4>
//             <ul className="footer-links">
//               <li><Link to="/support">Support</Link></li>
//               <li><Link to="/newsroom">Newsroom</Link></li>
//               <li><Link to="/contact">Contact</Link></li>
//               <li><Link to="https://www.spherenex.com/" target='_main'>Developers</Link></li>
              
//               {/* Additional useful links from Firebase */}
//               {additionalLinks.usefulLinks.map(item => renderAdditionalLink(item))}
//             </ul>
//           </div>

//           {/* Keep in Touch social media section */}
//           <div className="footer-section social-section">
//             <h4 style={{ left: '15px' }}>Keep in Touch</h4>
//             <div className="social-links">
//               {/* Twitter link from Firebase */}
//               {socialLinks.twitter.enabled && (
//                 <a href={socialLinks.twitter.url} target="_blank" rel="noopener noreferrer">
//                   <FaTwitter />
//                 </a>
//               )}
              
//               {/* LinkedIn link from Firebase */}
//               {socialLinks.linkedin.enabled && (
//                 <a href={socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer">
//                   <FaLinkedinIn />
//                 </a>
//               )}
              
//               {/* Instagram link from Firebase */}
//               {socialLinks.instagram.enabled && (
//                 <a href={socialLinks.instagram.url} target="_blank" rel="noopener noreferrer">
//                   <FaInstagram />
//                 </a>
//               )}
              
//               {/* Additional social links from Firebase */}
//               {additionalLinks.socialLinks.map(item => renderAdditionalSocialLink(item))}
//             </div>
//           </div>

//           {/* App Store Links */}
//           <div className="footer-section app-links-section">
//             <div className="app-links">
//               <a target="_blank" rel="noopener noreferrer">
//                 <img src={AppStoreImage} alt="Appstore Logo" />
//               </a>
//               <a target="_blank" rel="noopener noreferrer">
//                 <img src={GooglePlayImage} alt="Google Play" />
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Contact Info Section */}
//         <div className="contact-container">
//           <div className="contact-section">
//             <h4>Contact Us</h4>
//             <div className="contact-info">
//               <div className="contact-item">
//                 <span className="contact-label">Call:</span>
//                 <span className="contact-value">+91 8722237574</span>
//               </div>
//               <div className="contact-item">
//                 <span className="contact-label">Email:</span>
//                 <span className="contact-value">official.tazatabutchers@gmail.com</span>
//               </div>
//             </div>
//           </div>

//           <div className="address-section">
//             <h4>Registered Office Address:</h4>
//             <p className="address" style={{color: '#bbb'}}>
//               Sri kalabhairaveshwara chicken center,
//               <br />
//               Rajeev Gandhi circle, kebbehala sunkadakatte
//               <br />
//               Bangalore -560091
//             </p>
//           </div>

//           <div className="security-section">
//             <h4>Have Security Concern?</h4>
//             <p className="security-concern">Mail us to: <a href="mailto:official.tazatabutchers@gmail.com">official.tazatabutchers@gmail.com</a></p>
//           </div>
//         </div>
//       </div>

//       {/* Merchant Request Form Modal */}
//       {isFormOpen && (
//         <div className="merchant-form-overlay">
//           <div className="merchant-form-container">
//             <button className="close-button" onClick={closeForm}>
//               <FaTimes />
//             </button>

//             <div className="merchant-form-header">
//               <h2>Become a Merchant Partner</h2>
//               <p>Fill out this form to request merchant access on ZappCart</p>
//             </div>

//             {error && <div className="error-message">{error}</div>}
//             {success && (
//               <div className="success-message">
//                 Your request has been submitted successfully! We'll contact you soon.
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="merchant-form">
//               <div className="form-group">
//                 <label htmlFor="vendorName">Business/Vendor Name *</label>
//                 <input
//                   type="text"
//                   id="vendorName"
//                   name="vendorName"
//                   value={formData.vendorName}
//                   onChange={handleChange}
//                   placeholder="Enter your business name"
//                   disabled={loading || success}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="address">Business Address *</label>
//                 <textarea
//                   id="address"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   placeholder="Enter your complete business address"
//                   rows="3"
//                   disabled={loading || success}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="phoneNumber">Phone Number *</label>
//                 <input
//                   type="tel"
//                   id="phoneNumber"
//                   name="phoneNumber"
//                   value={formData.phoneNumber}
//                   onChange={handleChange}
//                   placeholder="10-digit mobile number"
//                   maxLength={10}
//                   disabled={loading || success}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="email">Email Address *</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter your email address"
//                   disabled={loading || success}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="message">Additional Information</label>
//                 <textarea
//                   id="message"
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   placeholder="Tell us about your business, products, etc."
//                   rows="4"
//                   disabled={loading || success}
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="submit-button"
//                 disabled={loading || success}
//               >
//                 {loading ? "Submitting..." : success ? "Submitted Successfully!" : "Submit Request"}
//               </button>

//               <p className="form-note">
//                 * We'll review your application and get back to you via email.
//               </p>
//             </form>
//           </div>
//         </div>
//       )}
//     </footer>
//   );
// };

// export default Footer;





// src/components/Footer.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Footer.css';
import logoImage from '../assets/images/logo1.png';
import AppStoreImage from '../assets/images/app-store.png';
import GooglePlayImage from '../assets/images/google-play.png';
import { FaTwitter, FaFacebookF, FaInstagram, FaTimes, FaLinkedinIn } from 'react-icons/fa';
import { ref, push, serverTimestamp, onValue } from 'firebase/database';
import { db } from '../firebase/config';

const Footer = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
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
  
  // Social media links from Firebase
  const [socialLinks, setSocialLinks] = useState({
    twitter: { url: 'https://x.com/zappcart', enabled: true },
    linkedin: { url: 'https://www.linkedin.com/in/zapp-cart-31b9aa365/', enabled: true },
    instagram: { url: 'https://www.instagram.com/_zappcart/', enabled: true }
  });
  
  // Additional links from Firebase
  const [additionalLinks, setAdditionalLinks] = useState({
    company: [],
    usefulLinks: [],
    socialLinks: []
  });
  
  // Load footer links from Firebase
  useEffect(() => {
    const footerRef = ref(db, 'footerSections'); // Using ref instead of dbRef
    const unsubscribe = onValue(footerRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        // Extract main social links (Twitter, LinkedIn, Instagram)
        const twitterLink = data.socialLinks.find(link => link.title === 'Twitter');
        const linkedinLink = data.socialLinks.find(link => link.title === 'LinkedIn');
        const instagramLink = data.socialLinks.find(link => link.title === 'Instagram');
        
        // Update the social links state
        setSocialLinks({
          twitter: twitterLink ? { url: twitterLink.url, enabled: twitterLink.enabled } : { url: 'https://x.com/zappcart', enabled: true },
          linkedin: linkedinLink ? { url: linkedinLink.url, enabled: linkedinLink.enabled } : { url: 'https://www.linkedin.com/in/zapp-cart-31b9aa365/', enabled: true },
          instagram: instagramLink ? { url: instagramLink.url, enabled: instagramLink.enabled } : { url: 'https://www.instagram.com/_zappcart/', enabled: true }
        });
        
        // Filter out main social links to get additional links
        const existingCompanyTitles = ['Why Zappcart?', 'What we stand for', 'BLOG'];
        const existingUsefulLinksTitles = ['Support', 'Newsroom', 'Contact'];
        const existingSocialPlatforms = ['Twitter', 'LinkedIn', 'Instagram'];
        
        const filteredData = {
          company: data.company ? data.company.filter(item => 
            !existingCompanyTitles.includes(item.title) && item.enabled
          ) : [],
          usefulLinks: data.usefulLinks ? data.usefulLinks.filter(item => 
            !existingUsefulLinksTitles.includes(item.title) && item.enabled
          ) : [],
          socialLinks: data.socialLinks ? data.socialLinks.filter(item => 
            !existingSocialPlatforms.includes(item.title) && item.enabled
          ) : []
        };
        
        setAdditionalLinks(filteredData);
      }
    }, (error) => {
      console.error('Error loading footer sections:', error);
    });
    
    // Return cleanup function
    return () => {
      // No need to call unsubscribe for onValue as it returns void
    };
  }, []);

  const openForm = (e) => {
    e.preventDefault();
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    // Reset form after a delay to allow animation
    setTimeout(() => {
      setFormData({
        vendorName: '',
        address: '',
        phoneNumber: '',
        email: '',
        message: ''
      });
      setError('');
      setSuccess(false);
    }, 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    try {
      // Save to Realtime Database
      const merchantRequestsRef = ref(db, "merchantRequests");
      const requestData = {
        vendorName: formData.vendorName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        message: formData.message || '',
        status: "pending",
        createdAt: serverTimestamp()
      };
      
      // Push data to create a new entry with a unique key
      await push(merchantRequestsRef, requestData);
      
      // Set success state
      setSuccess(true);

      // Clear form data after successful submission
      setFormData({
        vendorName: '',
        address: '',
        phoneNumber: '',
        email: '',
        message: ''
      });

      // Close modal after 3 seconds
      setTimeout(() => {
        closeForm();
      }, 3000);

    } catch (error) {
      console.error("Error submitting form:", error.message);
      setError("Failed to submit your request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to render additional links
  const renderAdditionalLink = (item) => {
    if (!item.enabled) return null;

    if (item.url && (item.url.startsWith('http://') || item.url.startsWith('https://'))) {
      // External link
      return (
        <li key={item.id}>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        </li>
      );
    } else if (item.contentType && item.contentType !== 'generic') {
      // Internal page with specific content type
      return (
        <li key={item.id}>
          <Link to={`/${item.contentType}`}>{item.title}</Link>
        </li>
      );
    } else {
      // Simple internal link
      return (
        <li key={item.id}>
          <Link to={`/${item.url || item.title.toLowerCase().replace(/\s+/g, '-')}`}>
            {item.title}
          </Link>
        </li>
      );
    }
  };

  // Function to render additional social link
  const renderAdditionalSocialLink = (item) => {
    if (!item.enabled || !item.url) return null;

    const getSocialIcon = (platform) => {
      switch(platform.toLowerCase()) {
        case 'twitter':
          return <FaTwitter />;
        case 'facebook':
          return <FaFacebookF />;
        case 'instagram':
          return <FaInstagram />;
        case 'linkedin':
          return <FaLinkedinIn />;
        default:
          return <FaTwitter />;
      }
    };

    return (
      <a 
        key={item.id}
        href={item.url} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        {getSocialIcon(item.title)}
      </a>
    );
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="logo">
            <Link to="/">
              <img src={logoImage} alt="ZappCart Logo" />
            </Link>
          </div>

        <div className="footer-sections">
          {/* Experience section */}
          <div className="footer-section experience-section">
            <h4>Experience Zappcart App on Mobile</h4>
          </div>

          {/* Partner section */}
          <div className="footer-section partner-section">
            <h4>Partner with Zappcart</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={openForm}>For Merchants</a></li>
            </ul>
          </div>

          {/* Company section */}
          <div className="footer-section company-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="https://zappcart-jet.vercel.app/" target='_main'>Why Zappcart?</Link></li>
              <li><Link to="/what-we-stand-for">What we stand for</Link></li>
              <li><Link to="/blog">BLOG</Link></li>
              
              {/* Additional company links from Firebase */}
              {additionalLinks.company.map(item => renderAdditionalLink(item))}
            </ul>
          </div>

          {/* Useful Links section */}
          <div className="footer-section useful-links-section">
            <h4>Useful Links</h4>
            <ul className="footer-links">
              <li><Link to="/support">Support</Link></li>
              <li><Link to="/newsroom">Newsroom</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="https://www.spherenex.com/" target='_main'>Developers</Link></li>
              
              {/* Additional useful links from Firebase */}
              {additionalLinks.usefulLinks.map(item => renderAdditionalLink(item))}
            </ul>
          </div>

          {/* Keep in Touch social media section */}
          <div className="footer-section social-section">
            <h4 style={{ left: '15px' }}>Keep in Touch</h4>
            <div className="social-links">
              {/* Twitter link from Firebase */}
              {socialLinks.twitter.enabled && (
                <a href={socialLinks.twitter.url} target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                </a>
              )}
              
              {/* LinkedIn link from Firebase */}
              {socialLinks.linkedin.enabled && (
                <a href={socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer">
                  <FaLinkedinIn />
                </a>
              )}
              
              {/* Instagram link from Firebase */}
              {socialLinks.instagram.enabled && (
                <a href={socialLinks.instagram.url} target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </a>
              )}
              
              {/* Additional social links from Firebase */}
              {additionalLinks.socialLinks.map(item => renderAdditionalSocialLink(item))}
            </div>
          </div>

          {/* App Store Links */}
          <div className="footer-section app-links-section">
            <div className="app-links">
              <a target="_blank" rel="noopener noreferrer">
                <img src={AppStoreImage} alt="Appstore Logo" />
              </a>
              <a target="_blank" rel="noopener noreferrer">
                <img src={GooglePlayImage} alt="Google Play" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="contact-container">
          <div className="contact-section">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">Call:</span>
                <span className="contact-value">+91 8722237574</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <span className="contact-value">official.tazatabutchers@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="address-section">
            <h4>Registered Office Address:</h4>
            <p className="address" style={{color: '#bbb'}}>
              Sri kalabhairaveshwara chicken center,
              <br />
              Rajeev Gandhi circle, kebbehala sunkadakatte
              <br />
              Bangalore -560091
            </p>
          </div>

          <div className="security-section">
            <h4>Have Security Concern?</h4>
            <p className="security-concern">Mail us to: <a href="mailto:official.tazatabutchers@gmail.com">official.tazatabutchers@gmail.com</a></p>
          </div>
        </div>
      </div>

      {/* Merchant Request Form Modal */}
      {isFormOpen && (
        <div className="merchant-form-overlay">
          <div className="merchant-form-container">
            <button className="close-button" onClick={closeForm}>
              <FaTimes />
            </button>

            <div className="merchant-form-header">
              <h2>Become a Merchant Partner</h2>
              <p>Fill out this form to request merchant access on ZappCart</p>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && (
              <div className="success-message">
                Your request has been submitted successfully! We'll contact you soon.
              </div>
            )}

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
                  disabled={loading || success}
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
                  disabled={loading || success}
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
                  maxLength={10}
                  disabled={loading || success}
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
                  disabled={loading || success}
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
                  disabled={loading || success}
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={loading || success}
              >
                {loading ? "Submitting..." : success ? "Submitted Successfully!" : "Submit Request"}
              </button>

              <p className="form-note">
                * We'll review your application and get back to you via email.
              </p>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;