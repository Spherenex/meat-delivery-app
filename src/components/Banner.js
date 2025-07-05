



// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { FaSpinner } from 'react-icons/fa';
// import { db, storage } from '../firebase/config';
// import { ref as dbRef, onValue } from 'firebase/database';
// import { ref as storageRef, getDownloadURL, listAll } from 'firebase/storage';
// import '../styles/components/Banner.css';

// const Banner = () => {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedMeatCut, setSelectedMeatCut] = useState(localStorage.getItem('selectedMeatCut') || '');
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const navigate = useNavigate();
//   const location = useLocation();
 
//   // Handle meat cut category selection
//   const handleMeatCutSelection = (cutType) => {
//     if (selectedMeatCut === cutType) {
//       localStorage.removeItem('selectedMeatCut');
//       setSelectedMeatCut('');
//     } else {
//       localStorage.setItem('selectedMeatCut', cutType);
//       setSelectedMeatCut(cutType);
//     }
//     window.location.reload();
//   };

//   // Handle clearing the meat cut filter
//   const handleClearFilter = () => {
//     localStorage.removeItem('selectedMeatCut');
//     setSelectedMeatCut('');
//     window.location.reload();
//   };
  
//   // Navigate to bestsellers section
//   const navigateToBestsellers = () => {
//     if (location.pathname !== '/') {
//       navigate('/');
//       sessionStorage.setItem('scrollToBestsellers', 'true');
//     } else {
//       scrollToBestsellers();
//     }
//   };

//   // Function to handle the actual scrolling
//   const scrollToBestsellers = () => {
//     const bestsellersSection = document.getElementById('bestsellers-section');
//     if (bestsellersSection) {
//       bestsellersSection.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   // Navigate to categories page
//   const navigateToCategories = () => {
//     navigate('/categories');
//   };

//   // Navigate to MatchDay Essentials
//   const navigateToMatchDayEssentials = () => {
//     if (location.pathname !== '/') {
//       navigate('/');
//       sessionStorage.setItem('scrollToMatchDay', 'true');
//     } else {
//       scrollToMatchDayEssentials();
//     }
//   };

//   // Function to scroll to MatchDay Essentials
//   const scrollToMatchDayEssentials = () => {
//     const matchDaySection = document.querySelector('.matchday-essentials-section, .match-day-essentials');
//     if (matchDaySection) {
//       matchDaySection.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   // Navigate to Premium Selections
//   const navigateToPremiumSelections = () => {
//     if (location.pathname !== '/') {
//       navigate('/');
//       sessionStorage.setItem('scrollToPremium', 'true');
//     } else {
//       scrollToPremiumSelections();
//     }
//   };

//   // Function to scroll to Premium Selections
//   const scrollToPremiumSelections = () => {
//     const premiumSection = document.querySelector('.seafood-section, .premium-selections');
//     if (premiumSection) {
//       premiumSection.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   // Navigate to Dynamic Section
//   const navigateToDynamicSection = (sectionId) => {
//     if (location.pathname !== '/') {
//       navigate('/');
//       sessionStorage.setItem('scrollToDynamic', sectionId);
//     } else {
//       scrollToDynamicSection(sectionId);
//     }
//   };

//   // Function to scroll to Dynamic Section
//   const scrollToDynamicSection = (sectionId) => {
//     const dynamicSection = document.querySelector(`.${sectionId}-section`);
//     if (dynamicSection) {
//       dynamicSection.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   // Handle navigation based on button type
//   const handleNavigation = (navigationType, customLink) => {
//     switch (navigationType) {
//       case 'bestsellers':
//         navigateToBestsellers();
//         break;
//       case 'categories':
//         navigateToCategories();
//         break;
//       case 'matchday-essentials':
//         navigateToMatchDayEssentials();
//         break;
//       case 'premium-selections':
//         navigateToPremiumSelections();
//         break;
//       case 'dynamic-section':
//         if (customLink) {
//           navigateToDynamicSection(customLink);
//         }
//         break;
//       case 'custom-link':
//         if (customLink) {
//           if (customLink.startsWith('http')) {
//             window.open(customLink, '_blank');
//           } else {
//             navigate(customLink);
//           }
//         }
//         break;
//       default:
//         navigateToBestsellers();
//     }
//   };

//   // Get navigation button text
//   const getNavigationButtonText = (navigationType, customText) => {
//     if (customText) return customText;
    
//     switch (navigationType) {
//       case 'bestsellers':
//         return 'Bestsellers';
//       case 'categories':
//         return 'Categories';
//       case 'matchday-essentials':
//         return 'MatchDay Essentials';
//       case 'premium-selections':
//         return 'Premium Selections';
//       case 'dynamic-section':
//         return 'View Section';
//       case 'custom-link':
//         return 'View More';
//       default:
//         return 'View More';
//     }
//   };

