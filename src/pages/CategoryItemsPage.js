// src/pages/CategoryItemsPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/config';
import ProductCard from '../components/ProductCard';
import '../styles/pages/CategoryItemsPage.css';

const CategoryItemsPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch the category info
        const categoriesRef = ref(db, 'categories');
        const categoriesSnapshot = await get(categoriesRef);
        
        if (categoriesSnapshot.exists()) {
          const categoriesData = categoriesSnapshot.val();
          let foundCategory = null;
          
          // Find the category that matches the ID from URL
          Object.keys(categoriesData).forEach(key => {
            if (categoriesData[key].id === categoryId) {
              foundCategory = { 
                ...categoriesData[key],
                firebaseKey: key 
              };
            }
          });
          
          if (foundCategory) {
            setCategory(foundCategory);
          } else {
            throw new Error('Category not found');
          }
        } else {
          throw new Error('No categories found');
        }
        
        // Fetch all products
        const itemsRef = ref(db, 'items');
        const itemsSnapshot = await get(itemsRef);
        
        if (itemsSnapshot.exists()) {
          const itemsData = itemsSnapshot.val();
          const itemsArray = Object.keys(itemsData).map(key => ({
            ...itemsData[key],
            firebaseKey: key
          }));
          
          // Filter products by the category ID
          const categoryProducts = itemsArray.filter(item => 
            item.displayCategory === categoryId
          );
          
          setProducts(categoryProducts);
        } else {
          setProducts([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to load category data');
        setLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="category-items-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-items-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-items-error">
        <p>Category not found</p>
      </div>
    );
  }

  return (
    <div className="category-items-page">
      <div className="container">
        <div className="category-header">
          <div className="category-info">
            <h1 className="category-title">{category.name}</h1>
            <p className="category-description">{category.description}</p>
          </div>
          {category.image && (
            <div className="category-banner">
              <img src={category.image} alt={category.name} />
            </div>
          )}
        </div>
        
        <div className="category-stats">
          <span className="product-count">{products.length} products</span>
          {/* Add sorting/filtering options here if needed */}
        </div>
        
        {products.length > 0 ? (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product.id || product.firebaseKey} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryItemsPage;