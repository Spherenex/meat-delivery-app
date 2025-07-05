import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/components/DynamicSection.css';

const DynamicSection = ({ sectionName, sectionId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSectionItems = async () => {
      try {
        console.log(`Fetching items for section: ${sectionName}`);
        
        // Create reference to the items node in the database
        const itemsRef = ref(db, 'items');
        
        // Get selected meat cut from localStorage
        const selectedMeatCut = localStorage.getItem('selectedMeatCut');
        console.log("Selected meat cut:", selectedMeatCut);
        
        // Set up a listener for changes
        onValue(itemsRef, (snapshot) => {
          if (snapshot.exists()) {
            const itemsData = snapshot.val();
            const itemsArray = Object.keys(itemsData).map(key => ({
              ...itemsData[key],
              firebaseKey: key
            }));
            
            // Filter items by section category
            let sectionItems = itemsArray.filter(item => 
              item.category === sectionName && item.isActive !== false
            );
            
            // If a meat cut filter is active, apply it
            if (selectedMeatCut) {
              sectionItems = sectionItems.filter(item => item.meatCut === selectedMeatCut);
            }
            
            console.log(`Fetched ${sectionItems.length} products for section ${sectionName}:`, sectionItems);
            setProducts(sectionItems);
          } else {
            console.log(`No data found for section: ${sectionName}`);
            setProducts([]);
          }
          
          setLoading(false);
        }, (error) => {
          console.error(`Error fetching items for section ${sectionName}:`, error);
          setError(`Failed to load ${sectionName} products`);
          setProducts([]);
          setLoading(false);
        });
        
      } catch (error) {
        console.error(`Error setting up listener for section ${sectionName}:`, error);
        setError(`Failed to load ${sectionName} products`);
        setProducts([]);
        setLoading(false);
      }
    };
    
    if (sectionName) {
      fetchSectionItems();
    }
    
    // Clean up function to remove listener when component unmounts
    return () => {
      if (sectionName) {
        const itemsRef = ref(db, 'items');
        // Detach the listener
        onValue(itemsRef, () => {}, { onlyOnce: true });
      }
    };
  }, [sectionName]);
  
  if (loading) {
    return (
      <div className="dynamic-section section">
        <div className="loading">Loading {sectionName}...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="dynamic-section section">
        <div className="error">{error}</div>
      </div>
    );
  }

  // Don't render the section if there are no products
  if (products.length === 0) {
    return null;
  }
  
  // Get the selected meat cut for displaying in the title if filtering is active
  const selectedMeatCut = localStorage.getItem('selectedMeatCut');
  const meatCutLabel = selectedMeatCut === 'jc-jatka' ? 'JC Jatka' : 
                        selectedMeatCut === 'halal-cut' ? 'Halal Cut' : '';
  
  return (
    <section className="dynamic-section section" id={`${sectionId}-section`}>
      <div className="section-title">
        <h2>
          {sectionName} {meatCutLabel ? `- ${meatCutLabel}` : ''}
        </h2>
      </div>
      
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id || product.firebaseKey} product={product} />
        ))}
      </div>
    </section>
  );
};

export default DynamicSection;