//   // Check for scroll flags on component mount
//   useEffect(() => {
//     const shouldScrollBestsellers = sessionStorage.getItem('scrollToBestsellers');
//     const shouldScrollMatchDay = sessionStorage.getItem('scrollToMatchDay');
//     const shouldScrollPremium = sessionStorage.getItem('scrollToPremium');
//     const shouldScrollDynamic = sessionStorage.getItem('scrollToDynamic');
    
//     if (location.pathname === '/') {
//       if (shouldScrollBestsellers === 'true') {
//         sessionStorage.removeItem('scrollToBestsellers');
//         setTimeout(() => scrollToBestsellers(), 500);
//       } else if (shouldScrollMatchDay === 'true') {
//         sessionStorage.removeItem('scrollToMatchDay');
//         setTimeout(() => scrollToMatchDayEssentials(), 500);
//       } else if (shouldScrollPremium === 'true') {
//         sessionStorage.removeItem('scrollToPremium');
//         setTimeout(() => scrollToPremiumSelections(), 500);
//       } else if (shouldScrollDynamic) {
//         const sectionId = shouldScrollDynamic;
//         sessionStorage.removeItem('scrollToDynamic');
//         setTimeout(() => scrollToDynamicSection(sectionId), 500);
//       }
//     }
//   }, [location.pathname]);

//   // Handle slider navigation
//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//     const container = document.querySelector('.banner-container');
//     if (container) {
//       const slideWidth = container.children[0]?.offsetWidth || 350;
//       const gap = 15;
//       container.scrollTo({
//         left: index * (slideWidth + gap),
//         behavior: 'smooth'
//       });
//     }
//   };

//   // Auto-slide functionality
//   useEffect(() => {
//     if (banners.length > 1) {
//       const interval = setInterval(() => {
//         setCurrentSlide(prev => (prev + 1) % banners.length);
//       }, 5000); // Change slide every 5 seconds

//       return () => clearInterval(interval);
//     }
//   }, [banners.length]);

//   // Update scroll position when currentSlide changes
//   useEffect(() => {
//     if (banners.length > 0) {
//       goToSlide(currentSlide);
//     }
//   }, [currentSlide, banners.length]);
  
//   // Fetch banners from Firebase
//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const bannersRef = dbRef(db, 'banners');
        
//         onValue(bannersRef, async (snapshot) => {
//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             const now = new Date();
            
//             // Convert from object to array and filter active banners
//             const activeBanners = await Promise.all(
//               Object.entries(data)
//                 .filter(([key, value]) => {
//                   if (!value.isActive) return false;
//                   if (value.startDate && new Date(value.startDate) > now) return false;
//                   if (value.endDate && new Date(value.endDate) < now) return false;
//                   return true;
//                 })
//                 .map(async ([key, value]) => {
//                   try {
//                     const folderRef = storageRef(storage, `banners/${key}`);
//                     const fileList = await listAll(folderRef);
                    
//                     if (fileList.items.length === 0) {
//                       console.warn(`No images found for banner ${key}`);
//                       return null;
//                     }
                    
//                     const sortedItems = [...fileList.items].sort((a, b) => {
//                       const getTimestamp = (name) => {
//                         const match = name.match(/image_(\d+)/);
//                         return match ? parseInt(match[1]) : 0;
//                       };
//                       return getTimestamp(b.name) - getTimestamp(a.name);
//                     });
                    
//                     const imageURL = await getDownloadURL(sortedItems[0]);
                    
//                     // Get background color or use default color
//                     const backgroundColor = value.backgroundColor || '#ffcdd2';
                    
//                     return {
//                       id: key,
//                       title: value.title || '',
//                       subtitle: value.subtitle || '',
//                       description: value.description || '',
//                       productName: value.productName || key,
//                       image: imageURL,
//                       backgroundColor: backgroundColor,
//                       link: value.link || '/product',
//                       navigationType: value.navigationType || 'bestsellers',
//                       navigationText: value.navigationText || '',
//                       customLink: value.customLink || '',
//                       order: value.order || 0
//                     };
//                   } catch (error) {
//                     console.error(`Error fetching image for banner ${key}:`, error);
//                     return null;
//                   }
//                 })
//             );
            
//             const validBanners = activeBanners
//               .filter(banner => banner !== null)
//               .sort((a, b) => a.order - b.order); // Sort by order field
            
//             console.log("Valid banners:", validBanners);
//             setBanners(validBanners);
//           } else {
//             setBanners([]);
//           }
//           setLoading(false);
//         }, (error) => {
//           console.error("Error fetching banners:", error);
//           setLoading(false);
//         });
//       } catch (error) {
//         console.error('Error setting up banner listener:', error);
//         setLoading(false);
//       }
//     };
    
