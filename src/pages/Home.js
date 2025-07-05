




// import React, { useState, useEffect } from 'react'; 
// import Banner from '../components/Banner'; 
// import BestSellers from '../components/BestSellers'; 
// import CategoryGrid from '../components/CategoryGrid'; 
// import MatchDayEssentials from '../components/MatchDayEssentials'; 
// import Testimonials from '../components/Testimonials'; 
// import Features from '../components/Features'; 
// import PremiumSelections from '../components/PremiumSelections';
// import DynamicSection from '../components/DynamicSection';
// import { ref, onValue } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/pages/Home.css'; 

// const Home = () => {
//   const [dynamicSections, setDynamicSections] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDynamicSections = () => {
//       try {
//         console.log("Fetching dynamic sections from Firebase...");
        
     
//         const sectionsRef = ref(db, 'sections');
       
//         onValue(sectionsRef, (snapshot) => {
//           if (snapshot.exists()) {
//             const sectionsData = snapshot.val();
//             const sectionsArray = Object.keys(sectionsData).map(key => ({
//               ...sectionsData[key],
//               firebaseKey: key
//             })).filter(section => section.isActive !== false); 
            
//             console.log('Fetched dynamic sections:', sectionsArray);
//             setDynamicSections(sectionsArray);
//           } else {
//             console.log('No dynamic sections found');
//             setDynamicSections([]);
//           }
          
//           setLoading(false);
//         }, (error) => {
//           console.error("Error fetching dynamic sections:", error);
//           setDynamicSections([]);
//           setLoading(false);
//         });
        
//       } catch (error) {
//         console.error('Error setting up sections listener:', error);
//         setDynamicSections([]);
//         setLoading(false);
//       }
//     };
    
//     fetchDynamicSections();
    
  
//     return () => {
//       const sectionsRef = ref(db, 'sections');
    
//       onValue(sectionsRef, () => {}, { onlyOnce: true });
//     };
//   }, []);

//   return (
//     <div className="home-page">

//       <Banner />

//        {!loading && dynamicSections.length > 0 && (
//         <>
//           {dynamicSections.map((section) => (
//             <div key={section.firebaseKey || section.id} className={`${section.id}-section section`}>
//               <DynamicSection 
//                 sectionName={section.name}
//                 sectionId={section.id}
//               />
//             </div>
//           ))}
//         </>
//       )}
   
//       <div id="bestsellers-section">
//         <BestSellers />
//       </div>
      
 
//       <MatchDayEssentials />
      
    
//       <div className="seafood-section section">
//         <PremiumSelections />
//       </div>
      
    
//       <CategoryGrid />
//     </div>
//   ); 
// };

// export default Home;




import React, { useState, useEffect } from 'react'; 
import Banner from '../components/Banner'; 
import BestSellers from '../components/BestSellers'; 
import CategoryGrid from '../components/CategoryGrid'; 
import MatchDayEssentials from '../components/MatchDayEssentials'; 
import Testimonials from '../components/Testimonials'; 
import Features from '../components/Features'; 
import PremiumSelections from '../components/PremiumSelections';
import DynamicSection from '../components/DynamicSection';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/pages/Home.css'; 

const Home = () => {
  const [dynamicSections, setDynamicSections] = useState([]);
  const [defaultSectionsStatus, setDefaultSectionsStatus] = useState({
    "Bestsellers": true,
    "Match Day Essentials": true,
    "Premium fish & seafood selection": true,
    "Shop by categories": true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both dynamic sections and default section status
    const fetchSections = () => {
      try {
        console.log("Fetching sections from Firebase...");
        
        // Fetch custom dynamic sections
        const sectionsRef = ref(db, 'sections');
        onValue(sectionsRef, (snapshot) => {
          if (snapshot.exists()) {
            const sectionsData = snapshot.val();
            const sectionsArray = Object.keys(sectionsData).map(key => ({
              ...sectionsData[key],
              firebaseKey: key
            })).filter(section => section.isActive !== false); 
            
            console.log('Fetched dynamic sections:', sectionsArray);
            setDynamicSections(sectionsArray);
          } else {
            console.log('No dynamic sections found');
            setDynamicSections([]);
          }
        }, (error) => {
          console.error("Error fetching dynamic sections:", error);
          setDynamicSections([]);
        });
        
        // Fetch default sections status from mainCategories
        const mainCategoriesRef = ref(db, 'mainCategories');
        onValue(mainCategoriesRef, (snapshot) => {
          if (snapshot.exists()) {
            const categoriesData = snapshot.val();
            const statusMap = {};
            
            // Process each default category
            Object.values(categoriesData).forEach(category => {
              statusMap[category.name] = category.isActive !== false;
            });
            
            console.log('Fetched default sections status:', statusMap);
            setDefaultSectionsStatus(prevStatus => ({
              ...prevStatus,
              ...statusMap
            }));
          }
          
          setLoading(false);
        }, (error) => {
          console.error("Error fetching main categories:", error);
          setLoading(false);
        });
        
      } catch (error) {
        console.error('Error setting up sections listeners:', error);
        setLoading(false);
      }
    };
    
    fetchSections();
    
    // Cleanup listeners on unmount
    return () => {
      const sectionsRef = ref(db, 'sections');
      const mainCategoriesRef = ref(db, 'mainCategories');
      
      onValue(sectionsRef, () => {}, { onlyOnce: true });
      onValue(mainCategoriesRef, () => {}, { onlyOnce: true });
    };
  }, []);

  return (
    <div className="home-page">
      {/* Banner is always shown */}
      <Banner />

      {/* Dynamic sections - only shown if active */}
      {!loading && dynamicSections.length > 0 && (
        <>
          {dynamicSections.map((section) => (
            <div key={section.firebaseKey || section.id} className={`${section.id}-section section`}>
              <DynamicSection 
                sectionName={section.name}
                sectionId={section.id}
              />
            </div>
          ))}
        </>
      )}
   
      {/* Bestsellers section - only shown if active */}
      {defaultSectionsStatus["Bestsellers"] && (
        <div id="bestsellers-section">
          <BestSellers />
        </div>
      )}
      
      {/* Match Day Essentials section - only shown if active */}
      {defaultSectionsStatus["Match Day Essentials"] && (
        <MatchDayEssentials />
      )}
      
      {/* Premium fish & seafood selection - only shown if active */}
      {defaultSectionsStatus["Premium fish & seafood selection"] && (
        <div className="seafood-section section">
          <PremiumSelections />
        </div>
      )}
      
      {/* Category Grid - only shown if Shop by categories is active */}
      {defaultSectionsStatus["Shop by categories"] && (
        <CategoryGrid />
      )}
    </div>
  ); 
};

export default Home;