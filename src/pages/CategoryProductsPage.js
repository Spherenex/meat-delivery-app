

// // src/pages/CategoryProductsPage.js
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { ref, onValue, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import ProductCard from '../components/ProductCard';
// import Pagination from '../components/Pagination';
// import '../styles/pages/CategoryProductsPage.css';
// import { FaFilter, FaSortAmountDown, FaChevronRight } from 'react-icons/fa';

// const CategoryProductsPage = () => {
//   const { categoryId } = useParams();
//   const [products, setProducts] = useState([]);
//   const [category, setCategory] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [sortOption, setSortOption] = useState('default');
//   const [showFilter, setShowFilter] = useState(false);
//   const [filterOptions, setFilterOptions] = useState({
//     priceRange: [0, 2000],
//     inStock: false,
//     discount: false
//   });
  
//   const productsPerPage = 8;

//   useEffect(() => {
//     // First fetch the category details
//     const fetchCategory = async () => {
//       try {
//         console.log(`Fetching category with ID: ${categoryId}`);
        
//         const categoriesRef = ref(db, 'categories');
//         const snapshot = await get(categoriesRef);
        
//         if (snapshot.exists()) {
//           const categoriesData = snapshot.val();
//           let foundCategory = null;
          
//           // Find the category that matches the categoryId
//           Object.keys(categoriesData).forEach(key => {
//             if (categoriesData[key].id === categoryId) {
//               foundCategory = {
//                 ...categoriesData[key],
//                 firebaseKey: key
//               };
//             }
//           });
          
//           if (foundCategory) {
//             console.log('Found category:', foundCategory);
//             setCategory(foundCategory);
//           } else {
//             throw new Error('Category not found');
//           }
//         } else {
//           throw new Error('No categories found');
//         }
//       } catch (error) {
//         console.error('Error fetching category:', error);
//         setError(error.message || 'Failed to load category');
//         setLoading(false);
//       }
//     };
    
//     // Then fetch products for that category
//     const fetchProducts = () => {
//       try {
//         console.log(`Fetching products for category: ${categoryId}`);
        
//         // Create reference to the items node in the database
//         const itemsRef = ref(db, 'items');
        
//         // Set up a listener for changes
//         onValue(itemsRef, (snapshot) => {
//           if (snapshot.exists()) {
//             const itemsData = snapshot.val();
//             const itemsArray = Object.keys(itemsData).map(key => ({
//               ...itemsData[key],
//               firebaseKey: key
//             }));
            
//             // Filter items that belong to this category
//             const categoryProducts = itemsArray.filter(item => 
//               item.displayCategory === categoryId || 
//               (item.category === "Shop by categories" && item.displayCategory === categoryId)
//             );
            
//             if (categoryProducts.length > 0) {
//               console.log(`Found ${categoryProducts.length} products for category ${categoryId}:`, categoryProducts);
//               setProducts(categoryProducts);
//               setTotalPages(Math.ceil(categoryProducts.length / productsPerPage));
//             } else {
//               console.log(`No products found for category ${categoryId}`);
//               setProducts([]);
//               setTotalPages(0);
//             }
            
//             setLoading(false);
//           } else {
//             console.log('No products found in the database');
//             setProducts([]);
//             setTotalPages(0);
//             setLoading(false);
//           }
//         }, (error) => {
//           console.error("Error fetching products:", error);
//           setError(`Failed to load products: ${error.message}`);
//           setLoading(false);
//         });
//       } catch (error) {
//         console.error('Error setting up products listener:', error);
//         setError(`Failed to load products: ${error.message}`);
//         setLoading(false);
//       }
//     };
    
//     // Execute both fetch operations
//     const loadData = async () => {
//       await fetchCategory();
//       fetchProducts();
//     };
    
//     loadData();
    
//     // Clean up function to remove listener when component unmounts
//     return () => {
//       const itemsRef = ref(db, 'items');
//       onValue(itemsRef, () => {}, { onlyOnce: true });
//     };
//   }, [categoryId]);

//   // Apply sorting and filtering
//   const getDisplayedProducts = () => {
//     // Start with filtered products
//     let filteredProducts = [...products];
    
//     // Apply price range filter
//     filteredProducts = filteredProducts.filter(product => 
//       product.price >= filterOptions.priceRange[0] && 
//       product.price <= filterOptions.priceRange[1]
//     );
    
//     // Apply discount filter
//     if (filterOptions.discount) {
//       filteredProducts = filteredProducts.filter(product => product.discount > 0);
//     }
    
//     // Apply sorting
//     switch (sortOption) {
//       case 'price-low-high':
//         filteredProducts.sort((a, b) => a.price - b.price);
//         break;
//       case 'price-high-low':
//         filteredProducts.sort((a, b) => b.price - a.price);
//         break;
//       case 'discount':
//         filteredProducts.sort((a, b) => b.discount - a.discount);
//         break;
//       default:
//         // Default sorting (by popularity or featured)
//         break;
//     }
    
//     // Calculate total pages
//     const totalFilteredPages = Math.ceil(filteredProducts.length / productsPerPage);
//     if (totalFilteredPages !== totalPages) {
//       setTotalPages(totalFilteredPages);
//       if (currentPage > totalFilteredPages && totalFilteredPages > 0) {
//         setCurrentPage(1);
//       }
//     }
    
//     // Get current page items
//     const startIndex = (currentPage - 1) * productsPerPage;
//     return filteredProducts.slice(startIndex, startIndex + productsPerPage);
//   };
  
//   const displayedProducts = getDisplayedProducts();
  
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     // Scroll to top of product list
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };
  
//   const handleSortChange = (e) => {
//     setSortOption(e.target.value);
//   };
  
//   const handleFilterToggle = () => {
//     setShowFilter(!showFilter);
//   };
  
//   const handleFilterChange = (name, value) => {
//     setFilterOptions({
//       ...filterOptions,
//       [name]: value
//     });
//   };
  
//   const handlePriceRangeChange = (e, index) => {
//     const newRange = [...filterOptions.priceRange];
//     newRange[index] = parseInt(e.target.value);
//     handleFilterChange('priceRange', newRange);
//   };
  
//   const resetFilters = () => {
//     setFilterOptions({
//       priceRange: [0, 2000],
//       inStock: false,
//       discount: false
//     });
//     setSortOption('default');
//   };

//   if (loading) {
//     return (
//       <div className="category-products-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="category-products-error">
//         <p>{error}</p>
//         <button onClick={() => window.location.reload()} className="retry-button">
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (!category) {
//     return (
//       <div className="category-not-found">
//         <h2>Category Not Found</h2>
//         <p>The category you're looking for doesn't exist.</p>
//         <Link to="/" className="back-to-categories">
//           Back to Home
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="category-products-page">
//       <div className="container">
//         {/* Breadcrumb */}
//         <div className="breadcrumb">
//           <Link to="/">Home</Link>
//           <FaChevronRight className="breadcrumb-separator" />
//           <span>{category.name}</span>
//         </div>
        
//         {/* Category Header */}
//         <div className="category-header">
//           <div className="category-info">
//             <h1 className="category-title">{category.name}</h1>
//             <p className="category-description">{category.description || `Fresh and quality ${category.name} products`}</p>
//           </div>
//           <div className="category-image-container">
//             <img src={category.image} alt={category.name} className="category-header-image" />
//           </div>
//         </div>
        
//         {/* Filter and Sort Bar */}
//         <div className="product-controls">
//           <button className="filter-button" onClick={handleFilterToggle}>
//             <FaFilter /> Filter
//           </button>
          
//           <div className="sort-control">
//             <label htmlFor="sort-select">
//               <FaSortAmountDown /> Sort by:
//             </label>
//             <select 
//               id="sort-select" 
//               value={sortOption} 
//               onChange={handleSortChange}
//               className="sort-select"
//             >
//               <option value="default">Featured</option>
//               <option value="price-low-high">Price: Low to High</option>
//               <option value="price-high-low">Price: High to Low</option>
//               <option value="discount">Discount</option>
//             </select>
//           </div>
//         </div>
        
//         {/* Filter Panel */}
//         {showFilter && (
//           <div className="filter-panel">
//             <div className="filter-section">
//               <h3>Price Range</h3>
//               <div className="price-range">
//                 <div className="range-inputs">
//                   <input 
//                     type="range" 
//                     min="0" 
//                     max="2000" 
//                     value={filterOptions.priceRange[0]} 
//                     onChange={(e) => handlePriceRangeChange(e, 0)} 
//                   />
//                   <input 
//                     type="range" 
//                     min="0" 
//                     max="2000" 
//                     value={filterOptions.priceRange[1]} 
//                     onChange={(e) => handlePriceRangeChange(e, 1)} 
//                   />
//                 </div>
//                 <div className="range-values">
//                   <span>₹{filterOptions.priceRange[0]}</span>
//                   <span>₹{filterOptions.priceRange[1]}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="filter-section">
//               <h3>Offers</h3>
//               <label className="checkbox-label">
//                 <input 
//                   type="checkbox" 
//                   checked={filterOptions.discount} 
//                   onChange={(e) => handleFilterChange('discount', e.target.checked)} 
//                 />
//                 Discounted Items
//               </label>
//             </div>
            
//             <div className="filter-actions">
//               <button className="reset-filter" onClick={resetFilters}>
//                 Reset Filters
//               </button>
//               <button className="apply-filter" onClick={handleFilterToggle}>
//                 Apply
//               </button>
//             </div>
//           </div>
//         )}
        
//         {/* Product Grid */}
//         {displayedProducts.length > 0 ? (
//           <div className="products-section">
//             <p className="product-count">
//               Showing {displayedProducts.length} of {products.length} products
//             </p>
            
//             <div className="products-grid">
//               {displayedProducts.map(product => (
//                 <ProductCard key={product.id || product.firebaseKey} product={product} />
//               ))}
//             </div>
            
//             {/* Pagination */}
//             {totalPages > 1 && (
//               <Pagination 
//                 currentPage={currentPage} 
//                 totalPages={totalPages} 
//                 onPageChange={handlePageChange} 
//               />
//             )}
//           </div>
//         ) : (
//           <div className="no-products">
//             <h2>No products found</h2>
//             <p>There are currently no products available in this category. Please check back later.</p>
//             <Link to="/" className="back-to-home">
//               Back to Home
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CategoryProductsPage;

// src/pages/CategoryProductsPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/config';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import '../styles/pages/CategoryProductsPage.css';
import { FaFilter, FaSortAmountDown, FaChevronRight } from 'react-icons/fa';

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('default');
  const [showFilter, setShowFilter] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    priceRange: [0, 2000],
    discount: false
  });
  
  const productsPerPage = 8;

  // Default categories data as fallback
  const defaultCategories = {
    'chicken': {
      id: 'chicken',
      name: 'Chicken',
      description: 'Fresh chicken cuts and whole birds',
      image: 'https://t3.ftcdn.net/jpg/08/47/55/46/360_F_847554699_5QdX4XsvKyjMt1KjHAUPJ3y9Z3lhfin2.jpg'
    },
    'fish-seafood': {
      id: 'fish-seafood',
      name: 'Fish & Seafood',
      description: 'Fresh fish and seafood varieties',
      image: 'https://img.favpng.com/25/16/11/fish-fry-seafood-meat-png-favpng-gfcfXW94RZSSLUKQ9Dj12HY5b.jpg'
    },
    'mutton': {
      id: 'mutton',
      name: 'Mutton',
      description: 'Premium quality mutton cuts',
      image: 'https://godavaricuts.com/cdn/shop/files/Godavari-Cuts-Day-1-_36-of-65_1.jpg?v=1682936866'
    },
    'liver-more': {
      id: 'liver-more',
      name: 'Liver & More',
      description: 'Liver, gizzard and more',
      image: 'https://www.bigbasket.com/media/uploads/p/xxl/40048915_4-fresho-mutton-liver-antibiotic-residue-free-growth-hormone-free.jpg'
    },
    'prawns-crabs': {
      id: 'prawns-crabs',
      name: 'Prawns & Crabs',
      description: 'Fresh prawns and crabs',
      image: 'https://colchesteroysterfishery.com/cdn/shop/files/LMS_IMG_4258-VSCO.jpg?v=1698928291'
    },
    'eggs': {
      id: 'eggs',
      name: 'Eggs',
      description: 'Farm fresh eggs',
      image: 'https://img.freepik.com/free-photo/main-ingredient-cooking-different-dishes-eggs_185193-108933.jpg'
    },
    'combos': {
      id: 'combos',
      name: 'Combos',
      description: 'Combo packs at special prices',
      image: 'https://assets.tendercuts.in/product/C/O/ca18870d-ab04-4f51-9986-f72a8394cc9a.webp'
    }
  };

  // Mock products data as fallback
  const mockProductsByCategory = {
    'chicken': [
      {
        id: 'chicken-curry-cut-small',
        name: 'Chicken Curry Cut - Small Pieces',
        image: 'https://ik.imagekit.io/iwcam3r8ka/prod/products/202306/4a599b2d-eaa0-4700-b93f-7b47e8861af5.jpg',
        weight: '500 g',
        pieces: '12-18 Pieces',
        serves: 4,
        price: 160,
        originalPrice: 195,
        discount: 18,
        deliveryTime: 30,
        category: 'chicken'
      },
      {
        id: 'chicken-breast-boneless',
        name: 'Chicken Breast - Boneless',
        image: 'https://freshchoicefarms.in/wp-content/uploads/2021/04/Chicken-Breast-boneless.jpg',
        weight: '450 g',
        pieces: '2-4 Pieces',
        serves: 4,
        price: 252,
        originalPrice: 315,
        discount: 20,
        deliveryTime: 30,
        category: 'chicken'
      }
    ],
    'mutton': [
      {
        id: 'mutton-curry-cut',
        name: 'Mutton Curry Cut',
        image: 'https://assets.tendercuts.in/product/P/R/44e5fc66-bd7b-437c-aa09-c6873382bd09.webp',
        weight: '500 g',
        pieces: '12-16 Pieces',
        serves: 4,
        price: 520,
        originalPrice: 650,
        discount: 20,
        deliveryTime: 30,
        category: 'mutton'
      }
    ],
    'fish-seafood': [
      {
        id: 'rohu-fish',
        name: 'Rohu (Rui) Fish - Bengali Cut',
        image: 'https://i0.wp.com/evegro.com/wp-content/uploads/2021/04/Screen-Shot-2021-04-24-at-12.57.32-AM.png?fit=408%2C325&ssl=1',
        weight: '500 g',
        pieces: '4-6 Pieces',
        serves: 3,
        price: 225,
        originalPrice: 275,
        discount: 18,
        deliveryTime: 30,
        category: 'fish-seafood'
      }
    ],
    'eggs': [
      {
        id: 'farm-eggs',
        name: 'Farm Fresh Eggs',
        image: 'https://c.ndtvimg.com/gws/5674/assets/4.jpeg?1651561595',
        weight: '12 eggs',
        price: 120,
        originalPrice: 150,
        discount: 20,
        deliveryTime: 30,
        category: 'eggs'
      }
    ],
    'liver-more': [
      {
        id: 'chicken-liver',
        name: 'Fresh Chicken Liver',
        image: 'https://www.bigbasket.com/media/uploads/p/xxl/40048915_4-fresho-mutton-liver-antibiotic-residue-free-growth-hormone-free.jpg',
        weight: '500 g',
        price: 180,
        originalPrice: 220,
        discount: 18,
        deliveryTime: 30,
        category: 'liver-more'
      }
    ],
    'prawns-crabs': [
      {
        id: 'tiger-prawns',
        name: 'Tiger Prawns - Large',
        image: 'https://colchesteroysterfishery.com/cdn/shop/files/LMS_IMG_4258-VSCO.jpg?v=1698928291',
        weight: '500 g',
        price: 450,
        originalPrice: 550,
        discount: 18,
        deliveryTime: 30,
        category: 'prawns-crabs'
      }
    ],
    'combos': [
      {
        id: 'chicken-mutton-combo',
        name: 'Chicken & Mutton Combo',
        image: 'https://assets.tendercuts.in/product/C/O/ca18870d-ab04-4f51-9986-f72a8394cc9a.webp',
        weight: '1 kg',
        price: 750,
        originalPrice: 900,
        discount: 17,
        deliveryTime: 30,
        category: 'combos'
      }
    ]
  };

  useEffect(() => {
    const loadCategoryAndProducts = async () => {
      if (!categoryId) {
        setError("Category ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Fetch category data
        let categoryData;
        try {
          const categoriesRef = ref(db, 'categories');
          const snapshot = await get(categoriesRef);
          
          if (snapshot.exists()) {
            const categoriesData = snapshot.val();
            let foundCategory = null;
            
            // Find category that matches categoryId
            Object.keys(categoriesData).forEach(key => {
              if (categoriesData[key].id === categoryId) {
                foundCategory = {
                  ...categoriesData[key],
                  firebaseKey: key
                };
              }
            });
            
            if (foundCategory) {
              categoryData = foundCategory;
            } else {
              // Use default category data if not found in Firebase
              categoryData = defaultCategories[categoryId] || {
                id: categoryId,
                name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' '),
                description: `Products in ${categoryId.replace(/-/g, ' ')} category`,
                image: `https://via.placeholder.com/300x200?text=${categoryId.replace(/-/g, '+')}`
              };
            }
          } else {
            // Use default category data if no categories in Firebase
            categoryData = defaultCategories[categoryId] || {
              id: categoryId,
              name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' '),
              description: `Products in ${categoryId.replace(/-/g, ' ')} category`,
              image: `https://via.placeholder.com/300x200?text=${categoryId.replace(/-/g, '+')}`
            };
          }
        } catch (error) {
          console.error("Error fetching category:", error);
          // Use default category data on error
          categoryData = defaultCategories[categoryId] || {
            id: categoryId,
            name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' '),
            description: `Products in ${categoryId.replace(/-/g, ' ')} category`,
            image: `https://via.placeholder.com/300x200?text=${categoryId.replace(/-/g, '+')}`
          };
        }

        // 2. Fetch products for this category
        let categoryProducts = [];
        try {
          const itemsRef = ref(db, 'items');
          const snapshot = await get(itemsRef);
          
          if (snapshot.exists()) {
            const itemsData = snapshot.val();
            const allProducts = Object.keys(itemsData).map(key => ({
              ...itemsData[key],
              firebaseKey: key
            }));
            
            // Filter products for this category
            categoryProducts = allProducts.filter(product => {
              // Direct match on displayCategory
              if (product.displayCategory === categoryId) {
                return true;
              }
              
              // For "Shop by categories" items
              if (product.category === "Shop by categories" && product.displayCategory === categoryId) {
                return true;
              }
              
              // Special rules for specific categories
              if (categoryId === 'fish-seafood' && product.category === "Premium fish & seafood selection") {
                return true;
              }
              
              if (categoryId === 'mutton' && product.category === "Match Day Essentials") {
                return false;
              }
              
              return false;
            });
          }
          
          // If no products found for this category, use mock data
          if (categoryProducts.length === 0) {
            categoryProducts = mockProductsByCategory[categoryId] || [];
          }
        } catch (error) {
          console.error("Error fetching products:", error);
          // Use mock data on error
          categoryProducts = mockProductsByCategory[categoryId] || [];
        }

        // 3. Update state
        setCategory(categoryData);
        setProducts(categoryProducts);
        setTotalPages(Math.max(1, Math.ceil(categoryProducts.length / productsPerPage)));
        setLoading(false);
      } catch (error) {
        console.error("Error in loadCategoryAndProducts:", error);
        setError("Failed to load category data. Please try again later.");
        setLoading(false);
      }
    };

    loadCategoryAndProducts();
  }, [categoryId]);

  // Apply sorting and filtering to products
  const getDisplayedProducts = () => {
    // Start with filtered products
    let filteredProducts = [...(products || [])];
    
    try {
      // Apply price range filter
      filteredProducts = filteredProducts.filter(product => 
        product.price >= filterOptions.priceRange[0] && 
        product.price <= filterOptions.priceRange[1]
      );
      
      // Apply discount filter
      if (filterOptions.discount) {
        filteredProducts = filteredProducts.filter(product => 
          (product.discount || 0) > 0
        );
      }
      
      // Apply sorting
      switch (sortOption) {
        case 'price-low-high':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-low':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'discount':
          filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
          break;
        default:
          // Default sorting (featured or popularity)
          break;
      }
    } catch (error) {
      console.error("Error filtering products:", error);
      // Return original products if filtering fails
      return products.slice(0, productsPerPage);
    }
    
    // Get current page items
    const startIndex = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  };
  
  const displayedProducts = getDisplayedProducts();
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };
  
  const handleFilterChange = (name, value) => {
    setFilterOptions({
      ...filterOptions,
      [name]: value
    });
  };
  
  const handlePriceRangeChange = (e, index) => {
    const newRange = [...filterOptions.priceRange];
    newRange[index] = parseInt(e.target.value);
    handleFilterChange('priceRange', newRange);
  };
  
  const resetFilters = () => {
    setFilterOptions({
      priceRange: [0, 2000],
      discount: false
    });
    setSortOption('default');
  };

  // Image error handler
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
  };

  // Navigate back to home
  const handleBackToHome = () => {
    navigate('/');
  };

  // Retry loading the page
  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="category-products-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-products-error">
        <h2>Something went wrong</h2>
        <p>We're having trouble displaying this category. Please try again later.</p>
        <div className="error-actions">
          <button onClick={handleRetry} className="retry-button">Retry</button>
          <button onClick={handleBackToHome} className="back-to-home-button">Back to Home</button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-not-found">
        <h2>Category Not Found</h2>
        <p>The category you're looking for doesn't exist or couldn't be loaded.</p>
        <button onClick={handleBackToHome} className="back-to-home-button">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="category-products-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <FaChevronRight className="breadcrumb-separator" />
          <span>{category.name}</span>
        </div>
        
        {/* Category Header */}
        {/* <div className="category-header">
          <div className="category-info">
            <h1 className="category-title">{category.name}</h1>
            <p className="category-description">{category.description || `Fresh and quality ${category.name} products`}</p>
          </div>
          <div className="category-image-container">
            <img 
              src={category.image} 
              alt={category.name} 
              className="category-header-image"
              onError={handleImageError}
            />
          </div>
        </div> */}
        
        {/* Filter and Sort Bar */}
        <div className="product-controls">
          <button className="filter-button" onClick={handleFilterToggle}>
            <FaFilter /> Filter
          </button>
          
          <div className="sort-control">
            <label htmlFor="sort-select">
              <FaSortAmountDown /> Sort by:
            </label>
            <select 
              id="sort-select" 
              value={sortOption} 
              onChange={handleSortChange}
              className="sort-select"
            >
              <option value="default">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="discount">Discount</option>
            </select>
          </div>
        </div>
        
        {/* Filter Panel */}
        {showFilter && (
          <div className="filter-panel">
            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-range">
                <div className="range-inputs">
                  <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    value={filterOptions.priceRange[0]} 
                    onChange={(e) => handlePriceRangeChange(e, 0)} 
                  />
                  <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    value={filterOptions.priceRange[1]} 
                    onChange={(e) => handlePriceRangeChange(e, 1)} 
                  />
                </div>
                <div className="range-values">
                  <span>₹{filterOptions.priceRange[0]}</span>
                  <span>₹{filterOptions.priceRange[1]}</span>
                </div>
              </div>
            </div>
            
            <div className="filter-section">
              <h3>Offers</h3>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filterOptions.discount} 
                  onChange={(e) => handleFilterChange('discount', e.target.checked)} 
                />
                Discounted Items
              </label>
            </div>
            
            <div className="filter-actions">
              <button className="reset-filter" onClick={resetFilters}>
                Reset Filters
              </button>
              <button className="apply-filter" onClick={handleFilterToggle}>
                Apply
              </button>
            </div>
          </div>
        )}
        
        {/* Product Grid */}
        {displayedProducts && displayedProducts.length > 0 ? (
          <div className="products-section">
            <p className="product-count">
              Showing {displayedProducts.length} of {products.length} products
            </p>
            
            <div className="products-grid">
              {displayedProducts.map(product => (
                <ProductCard 
                  key={product.id || product.firebaseKey || Math.random().toString(36).substring(2, 9)} 
                  product={product}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            )}
          </div>
        ) : (
          <div className="no-products">
            <h2>No products found</h2>
            <p>There are currently no products available in this category. Please check back later.</p>
            <button onClick={handleBackToHome} className="back-to-home-button">
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProductsPage;