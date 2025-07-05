

// // src/components/CategoryGrid.js
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { ref, onValue } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/components/CategoryGrid.css';

// const CategoryGrid = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     // Set up a listener for categories from Firebase
//     const fetchCategories = () => {
//       try {
//         console.log("Fetching categories from Firebase...");
        
//         // Create reference to the categories node in the database
//         const categoriesRef = ref(db, 'categories');
        
//         // Set up a listener for changes
//         const unsubscribe = onValue(categoriesRef, (snapshot) => {
//           if (snapshot.exists()) {
//             const categoriesData = snapshot.val();
//             const categoriesArray = Object.keys(categoriesData).map(key => ({
//               ...categoriesData[key],
//               firebaseKey: key // Store the Firebase key for future reference
//             }));
            
//             if (categoriesArray.length > 0) {
//               console.log('Fetched categories from Firebase:', categoriesArray);
//               setCategories(categoriesArray);
//             } else {
//               // If no categories, use default ones
//               console.log('No categories found in Firebase, using default categories');
//               setCategories(getDefaultCategories());
//             }
//           } else {
//             // If no data in Firebase, use default categories
//             console.log('No data in Firebase, using default categories');
//             setCategories(getDefaultCategories());
//           }
          
//           setLoading(false);
//         }, (error) => {
//           console.error("Error fetching categories:", error);
//           setError("Failed to load categories");
//           setCategories(getDefaultCategories());
//           setLoading(false);
//         });
        
//         // Return cleanup function
//         return unsubscribe;
//       } catch (error) {
//         console.error('Error setting up listener:', error);
//         setError('Failed to load categories');
//         setCategories(getDefaultCategories());
//         setLoading(false);
//         return () => {}; // Return empty function as fallback
//       }
//     };
    
//     // Start the listener and store the unsubscribe function
//     const unsubscribe = fetchCategories();
    
//     // Clean up function to remove listener when component unmounts
//     return () => {
//       if (typeof unsubscribe === 'function') {
//         unsubscribe();
//       }
//     };
//   }, []);
  
//   // Default categories to use as fallback
//   const getDefaultCategories = () => {
//     return [
//       {
//         id: 'chicken',
//         name: 'Chicken',
//         image: 'https://t3.ftcdn.net/jpg/08/47/55/46/360_F_847554699_5QdX4XsvKyjMt1KjHAUPJ3y9Z3lhfin2.jpg'
//       },
//       {
//         id: 'fish-seafood',
//         name: 'Fish & Seafood',
//         image: 'https://img.favpng.com/25/16/11/fish-fry-seafood-meat-png-favpng-gfcfXW94RZSSLUKQ9Dj12HY5b.jpg'
//       },
//       {
//         id: 'mutton',
//         name: 'Mutton',
//         image: 'https://godavaricuts.com/cdn/shop/files/Godavari-Cuts-Day-1-_36-of-65_1.jpg?v=1682936866'
//       },
//       {
//         id: 'liver-more',
//         name: 'Liver & More',
//         image: 'https://www.bigbasket.com/media/uploads/p/xxl/40048915_4-fresho-mutton-liver-antibiotic-residue-free-growth-hormone-free.jpg'
//       },
//       {
//         id: 'prawns-crabs',
//         name: 'Prawns & Crabs',
//         image: 'https://colchesteroysterfishery.com/cdn/shop/files/LMS_IMG_4258-VSCO.jpg?v=1698928291'
//       },
//       {
//         id: 'eggs',
//         name: 'Eggs',
//         image: 'https://img.freepik.com/free-photo/main-ingredient-cooking-different-dishes-eggs_185193-108933.jpg'
//       },
//       {
//         id: 'combos',
//         name: 'Combos',
//         image: 'https://assets.tendercuts.in/product/C/O/ca18870d-ab04-4f51-9986-f72a8394cc9a.webp'
//       }
//     ];
//   };
  
