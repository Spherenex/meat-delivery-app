

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/components/MatchDayEssentials.css';

const MatchDayEssentials = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchDayProducts = async () => {
      try {
        console.log("Fetching Match Day Essentials from Firebase...");

        // Create reference to the items node in the database
        const itemsRef = ref(db, 'items');
        
        // Get selected meat cut from localStorage
        const selectedMeatCut = localStorage.getItem('selectedMeatCut');
        console.log("Selected meat cut for Match Day Essentials:", selectedMeatCut);

        // Set up a listener for changes
        onValue(itemsRef, (snapshot) => {
          if (snapshot.exists()) {
            const itemsData = snapshot.val();
            const itemsArray = Object.keys(itemsData).map(key => ({
              ...itemsData[key],
              firebaseKey: key // Store the Firebase key for future reference
            }));

            // Filter items for the "Match Day Essentials" category
            let matchDayItems = itemsArray.filter(item => item.category === 'Match Day Essentials');

            // If a meat cut filter is active, apply it
            if (selectedMeatCut) {
              matchDayItems = matchDayItems.filter(item => item.meatCut === selectedMeatCut);
            }

            if (matchDayItems.length > 0) {
              console.log('Fetched Match Day Essentials from Firebase:', matchDayItems);
              setProducts(matchDayItems);
            } else {
              console.log('No Match Day Essentials found in Firebase after filtering');
              setProducts([]); // No products after filtering
            }
          } else {
            console.log('No data in Firebase for Match Day Essentials');
            setProducts([]); // No data available
          }

          setLoading(false);
        }, (error) => {
          console.error("Error fetching Match Day Essentials:", error);
          setError("Failed to load Match Day Essentials");
          setLoading(false);
        });
      } catch (error) {
        console.error('Error setting up listener:', error);
        setError('Failed to load Match Day Essentials');
        setLoading(false);
      }
    };

    fetchMatchDayProducts();

    // Clean up function to remove listener when component unmounts
    return () => {
      const itemsRef = ref(db, 'items');
      onValue(itemsRef, () => {}, { onlyOnce: true });
    };
  }, []);

  if (loading) {
    return (
      <section className="match-day-section section">
        <div className="loading">Loading match day essentials...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="match-day-section section">
        <div className="error">{error}</div>
      </section>
    );
  }

  // Get the selected meat cut for displaying in the title if filtering is active
  const selectedMeatCut = localStorage.getItem('selectedMeatCut');
  const meatCutLabel = selectedMeatCut === 'jc-jatka' ? 'JC Jatka' : 
                        selectedMeatCut === 'halal-cut' ? 'Halal Cut' : '';

  return (
    <section className="match-day-section section">
      <div className="match-day-title">
        <h2 style={{left: '5px', position: 'relative'}}>
          Match Day Essentials {meatCutLabel ? `- ${meatCutLabel}` : ''}
        </h2>
        {/* <p className="match-day-subtitle">Stock Up, Heat Up, Game On!</p> */}
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          {selectedMeatCut ? 
            `No ${meatCutLabel} products available in Match Day Essentials.` : 
            'No Match Day Essentials available at the moment.'}
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

export default MatchDayEssentials;