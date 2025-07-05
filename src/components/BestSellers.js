

import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/components/ProductCard.css';

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        console.log("Fetching bestsellers from Firebase...");
        
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
              firebaseKey: key // Store the Firebase key for future reference
            }));
            
            // First, try to get items marked as featured
            let featuredItems = itemsArray.filter(item => item.featured === true);
            
            // If no featured items, try to get items from Bestsellers category
            if (featuredItems.length === 0) {
              featuredItems = itemsArray.filter(item => item.category === 'Bestsellers');
            }
            
            // If a meat cut filter is active, apply it
            if (selectedMeatCut) {
              featuredItems = featuredItems.filter(item => item.meatCut === selectedMeatCut);
            }
            
            // If we have items, use them
            if (featuredItems.length > 0) {
              console.log('Fetched products from Firebase:', featuredItems);
              setProducts(featuredItems);
            } else {
              // If still no items, use mock data - but filter by meat cut if needed
              console.log('No products found in Firebase, using mock data');
              const mockProducts = getMockProducts();
              
              if (selectedMeatCut) {
                const filteredMockProducts = mockProducts.filter(item => item.meatCut === selectedMeatCut);
                setProducts(filteredMockProducts);
              } else {
                setProducts(mockProducts);
              }
            }
          } else {
            // If no data in Firebase, use mock data
            console.log('No data in Firebase, using mock data');
            const mockProducts = getMockProducts();
            
            if (selectedMeatCut) {
              const filteredMockProducts = mockProducts.filter(item => item.meatCut === selectedMeatCut);
              setProducts(filteredMockProducts);
            } else {
              setProducts(mockProducts);
            }
          }
          
          setLoading(false);
        }, (error) => {
          console.error("Error fetching items:", error);
          setError("Failed to load products");
          
          // Even in case of error, try to show mock data with filtering
          const mockProducts = getMockProducts();
          const selectedMeatCut = localStorage.getItem('selectedMeatCut');
          
          if (selectedMeatCut) {
            const filteredMockProducts = mockProducts.filter(item => item.meatCut === selectedMeatCut);
            setProducts(filteredMockProducts);
          } else {
            setProducts(mockProducts);
          }
          
          setLoading(false);
        });
        
      } catch (error) {
        console.error('Error setting up listener:', error);
        setError('Failed to load products');
        
        // Even in case of exception, try to show mock data with filtering
        const mockProducts = getMockProducts();
        const selectedMeatCut = localStorage.getItem('selectedMeatCut');
        
        if (selectedMeatCut) {
          const filteredMockProducts = mockProducts.filter(item => item.meatCut === selectedMeatCut);
          setProducts(filteredMockProducts);
        } else {
          setProducts(mockProducts);
        }
        
        setLoading(false);
      }
    };
    
    fetchBestSellers();
    
    // Clean up function to remove listener when component unmounts
    return () => {
      const itemsRef = ref(db, 'items');
      // Detach the listener
      onValue(itemsRef, () => {}, { onlyOnce: true });
    };
  }, []);
  
  // Mock products function - exact match to the image shared
  const getMockProducts = () => {
    return [
      {
        id: 'chicken-curry-cut-small',
        name: 'Chicken Curry Cut - Small Pieces',
        image: 'https://t3.ftcdn.net/jpg/08/47/55/46/360_F_847554699_5QdX4XsvKyjMt1KjHAUPJ3y9Z3lhfin2.jpg',
        weight: '500 g',
        pieces: '12-18 Pieces',
        serves: 4,
        price: 160,
        originalPrice: 195,
        discount: 18,
        deliveryTime: 30,
        meatCut: 'jc-jatka' // Adding meatCut property to mock data
      },
      {
        id: 'chicken-breast-boneless',
        name: 'Chicken Breast - Boneless',
        image: 'https://fooppers.in/wp-content/uploads/2021/01/Chicken-Breast-Boneless-1.jpg',
        weight: '450 g',
        pieces: '2-4 Pieces',
        serves: 4,
        price: 252,
        originalPrice: 315,
        discount: 20,
        deliveryTime: 30,
        meatCut: 'halal-cut' // Adding meatCut property to mock data
      },
      {
        id: 'chicken-boneless-mini-bites',
        name: 'Chicken Boneless - Mini Bites',
        image: 'https://freshchoicefarms.in/wp-content/uploads/2021/04/Chicken-Breast-boneless.jpg',
        weight: '250 g',
        pieces: '20-25 Pieces',
        serves: 4,
        price: 176,
        originalPrice: 220,
        discount: 20,
        deliveryTime: 30,
        meatCut: 'jc-jatka' // Adding meatCut property to mock data
      },
      {
        id: 'chicken-curry-cut-large',
        name: 'Chicken Curry Cut - Small Pieces (Large Pack)',
        image: 'https://ik.imagekit.io/iwcam3r8ka/prod/products/202306/6cf59de1-c31e-4d95-b66d-bab8e5466167.jpg',
        weight: '1000 g',
        pieces: '24-36 Pieces',
        serves: 6,
        price: 304,
        originalPrice: 380,
        discount: 20,
        deliveryTime: 30,
        meatCut: 'halal-cut' // Adding meatCut property to mock data
      },
      {
        id: 'premium-chicken-thigh-boneless',
        name: 'Premium Chicken Thigh - Boneless',
        image: 'https://lenaturelmeat.com/cdn/shop/files/3.jpg?v=1699612809',
        weight: '450 g',
        pieces: '3-5 Pieces',
        serves: 3,
        price: 268,
        originalPrice: 335,
        discount: 20,
        deliveryTime: 30,
        meatCut: 'jc-jatka' // Adding meatCut property to mock data
      },
      {
        id: 'mutton',
        name: 'Premium Mutton',
        image: 'https://www.thespruceeats.com/thmb/AsHVWEq5JaotXjMIvrs1wKU8WaM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/JMTalbott-466838246c734494b30bcf47b633e116.jpg',
        weight: '450 g',
        pieces: '5-10 Pieces',
        serves: 3,
        price: 368,
        originalPrice: 435,
        discount: 15,
        deliveryTime: 30,
        meatCut: 'halal-cut' // Adding meatCut property to mock data
      },
      {
        id: 'seafood',
        name: 'Premium Seafood',
        image: 'https://media.istockphoto.com/id/1126131932/photo/selection-of-aminal-protein-sources-on-wood-background.jpg?s=612x612&w=0&k=20&c=u1bGJpQnn2jrJgJLldXOa5mAMSnF2oFU3ZhwHBxgOmk=',
        weight: '450 g',
        pieces: '1-3 Pieces',
        serves: 3,
        price: 308,
        originalPrice: 385,
        discount: 20,
        deliveryTime: 30,
        meatCut: 'jc-jatka' // Adding meatCut property to mock data
      },
      {
        id: 'prawns',
        name: 'Premium Prawns',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRerUmuD5XXr10HFnp_awnfhkjaEu2G_Q2pSQ&s',
        weight: '450 g',
        pieces: '3-5 Pieces',
        serves: 3,
        price: 250,
        originalPrice: 290,
        discount: 14,
        deliveryTime: 30,
        meatCut: 'halal-cut' // Adding meatCut property to mock data
      }
    ];
  };
  
  if (loading) {
    return (
      <div className="best-sellers section">
        <div className="loading">Loading bestsellers...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="best-sellers section">
        <div className="error">{error}</div>
      </div>
    );
  }
  
  // Get the selected meat cut for displaying in the title if filtering is active
  const selectedMeatCut = localStorage.getItem('selectedMeatCut');
  const meatCutLabel = selectedMeatCut === 'jc-jatka' ? 'JC Jatka' : 
                        selectedMeatCut === 'halal-cut' ? 'Halal Cut' : '';
  
  return (
    <section className="best-sellers section">
      <div className="section-title">
        <h2 style={{left: '10px', position: 'relative'}}>
          Bestsellers {meatCutLabel ? `- ${meatCutLabel}` : ''}
        </h2>
        {/* <p>Most popular products near you!</p> */}
      </div>
      
      {products.length === 0 ? (
        <div className="no-products">
          {selectedMeatCut ? 
            `No ${meatCutLabel} products available in Bestsellers.` : 
            'No bestseller products available at the moment.'}
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

export default BestSellers;