//   if (loading) {
//     return <div className="loading">Loading categories...</div>;
//   }
  
//   if (error) {
//     return <div className="error">{error}</div>;
//   }
  
//   // Handle missing images
//   const handleImageError = (e) => {
//     e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
//   };
  
//   return (
//     <section className="category-section section">
//       <div className="category-title">
//         <h2>Shop by categories</h2>
//         {/* <p className="category-subtitle">Freshest meats and much more!</p> */}
//       </div>
      
//       <div className="category-grid">
//         {categories.map(category => (
//           <Link 
//             to={`/category/${category.id}`}
//             className="category-card"
//             key={category.id || category.firebaseKey}
//           >
//             <div className="category-image">
//               <img 
//                 src={category.image} 
//                 alt={category.name}
//                 onError={handleImageError}
//               />
//             </div>
//             <h3 className="category-name">{category.name}</h3>
//           </Link>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default CategoryGrid;






// src/components/CategoryGrid.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/components/CategoryGrid.css';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Set up a listener for categories from Firebase
    const fetchCategories = () => {
      try {
        console.log("Fetching categories from Firebase...");
        
        // First try to fetch from displayCategories (new system from CreateItems admin panel)
        const displayCategoriesRef = ref(db, 'displayCategories');
        
        // Set up a listener for changes
        const unsubscribe = onValue(displayCategoriesRef, (snapshot) => {
          if (snapshot.exists()) {
            const categoriesData = snapshot.val();
            const categoriesArray = Object.keys(categoriesData).map(key => ({
              ...categoriesData[key],
              firebaseKey: key // Store the Firebase key for future reference
            }))
            .filter(category => category.isActive !== false) // Only show active categories
            .sort((a, b) => {
              // Sort by creation date (newest first) or name
              if (a.createdAt && b.createdAt) {
                return b.createdAt - a.createdAt;
              }
              return a.name.localeCompare(b.name);
            });
            
            if (categoriesArray.length > 0) {
              console.log('Fetched display categories from Firebase:', categoriesArray);
              setCategories(categoriesArray);
            } else {
              // If no display categories, check old categories collection for backward compatibility
              console.log('No display categories found, checking old categories...');
              fetchOldCategories();
            }
          } else {
            // If no display categories, check old categories collection
            console.log('No display categories data, checking old categories...');
            fetchOldCategories();
          }
          
          setLoading(false);
        }, (error) => {
          console.error("Error fetching display categories:", error);
          // Try old categories as fallback
          fetchOldCategories();
        });
        
        // Return cleanup function
        return unsubscribe;
      } catch (error) {
        console.error('Error setting up display categories listener:', error);
        fetchOldCategories();
        return () => {}; // Return empty function as fallback
      }
    };

    // Fallback function to fetch from old categories collection
    const fetchOldCategories = () => {
      try {
        const categoriesRef = ref(db, 'categories');
        
        const unsubscribe = onValue(categoriesRef, (snapshot) => {
          if (snapshot.exists()) {
            const categoriesData = snapshot.val();
            const categoriesArray = Object.keys(categoriesData).map(key => ({
              ...categoriesData[key],
              firebaseKey: key,
              isActive: true // Assume old categories are active
            }));
            
            console.log('Fetched old categories from Firebase:', categoriesArray);
            setCategories(categoriesArray);
          } else {
            // If no data in Firebase, use default categories
            console.log('No data in Firebase, using default categories');
            setCategories(getDefaultCategories());
          }
          
          setLoading(false);
        }, (error) => {
          console.error("Error fetching old categories:", error);
          setError("Failed to load categories");
          setCategories(getDefaultCategories());
          setLoading(false);
        });
        
        return unsubscribe;
      } catch (error) {
        console.error('Error setting up old categories listener:', error);
        setError('Failed to load categories');
        setCategories(getDefaultCategories());
        setLoading(false);
        return () => {};
      }
    };
    
    // Start the listener and store the unsubscribe function
    const unsubscribe = fetchCategories();
    
    // Clean up function to remove listener when component unmounts
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);
  
  // Default categories to use as fallback
  const getDefaultCategories = () => {
    return [
      {
        id: 'chicken',
        name: 'Chicken',
        image: 'https://t3.ftcdn.net/jpg/08/47/55/46/360_F_847554699_5QdX4XsvKyjMt1KjHAUPJ3y9Z3lhfin2.jpg',
        description: 'Fresh chicken products',
        productCount: 0,
        isActive: true
      },
      {
        id: 'fish-seafood',
        name: 'Fish & Seafood',
        image: 'https://img.favpng.com/25/16/11/fish-fry-seafood-meat-png-favpng-gfcfXW94RZSSLUKQ9Dj12HY5b.jpg',
        description: 'Fresh fish and seafood',
        productCount: 0,
        isActive: true
      },
      {
        id: 'mutton',
        name: 'Mutton',
        image: 'https://godavaricuts.com/cdn/shop/files/Godavari-Cuts-Day-1-_36-of-65_1.jpg?v=1682936866',
        description: 'Premium mutton cuts',
        productCount: 0,
        isActive: true
      },
      {
        id: 'liver-more',
        name: 'Liver & More',
        image: 'https://www.bigbasket.com/media/uploads/p/xxl/40048915_4-fresho-mutton-liver-antibiotic-residue-free-growth-hormone-free.jpg',
        description: 'Liver and organ meat',
        productCount: 0,
        isActive: true
      },
      {
        id: 'prawns-crabs',
        name: 'Prawns & Crabs',
        image: 'https://colchesteroysterfishery.com/cdn/shop/files/LMS_IMG_4258-VSCO.jpg?v=1698928291',
        description: 'Fresh prawns and crabs',
        productCount: 0,
        isActive: true
      },
      {
        id: 'eggs',
        name: 'Eggs',
        image: 'https://img.freepik.com/free-photo/main-ingredient-cooking-different-dishes-eggs_185193-108933.jpg',
        description: 'Farm fresh eggs',
        productCount: 0,
        isActive: true
      },
      {
        id: 'combos',
        name: 'Combos',
        image: 'https://assets.tendercuts.in/product/C/O/ca18870d-ab04-4f51-9986-f72a8394cc9a.webp',
        description: 'Value combo packages',
        productCount: 0,
        isActive: true
      }
    ];
  };

  // Handle missing images
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image+Available';
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <section className="category-section section">
      <div className="category-title">
        <h2>Shop by categories</h2>
        {/* <p className="category-subtitle">Freshest meats and much more!</p> */}
      </div>
      
      <div className="category-grid">
        {categories.map(category => (
          <Link 
            to={`/category/${category.id}`}
            className="category-card"
            key={category.id || category.firebaseKey}
          >
            <div className="category-image">
              <img 
                src={category.image} 
                alt={category.name}
                onError={handleImageError}
              />
              <div className="category-overlay">
                <div className="category-hover-content">
                  <h3 className="category-name">{category.name}</h3>
                  {category.description && (
                    <p className="category-description">{category.description}</p>
                  )}
                  {category.productCount !== undefined && (
                    <p className="product-count">{category.productCount} products available</p>
                  )}
                  <span className="view-category-btn">View Category</span>
                </div>
              </div>
            </div>
            <div className="category-info">
              <h3 className="category-name-bottom">{category.name}</h3>
              {/* {category.productCount !== undefined && (
                <p className="product-count-bottom">{category.productCount} items</p>
              )} */}
            </div>
          </Link>
        ))}
      </div>

      {categories.length === 0 && !loading && (
        <div className="no-categories">
          <p>No categories available at the moment.</p>
          <p>Categories will appear here once they are added by the admin.</p>
        </div>
      )}
    </section>
  );
};

export default CategoryGrid;