//     fetchBanners();
//   }, []);

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="banner-loading-container">
//         <div className="banner-loading">
//           <div className="loading-spinner">
//             <FaSpinner className="spinner-icon" />
//           </div>
//           <p>Loading banners...</p>
//         </div>
//       </div>
//     );
//   }

//   // If no banners are found after loading
//   if (!banners || banners.length === 0) {
//     return null;
//   }

//   return (
//     <div className="banner-section">
//       <div className="banner">
//         <div className="banner-slider">
//           <div className="banner-container">
//             {banners.map((banner, index) => (
//               <div key={banner.id} className="banner-card" style={{ backgroundColor: banner.backgroundColor || '#ffcdd2' }}>
//                 <div className="banner-content">
//                   <div className="banner-image">
//                     <img src={banner.image} alt={banner.productName} />
//                   </div>
//                   <div className="banner-card-buttons">
//                     <button 
//                       className={`banner-action-button ${banner.navigationType}-button`}
//                       onClick={() => handleNavigation(banner.navigationType, banner.customLink)}
//                     >
//                       {getNavigationButtonText(banner.navigationType, banner.navigationText)}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           {banners.length > 1 && (
//             <div className="slider-controls">
//               {banners.map((_, index) => (
//                 <span 
//                   key={index}
//                   className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
//                   onClick={() => setCurrentSlide(index)}
//                 ></span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
      
//       <div className="meat-cut-options">
//         <button 
//           onClick={() => handleMeatCutSelection('jc-jatka')} 
//           className={`meat-cut-button jc-jatka ${selectedMeatCut === 'jc-jatka' ? 'active' : ''}`}
//         >
//           Desi Cut
//         </button>
//         <button 
//           onClick={() => handleMeatCutSelection('halal-cut')} 
//           className={`meat-cut-button halal-cut ${selectedMeatCut === 'halal-cut' ? 'active' : ''}`}
//         >
//           Halal Cut
//         </button>
//         {selectedMeatCut && (
//           <button 
//             onClick={handleClearFilter} 
//             className="meat-cut-button clear-filter"
//           >
//             Clear Filter
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Banner;






// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { FaSpinner } from 'react-icons/fa';
// import { db, storage } from '../firebase/config';
// import { ref as dbRef, onValue } from 'firebase/database';
// import { ref as storageRef, getDownloadURL, listAll } from 'firebase/storage';
// import '../styles/components/Banner.css';

// const Banner = () => {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedMeatCut, setSelectedMeatCut] = useState(localStorage.getItem('selectedMeatCut') || '');
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const navigate = useNavigate();
//   const location = useLocation();
 
//   // Handle meat cut category selection
//   const handleMeatCutSelection = (cutType) => {
//     if (selectedMeatCut === cutType) {
//       localStorage.removeItem('selectedMeatCut');
//       setSelectedMeatCut('');
//     } else {
//       localStorage.setItem('selectedMeatCut', cutType);
//       setSelectedMeatCut(cutType);
//     }
//     window.location.reload();
//   };

//   // Handle clearing the meat cut filter
//   const handleClearFilter = () => {
//     localStorage.removeItem('selectedMeatCut');
//     setSelectedMeatCut('');
//     window.location.reload();
//   };
  
//   // Navigate to bestsellers section
//   const navigateToBestsellers = () => {
//     if (location.pathname !== '/') {
//       navigate('/');
//       sessionStorage.setItem('scrollToBestsellers', 'true');
//     } else {
//       scrollToBestsellers();
//     }
//   };

//   // Function to handle the actual scrolling
//   const scrollToBestsellers = () => {
//     const bestsellersSection = document.querySelector('#bestsellers-section, .bestsellers-section, .BestSellers');
//     if (bestsellersSection) {
//       bestsellersSection.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   // Navigate to categories page
//   const navigateToCategories = () => {
//     navigate('/categories');
//   };

//   // Navigate to MatchDay Essentials
//   const navigateToMatchDayEssentials = () => {
//     if (location.pathname !== '/') {
//       navigate('/');
//       sessionStorage.setItem('scrollToMatchDayEssentials', 'true');
//     } else {
//       scrollToMatchDayEssentials();
//     }
//   };

//   // Function to scroll to MatchDay Essentials
//   const scrollToMatchDayEssentials = () => {
//     const matchDaySection = document.querySelector('.matchday-essentials-section, .match-day-essentials, .MatchDayEssentials, .match-day-section');
//     if (matchDaySection) {
//       matchDaySection.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   // Navigate to Premium Selections
//   const navigateToPremiumSelections = () => {
//     if (location.pathname !== '/') {
//       navigate('/');
//       sessionStorage.setItem('scrollToPremium', 'true');
//     } else {
//       scrollToPremiumSelections();
//     }
//   };

