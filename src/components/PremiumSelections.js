

// import React, { useState, useEffect } from 'react';
// import ProductCard from './ProductCard';
// import { ref, onValue } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/components/PremiumSelections.css';

// const PremiumSelections = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPremiumSelectionProducts = async () => {
//       try {
//         console.log("Fetching Premium fish & seafood selection from Firebase...");

//         // Create reference to the items node in the database
//         const itemsRef = ref(db, 'items');

//         // Set up a listener for changes
//         onValue(itemsRef, (snapshot) => {
//           if (snapshot.exists()) {
//             const itemsData = snapshot.val();
//             const itemsArray = Object.keys(itemsData).map(key => ({
//               ...itemsData[key],
//               firebaseKey: key // Store the Firebase key for future reference
//             }));

//             // Filter items for the "Premium fish & seafood selection" category
//             const premiumSelectionItems = itemsArray.filter(item => item.category === 'Premium fish & seafood selection');

//             if (premiumSelectionItems.length > 0) {
//               console.log('Fetched Premium fish & seafood selection from Firebase:', premiumSelectionItems);
//               setProducts(premiumSelectionItems);
//             } else {
//               console.log('No Premium fish & seafood selection found in Firebase');
//               setProducts([]); // No mock data, just set to empty array
//             }
//           } else {
//             console.log('No data in Firebase for Premium fish & seafood selection');
//             setProducts([]); // No mock data
//           }

//           setLoading(false);
//         }, (error) => {
//           console.error("Error fetching Premium fish & seafood selection:", error);
//           setError("Failed to load Premium fish & seafood selection");
//           setLoading(false);
//         });
//       } catch (error) {
//         console.error('Error setting up listener:', error);
//         setError('Failed to load Premium fish & seafood selection');
//         setLoading(false);
//       }
//     };

//     fetchPremiumSelectionProducts();

//     // Clean up function to remove listener when component unmounts
//     return () => {
//       const itemsRef = ref(db, 'items');
//       onValue(itemsRef, () => {}, { onlyOnce: true });
//     };
//   }, []);

//   if (loading) {
//     return (
//       <section className="match-day-section section">
//         <div className="loading">Loading premium fish & seafood selection...</div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="match-day-section section">
//         <div className="error">{error}</div>
//       </section>
//     );
//   }

//   return (
//     <section className="match-day-section section">
//       <div className="match-day-title">
//         <h2>Premium fish & seafood selection</h2>
//         {/* <p className="match-day-subtitle">Same-day catch: fresh & flavourful</p> */}
//       </div>

//       {products.length === 0 ? (
//         <div className="no-products">No Premium fish & seafood selection available at the moment.</div>
//       ) : (
//         <div className="product-grid">
//           {products.map(product => (
//             <ProductCard key={product.id || product.firebaseKey} product={product} />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default PremiumSelections;


import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/components/PremiumSelections.css';

const PremiumSelections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPremiumSelectionProducts = async () => {
      try {
        console.log("Fetching Premium fish & seafood selection from Firebase...");

        // Create reference to the items node in the database
        const itemsRef = ref(db, 'items');
        
        // Get selected meat cut from localStorage
        const selectedMeatCut = localStorage.getItem('selectedMeatCut');
        console.log("Selected meat cut for Premium Selections:", selectedMeatCut);

        // Set up a listener for changes
        onValue(itemsRef, (snapshot) => {
          if (snapshot.exists()) {
            const itemsData = snapshot.val();
            const itemsArray = Object.keys(itemsData).map(key => ({
              ...itemsData[key],
              firebaseKey: key // Store the Firebase key for future reference
            }));

            // Filter items for the "Premium fish & seafood selection" category
            let premiumSelectionItems = itemsArray.filter(item => 
              item.category === 'Premium fish & seafood selection');

            // If a meat cut filter is active, apply it
            if (selectedMeatCut) {
              premiumSelectionItems = premiumSelectionItems.filter(item => 
                item.meatCut === selectedMeatCut);
            }

            if (premiumSelectionItems.length > 0) {
              console.log('Fetched Premium fish & seafood selection from Firebase:', 
                premiumSelectionItems);
              setProducts(premiumSelectionItems);
            } else {
              console.log('No Premium fish & seafood selection found in Firebase after filtering');
              setProducts([]); // No products after filtering
            }
          } else {
            console.log('No data in Firebase for Premium fish & seafood selection');
            setProducts([]); // No data available
          }

          setLoading(false);
        }, (error) => {
          console.error("Error fetching Premium fish & seafood selection:", error);
          setError("Failed to load Premium fish & seafood selection");
          setLoading(false);
        });
      } catch (error) {
        console.error('Error setting up listener:', error);
        setError('Failed to load Premium fish & seafood selection');
        setLoading(false);
      }
    };

    fetchPremiumSelectionProducts();

    // Clean up function to remove listener when component unmounts
    return () => {
      const itemsRef = ref(db, 'items');
      onValue(itemsRef, () => {}, { onlyOnce: true });
    };
  }, []);

  if (loading) {
    return (
      <section className="premium-selection-section section">
        <div className="loading">Loading premium fish & seafood selection...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="premium-selection-section section">
        <div className="error">{error}</div>
      </section>
    );
  }

  // Get the selected meat cut for displaying in the title if filtering is active
  const selectedMeatCut = localStorage.getItem('selectedMeatCut');
  const meatCutLabel = selectedMeatCut === 'jc-jatka' ? 'JC Jatka' : 
                        selectedMeatCut === 'halal-cut' ? 'Halal Cut' : '';

  return (
    <section className="premium-selection-section section">
      <div className="premium-selection-title">
        <h2>
          Premium fish & seafood selection {meatCutLabel ? `- ${meatCutLabel}` : ''}
        </h2>
        {/* <p className="premium-selection-subtitle">Same-day catch: fresh & flavourful</p> */}
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          {selectedMeatCut ? 
            `No ${meatCutLabel} products available in Premium fish & seafood selection.` : 
            'No Premium fish & seafood selection available at the moment.'}
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id || product.firebaseKey} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default PremiumSelections;