//   // Function to scroll to Premium Selections
//   const scrollToPremiumSelections = () => {
//     const premiumSection = document.querySelector('.seafood-section, .premium-selections, .PremiumSelections');
//     if (premiumSection) {
//       premiumSection.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   // Navigate to Dynamic Section
//   const navigateToDynamicSection = (sectionId) => {
//     if (location.pathname !== '/') {
//       navigate('/');
//       sessionStorage.setItem('scrollToDynamic', sectionId);
//     } else {
//       scrollToDynamicSection(sectionId);
//     }
//   };

//   // Function to scroll to Dynamic Section
//   const scrollToDynamicSection = (sectionId) => {
//     // Try multiple possible selectors for dynamic sections
//     const possibleSelectors = [
//       `.${sectionId}-section`,
//       `#${sectionId}-section`,
//       `[data-section="${sectionId}"]`,
//       `.section.${sectionId}`,
//       `.dynamic-section[data-id="${sectionId}"]`,
//       `.${sectionId}`,
//       `.DynamicSection[data-id="${sectionId}"]`,
//       `.DynamicSection`
//     ];
    
//     let dynamicSection = null;
//     for (const selector of possibleSelectors) {
//       dynamicSection = document.querySelector(selector);
//       if (dynamicSection) break;
//     }
    
//     if (dynamicSection) {
//       dynamicSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     } else {
//       console.warn(`Section with ID "${sectionId}" not found`);
//     }
//   };

//   // Handle navigation based on button type
//   const handleNavigation = (navigationType, customLink) => {
//     console.log(`Navigating to: ${navigationType}`, customLink); // Debug log
    
//     switch (navigationType) {
//       case 'bestsellers':
//         navigateToBestsellers();
//         break;
//       case 'categories':
//         navigateToCategories();
//         break;
//       case 'matchday-essentials':
//         navigateToMatchDayEssentials();
//         break;
//       case 'premium-selections':
//         navigateToPremiumSelections();
//         break;
//       case 'dynamic-section':
//         if (customLink) {
//           navigateToDynamicSection(customLink);
//         } else {
//           console.warn('Dynamic section navigation requires a section ID');
//         }
//         break;
//       case 'custom-link':
//         if (customLink) {
//           if (customLink.startsWith('http')) {
//             window.open(customLink, '_blank');
//           } else if (customLink.startsWith('/')) {
//             navigate(customLink);
//           } else {
//             // Try to scroll to section if it's not a URL
//             const sectionSelectors = [
//               `#${customLink}`, 
//               `.${customLink}`, 
//               `.${customLink}-section`,
//               `.${customLink.replace(/\s+/g, '')}` // Remove spaces for component names
//             ];
            
//             let section = null;
//             for (const selector of sectionSelectors) {
//               section = document.querySelector(selector);
//               if (section) break;
//             }
            
//             if (section) {
//               section.scrollIntoView({ behavior: 'smooth', block: 'start' });
//             } else {
//               navigate(`/${customLink}`);
//             }
//           }
//         } else {
//           console.warn('Custom link navigation requires a link');
//         }
//         break;
//       default:
//         console.warn(`Unknown navigation type: ${navigationType}`);
//         navigateToBestsellers(); // Fallback
//     }
//   };

//   // Get navigation button text
//   const getNavigationButtonText = (navigationType, customText) => {
//     if (customText) return customText;
    
//     switch (navigationType) {
//       case 'bestsellers':
//         return 'Bestsellers';
//       case 'categories':
//         return 'Categories';
//       case 'matchday-essentials':
//         return 'MatchDayEssentials';
//       case 'premium-selections':
//         return 'Premium Selections';
//       case 'dynamic-section':
//         return 'View Section';
//       case 'custom-link':
//         return 'View More';
//       default:
//         return 'View More';
//     }
//   };

//   // Check for scroll flags on component mount
//   useEffect(() => {
//     if (location.pathname === '/') {
//       const shouldScrollBestsellers = sessionStorage.getItem('scrollToBestsellers');
//       const shouldScrollMatchDay = sessionStorage.getItem('scrollToMatchDayEssentials');
//       const shouldScrollPremium = sessionStorage.getItem('scrollToPremium');
//       const shouldScrollDynamic = sessionStorage.getItem('scrollToDynamic');
      
//       if (shouldScrollBestsellers === 'true') {
//         sessionStorage.removeItem('scrollToBestsellers');
//         // Add multiple delays to ensure DOM is fully loaded
//         setTimeout(() => scrollToBestsellers(), 100);
//         setTimeout(() => scrollToBestsellers(), 500);
//         setTimeout(() => scrollToBestsellers(), 1000);
//       } else if (shouldScrollMatchDay === 'true') {
//         sessionStorage.removeItem('scrollToMatchDayEssentials');
//         setTimeout(() => scrollToMatchDayEssentials(), 100);
//         setTimeout(() => scrollToMatchDayEssentials(), 500);
//         setTimeout(() => scrollToMatchDayEssentials(), 1000);
//       } else if (shouldScrollPremium === 'true') {
//         sessionStorage.removeItem('scrollToPremium');
//         setTimeout(() => scrollToPremiumSelections(), 100);
//         setTimeout(() => scrollToPremiumSelections(), 500);
//         setTimeout(() => scrollToPremiumSelections(), 1000);
//       } else if (shouldScrollDynamic) {
//         const sectionId = shouldScrollDynamic;
//         sessionStorage.removeItem('scrollToDynamic');
//         setTimeout(() => scrollToDynamicSection(sectionId), 100);
//         setTimeout(() => scrollToDynamicSection(sectionId), 500);
//         setTimeout(() => scrollToDynamicSection(sectionId), 1000);
//       }
//     }
//   }, [location.pathname]);

//   // Handle slider navigation
//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//     const container = document.querySelector('.banner-container');
//     if (container) {
//       const slideWidth = container.children[0]?.offsetWidth || 350;
//       const gap = 15;
//       container.scrollTo({
//         left: index * (slideWidth + gap),
//         behavior: 'smooth'
//       });
//     }
//   };

//   // Auto-slide functionality
//   useEffect(() => {
//     if (banners.length > 1) {
//       const interval = setInterval(() => {
//         setCurrentSlide(prev => (prev + 1) % banners.length);
//       }, 5000); // Change slide every 5 seconds

//       return () => clearInterval(interval);
//     }
//   }, [banners.length]);

//   // Update scroll position when currentSlide changes
//   useEffect(() => {
//     if (banners.length > 0) {
//       goToSlide(currentSlide);
//     }
//   }, [currentSlide, banners.length]);
  
//   // Fetch banners from Firebase
//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const bannersRef = dbRef(db, 'banners');
        
//         onValue(bannersRef, async (snapshot) => {
//           if (snapshot.exists()) {
//             const data = snapshot.val();
//             const now = new Date();
            
//             // Convert from object to array and filter active banners
//             const activeBanners = await Promise.all(
//               Object.entries(data)
//                 .filter(([key, value]) => {
//                   if (!value.isActive) return false;
//                   if (value.startDate && new Date(value.startDate) > now) return false;
//                   if (value.endDate && new Date(value.endDate) < now) return false;
//                   return true;
//                 })
//                 .map(async ([key, value]) => {
//                   try {
//                     const folderRef = storageRef(storage, `banners/${key}`);
//                     const fileList = await listAll(folderRef);
                    
//                     if (fileList.items.length === 0) {
//                       console.warn(`No images found for banner ${key}`);
//                       return null;
//                     }
                    
//                     const sortedItems = [...fileList.items].sort((a, b) => {
//                       const getTimestamp = (name) => {
//                         const match = name.match(/image_(\d+)/);
//                         return match ? parseInt(match[1]) : 0;
//                       };
//                       return getTimestamp(b.name) - getTimestamp(a.name);
//                     });
                    
//                     const imageURL = await getDownloadURL(sortedItems[0]);
                    
//                     // Get background color or use default color
//                     const backgroundColor = value.backgroundColor || '#ffcdd2';
                    
//                     return {
//                       id: key,
//                       title: value.title || '',
//                       subtitle: value.subtitle || '',
//                       description: value.description || '',
//                       productName: value.productName || key,
//                       image: imageURL,
//                       backgroundColor: backgroundColor,
//                       link: value.link || '/product',
//                       navigationType: value.navigationType || 'bestsellers',
//                       navigationText: value.navigationText || '',
//                       customLink: value.customLink || '',
//                       order: value.order || 0
//                     };
//                   } catch (error) {
//                     console.error(`Error fetching image for banner ${key}:`, error);
//                     return null;
//                   }
//                 })
//             );
            
//             const validBanners = activeBanners
//               .filter(banner => banner !== null)
//               .sort((a, b) => a.order - b.order); // Sort by order field
            
//             console.log("Valid banners:", validBanners);
//             setBanners(validBanners);
//           } else {
//             setBanners([]);
//           }
//           setLoading(false);
//         }, (error) => {
//           console.error("Error fetching banners:", error);
//           setLoading(false);
//         });
//       } catch (error) {
//         console.error('Error setting up banner listener:', error);
//         setLoading(false);
//       }
//     };
    
//     fetchBanners();
//   }, []);

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="banner-loading-container">
//         <div className="banner-loading">
//           <div className="loading-spinner">
//             <FaSpinner className="spinner-icon" />
//           </div>
//           <p>Loading banners...</p>
//         </div>
//       </div>
//     );
//   }

//   // If no banners are found after loading
//   if (!banners || banners.length === 0) {
//     return null;
//   }

//   return (
//     <div className="banner-section">
//       <div className="banner">
//         <div className="banner-slider">
//           <div className="banner-container">
//             {banners.map((banner, index) => (
//               <div key={banner.id} className="banner-card" style={{ backgroundColor: banner.backgroundColor || '#ffcdd2' }}>
//                 <div className="banner-content">
//                   <div className="banner-image">
//                     <img src={banner.image} alt={banner.productName} />
//                   </div>
//                   <div className="banner-card-buttons">
//                     <button 
//                       className={`banner-action-button ${banner.navigationType}-button`}
//                       onClick={() => handleNavigation(banner.navigationType, banner.customLink)}
//                     >
//                       {getNavigationButtonText(banner.navigationType, banner.navigationText)}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           {banners.length > 1 && (
//             <div className="slider-controls">
//               {banners.map((_, index) => (
//                 <span 
//                   key={index}
//                   className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
//                   onClick={() => setCurrentSlide(index)}
//                 ></span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
      
//       <div className="meat-cut-options">
//         <button 
//           onClick={() => handleMeatCutSelection('jc-jatka')} 
//           className={`meat-cut-button jc-jatka ${selectedMeatCut === 'jc-jatka' ? 'active' : ''}`}
//         >
//           Desi Cut
//         </button>
//         <button 
//           onClick={() => handleMeatCutSelection('halal-cut')} 
//           className={`meat-cut-button halal-cut ${selectedMeatCut === 'halal-cut' ? 'active' : ''}`}
//         >
//           Halal Cut
//         </button>
//         {selectedMeatCut && (
//           <button 
//             onClick={handleClearFilter} 
//             className="meat-cut-button clear-filter"
//           >
//             Clear Filter
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Banner;



import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { db, storage } from '../firebase/config';
import { ref as dbRef, onValue } from 'firebase/database';
import { ref as storageRef, getDownloadURL, listAll } from 'firebase/storage';
import '../styles/components/Banner.css';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeatCut, setSelectedMeatCut] = useState(localStorage.getItem('selectedMeatCut') || '');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
 
  // Handle meat cut category selection
  const handleMeatCutSelection = (cutType) => {
    if (selectedMeatCut === cutType) {
      localStorage.removeItem('selectedMeatCut');
      setSelectedMeatCut('');
    } else {
      localStorage.setItem('selectedMeatCut', cutType);
      setSelectedMeatCut(cutType);
    }
    window.location.reload();
  };

  // Handle clearing the meat cut filter
  const handleClearFilter = () => {
    localStorage.removeItem('selectedMeatCut');
    setSelectedMeatCut('');
    window.location.reload();
  };
  
  // Navigate to bestsellers section
  const navigateToBestsellers = () => {
    if (location.pathname !== '/') {
      navigate('/');
      sessionStorage.setItem('scrollToBestsellers', 'true');
    } else {
      scrollToBestsellers();
    }
  };

  // Function to handle the actual scrolling
  const scrollToBestsellers = () => {
    const bestsellersSection = document.querySelector('#bestsellers-section, .bestsellers-section, .BestSellers');
    if (bestsellersSection) {
      bestsellersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigate to categories page
  const navigateToCategories = () => {
    navigate('/categories');
  };

  // Navigate to MatchDay Essentials
  const navigateToMatchDayEssentials = () => {
    if (location.pathname !== '/') {
      navigate('/');
      sessionStorage.setItem('scrollToMatchDayEssentials', 'true');
    } else {
      scrollToMatchDayEssentials();
    }
  };

  // Function to scroll to MatchDay Essentials
  const scrollToMatchDayEssentials = () => {
    const matchDaySection = document.querySelector('.matchday-essentials-section, .match-day-essentials, .MatchDayEssentials, .match-day-section');
    if (matchDaySection) {
      matchDaySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigate to Premium Selections
  const navigateToPremiumSelections = () => {
    if (location.pathname !== '/') {
      navigate('/');
      sessionStorage.setItem('scrollToPremium', 'true');
    } else {
      scrollToPremiumSelections();
    }
  };

  // Function to scroll to Premium Selections
  const scrollToPremiumSelections = () => {
    const premiumSection = document.querySelector('.seafood-section, .premium-selections, .PremiumSelections');
    if (premiumSection) {
      premiumSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigate to Dynamic Section
  const navigateToDynamicSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      sessionStorage.setItem('scrollToDynamic', sectionId);
    } else {
      scrollToDynamicSection(sectionId);
    }
  };

  // Function to scroll to Dynamic Section
  const scrollToDynamicSection = (sectionId) => {
    // Try multiple possible selectors for dynamic sections
    const possibleSelectors = [
      `.${sectionId}-section`,
      `#${sectionId}-section`,
      `[data-section="${sectionId}"]`,
      `.section.${sectionId}`,
      `.dynamic-section[data-id="${sectionId}"]`,
      `.${sectionId}`,
      `.DynamicSection[data-id="${sectionId}"]`,
      `.DynamicSection`
    ];
    
    let dynamicSection = null;
    for (const selector of possibleSelectors) {
      dynamicSection = document.querySelector(selector);
      if (dynamicSection) break;
    }
    
    if (dynamicSection) {
      dynamicSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Section with ID "${sectionId}" not found`);
    }
  };

  // Handle navigation based on button type
  const handleNavigation = (navigationType, customLink) => {
    console.log(`Navigating to: ${navigationType}`, customLink); // Debug log
    
    switch (navigationType) {
      case 'bestsellers':
        navigateToBestsellers();
        break;
      case 'categories':
        navigateToCategories();
        break;
      case 'matchday-essentials':
        navigateToMatchDayEssentials();
        break;
      case 'premium-selections':
        navigateToPremiumSelections();
        break;
      case 'dynamic-section':
        if (customLink) {
          navigateToDynamicSection(customLink);
        } else {
          console.warn('Dynamic section navigation requires a section ID');
        }
        break;
      case 'custom-link':
        if (customLink) {
          if (customLink.startsWith('http')) {
            window.open(customLink, '_blank');
          } else if (customLink.startsWith('/')) {
            navigate(customLink);
          } else {
            // Try to scroll to section if it's not a URL
            const sectionSelectors = [
              `#${customLink}`, 
              `.${customLink}`, 
              `.${customLink}-section`,
              `.${customLink.replace(/\s+/g, '')}` // Remove spaces for component names
            ];
            
            let section = null;
            for (const selector of sectionSelectors) {
              section = document.querySelector(selector);
              if (section) break;
            }
            
            if (section) {
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              navigate(`/${customLink}`);
            }
          }
        } else {
          console.warn('Custom link navigation requires a link');
        }
        break;
      default:
        console.warn(`Unknown navigation type: ${navigationType}`);
        navigateToBestsellers(); // Fallback
    }
  };

  // Get navigation button text
  const getNavigationButtonText = (navigationType, customText) => {
    if (customText) return customText;
    
    switch (navigationType) {
      case 'bestsellers':
        return 'Bestsellers';
      case 'categories':
        return 'Categories';
      case 'matchday-essentials':
        return 'MatchDayEssentials';
      case 'premium-selections':
        return 'Premium Selections';
      case 'dynamic-section':
        return 'View Section';
      case 'custom-link':
        return 'View More';
      default:
        return 'View More';
    }
  };

  // Check for scroll flags on component mount
  useEffect(() => {
    if (location.pathname === '/') {
      const shouldScrollBestsellers = sessionStorage.getItem('scrollToBestsellers');
      const shouldScrollMatchDay = sessionStorage.getItem('scrollToMatchDayEssentials');
      const shouldScrollPremium = sessionStorage.getItem('scrollToPremium');
      const shouldScrollDynamic = sessionStorage.getItem('scrollToDynamic');
      
      if (shouldScrollBestsellers === 'true') {
        sessionStorage.removeItem('scrollToBestsellers');
        // Add multiple delays to ensure DOM is fully loaded
        setTimeout(() => scrollToBestsellers(), 100);
        setTimeout(() => scrollToBestsellers(), 500);
        setTimeout(() => scrollToBestsellers(), 1000);
      } else if (shouldScrollMatchDay === 'true') {
        sessionStorage.removeItem('scrollToMatchDayEssentials');
        setTimeout(() => scrollToMatchDayEssentials(), 100);
        setTimeout(() => scrollToMatchDayEssentials(), 500);
        setTimeout(() => scrollToMatchDayEssentials(), 1000);
      } else if (shouldScrollPremium === 'true') {
        sessionStorage.removeItem('scrollToPremium');
        setTimeout(() => scrollToPremiumSelections(), 100);
        setTimeout(() => scrollToPremiumSelections(), 500);
        setTimeout(() => scrollToPremiumSelections(), 1000);
      } else if (shouldScrollDynamic) {
        const sectionId = shouldScrollDynamic;
        sessionStorage.removeItem('scrollToDynamic');
        setTimeout(() => scrollToDynamicSection(sectionId), 100);
        setTimeout(() => scrollToDynamicSection(sectionId), 500);
        setTimeout(() => scrollToDynamicSection(sectionId), 1000);
      }
    }
  }, [location.pathname]);

  // Handle slider navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
    const container = document.querySelector('.banner-container');
    if (container) {
      const slideWidth = container.children[0]?.offsetWidth || 350;
      const gap = 15;
      container.scrollTo({
        left: index * (slideWidth + gap),
        behavior: 'smooth'
      });
    }
  };

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % banners.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // Update scroll position when currentSlide changes
  useEffect(() => {
    if (banners.length > 0) {
      goToSlide(currentSlide);
    }
  }, [currentSlide, banners.length]);
  
  // Fetch banners from Firebase
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannersRef = dbRef(db, 'banners');
        
        onValue(bannersRef, async (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const now = new Date();
            
            // Convert from object to array and filter active banners
            const activeBanners = await Promise.all(
              Object.entries(data)
                .filter(([key, value]) => {
                  if (!value.isActive) return false;
                  if (value.startDate && new Date(value.startDate) > now) return false;
                  if (value.endDate && new Date(value.endDate) < now) return false;
                  return true;
                })
                .map(async ([key, value]) => {
                  try {
                    const folderRef = storageRef(storage, `banners/${key}`);
                    const fileList = await listAll(folderRef);
                    
                    if (fileList.items.length === 0) {
                      console.warn(`No images found for banner ${key}`);
                      return null;
                    }
                    
                    const sortedItems = [...fileList.items].sort((a, b) => {
                      const getTimestamp = (name) => {
                        const match = name.match(/image_(\d+)/);
                        return match ? parseInt(match[1]) : 0;
                      };
                      return getTimestamp(b.name) - getTimestamp(a.name);
                    });
                    
                    const imageURL = await getDownloadURL(sortedItems[0]);
                    
                    // Get background color or use default color
                    const backgroundColor = value.backgroundColor || '#ffcdd2';
                    
                    return {
                      id: key,
                      title: value.title || '',
                      subtitle: value.subtitle || '',
                      description: value.description || '',
                      productName: value.productName || key,
                      image: imageURL,
                      backgroundColor: backgroundColor,
                      link: value.link || '/product',
                      navigationType: value.navigationType || 'bestsellers',
                      navigationText: value.navigationText || '',
                      customLink: value.customLink || '',
                      order: value.order || 0
                    };
                  } catch (error) {
                    console.error(`Error fetching image for banner ${key}:`, error);
                    return null;
                  }
                })
            );
            
            const validBanners = activeBanners
              .filter(banner => banner !== null)
              .sort((a, b) => a.order - b.order); // Sort by order field
            
            console.log("Valid banners:", validBanners);
            setBanners(validBanners);
          } else {
            setBanners([]);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching banners:", error);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error setting up banner listener:', error);
        setLoading(false);
      }
    };
    
    fetchBanners();
  }, []);

  // Render the Meat Cut Options section (should always be displayed)
  const renderMeatCutOptions = () => {
    return (
      <div className="meat-cut-options">
        <button 
          onClick={() => handleMeatCutSelection('jc-jatka')} 
          className={`meat-cut-button jc-jatka ${selectedMeatCut === 'jc-jatka' ? 'active' : ''}`}
        >
          Desi Cut
        </button>
        <button 
          onClick={() => handleMeatCutSelection('halal-cut')} 
          className={`meat-cut-button halal-cut ${selectedMeatCut === 'halal-cut' ? 'active' : ''}`}
        >
          Halal Cut
        </button>
        {selectedMeatCut && (
          <button 
            onClick={handleClearFilter} 
            className="meat-cut-button clear-filter"
          >
            Clear Filter
          </button>
        )}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="banner-loading-container">
        <div className="banner-loading">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
          </div>
          <p>Loading banners...</p>
        </div>
      </div>
    );
  }

  // Return just the meat cut options if no banners are available
  if (!banners || banners.length === 0) {
    return (
      <div className="banner-section">
        {renderMeatCutOptions()}
      </div>
    );
  }

  // Return full banner section with slider and meat cut options if banners are available
  return (
    <div className="banner-section">
      <div className="banner">
        <div className="banner-slider">
          <div className="banner-container">
            {banners.map((banner, index) => (
              <div key={banner.id} className="banner-card" style={{ backgroundColor: banner.backgroundColor || '#ffcdd2' }}>
                <div className="banner-content">
                  <div className="banner-image">
                    <img src={banner.image} alt={banner.productName} />
                  </div>
                  <div className="banner-card-buttons">
                    <button 
                      className={`banner-action-button ${banner.navigationType}-button`}
                      onClick={() => handleNavigation(banner.navigationType, banner.customLink)}
                    >
                      {getNavigationButtonText(banner.navigationType, banner.navigationText)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {banners.length > 1 && (
            <div className="slider-controls">
              {banners.map((_, index) => (
                <span 
                  key={index}
                  className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {renderMeatCutOptions()}
    </div>
  );
};

export default Banner;