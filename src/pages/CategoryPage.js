


// import React, { useState, useEffect } from 'react';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// import { db } from '../firebase/config';
// import { ref, get } from 'firebase/database';
// import '../styles/pages/CategoryPage.css';
// import { FaArrowRight, FaArrowLeft, FaFilter, FaSortAmountDown, FaTimes } from 'react-icons/fa';

// const CategoryPage = () => {
//   const { categoryId } = useParams();
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [filteredCategories, setFilteredCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [allProducts, setAllProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(8);
//   const [selectedCategory, setSelectedCategory] = useState(
//     localStorage.getItem('selectedCategory') || 'default'
//   );
//   const [showFilter, setShowFilter] = useState(false);
//   const [filterOptions, setFilterOptions] = useState({
//     discount: false
//   });

//   const availableCategories = [
//     { id: 'default', name: 'All Categories' },
//     { id: 'combos', name: 'Combos' },
//     { id: 'chicken', name: 'Chicken' },
//     { id: 'mutton', name: 'Mutton' },
//     { id: 'liver-more', name: 'Liver & More' },
//     { id: 'fish-seafood', name: 'Fish & Seafood' },
//     { id: 'prawns-crabs', name: 'Prawns & Crabs' },
//     { id: 'eggs', name: 'Eggs' }
//   ];

//   const [selectedMeatCut, setSelectedMeatCut] = useState(
//     localStorage.getItem('selectedMeatCut') || ''
//   );
//   const [activeFilters, setActiveFilters] = useState([]);

//   useEffect(() => {
//     const query = sessionStorage.getItem('searchQuery');
//     if (query) {
//       setSearchQuery(query);
//       sessionStorage.removeItem('searchQuery');
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const categoriesRef = ref(db, 'categories');
//         const categorySnapshot = await get(categoriesRef);
//         let categoriesData = [];
//         if (categorySnapshot.exists()) {
//           const data = categorySnapshot.val();
//           categoriesData = Object.keys(data).map(key => ({
//             ...data[key],
//             firebaseKey: key,
//             id: data[key].id || key
//           }));
//         } else {
//           categoriesData = getMockCategories();
//         }
//         setCategories(categoriesData);

//         if (!categoryId) {
//           const productsRef = ref(db, 'items');
//           const productsSnapshot = await get(productsRef);
//           let productsData = [];
//           if (productsSnapshot.exists()) {
//             const data = productsSnapshot.val();
//             productsData = Object.keys(data).map(key => ({
//               ...data[key],
//               id: key
//             }));
//           } else {
//             productsData = getAllMockProducts();
//           }
//           setAllProducts(productsData);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to load data. Please try again.');
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [categoryId]);

//   useEffect(() => {
//     if (categoryId) {
//       fetchProductsByCategory(categoryId);
//     }
//   }, [categoryId]);

//   useEffect(() => {
//     let filtered = [...categories];

//     // Apply search query filter
//     if (searchQuery && searchQuery.trim() !== '') {
//       const lowerCaseQuery = searchQuery.toLowerCase();
//       filtered = filtered.filter(category => 
//         (category.name && category.name.toLowerCase().includes(lowerCaseQuery)) ||
//         (category.description && category.description.toLowerCase().includes(lowerCaseQuery)) ||
//         (category.id && category.id.toLowerCase().includes(lowerCaseQuery))
//       );
//     }

//     // Apply category filter
//     if (selectedCategory && selectedCategory !== 'default') {
//       filtered = filtered.filter(category => 
//         category.id.toLowerCase() === selectedCategory.toLowerCase()
//       );
//     }

//     setFilteredCategories(filtered);
//   }, [searchQuery, categories, selectedCategory]);

//   useEffect(() => {
//     if (categoryId && products.length > 0) {
//       applyFiltersAndSort(products);
//     } else if (!categoryId && allProducts.length > 0) {
//       let filteredByCategory = [...allProducts];
//       if (selectedCategory && selectedCategory !== 'default') {
//         filteredByCategory = allProducts.filter(product => {
//           const productCategory = (product.category || '').toLowerCase();
//           const displayCategory = (product.displayCategory || '').toLowerCase();
//           return productCategory === selectedCategory.toLowerCase() || 
//                  displayCategory === selectedCategory.toLowerCase();
//         });
//       }
//       applyFiltersAndSort(filteredByCategory);
//     }
//     updateActiveFilters();
//   }, [products, allProducts, filterOptions, selectedCategory, selectedMeatCut, categoryId]);

//   const applyFiltersAndSort = (productsToFilter) => {
//     let result = [...productsToFilter];
//     if (!categoryId && selectedCategory && selectedCategory !== 'default') {
//       result = result.filter(product => {
//         const productCategory = (product.category || '').toLowerCase();
//         const displayCategory = (product.displayCategory || '').toLowerCase();
//         return productCategory === selectedCategory.toLowerCase() || 
//               displayCategory === selectedCategory.toLowerCase();
//       });
//     }
//     if (selectedMeatCut) {
//       result = result.filter(product => product.meatCut === selectedMeatCut);
//     }
//     if (filterOptions.discount) {
//       result = result.filter(product => 
//         (product.discount || 0) > 0
//       );
//     }
//     if (selectedCategory === 'discount') {
//       result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
//     }
//     setFilteredProducts(result);
//   };

//   const updateActiveFilters = () => {
//     const filters = [];
//     if (selectedMeatCut) {
//       filters.push({
//         type: 'meatCut',
//         value: selectedMeatCut === 'jc-jatka' ? 'JC Jatka' : 'Halal Cut'
//       });
//     }
//     if (selectedCategory && selectedCategory !== 'default') {
//       const category = availableCategories.find(cat => cat.id === selectedCategory);
//       if (category) {
//         filters.push({
//           type: 'category',
//           value: category.name
//         });
//       }
//     }
//     if (filterOptions.discount) {
//       filters.push({
//         type: 'discount',
//         value: 'Discounted Items'
//       });
//     }
//     setActiveFilters(filters);
//   };

//   const fetchProductsByCategory = async (id) => {
//     try {
//       setLoading(true);
//       let categoryData = null;
//       const categoryRef = ref(db, `categories/${id}`);
//       const categorySnapshot = await get(categoryRef);
//       if (categorySnapshot.exists()) {
//         categoryData = {
//           ...categorySnapshot.val(),
//           id: id
//         };
//       } else {
//         const categoriesRef = ref(db, 'categories');
//         const categoriesSnapshot = await get(categoriesRef);
//         if (categoriesSnapshot.exists()) {
//           const categoriesData = categoriesSnapshot.val();
//           const foundCategory = Object.entries(categoriesData).find(
//             ([key, value]) => value.id === id
//           );
//           if (foundCategory) {
//             categoryData = {
//               ...foundCategory[1],
//               id: foundCategory[0]
//             };
//           }
//         }
//       }
//       if (!categoryData) {
//         categoryData = getMockCategories().find(cat => cat.id === id);
//       }
//       const productsRef = ref(db, 'items');
//       const productsSnapshot = await get(productsRef);
//       if (productsSnapshot.exists()) {
//         const productsData = productsSnapshot.val();
//         const productsList = Object.entries(productsData)
//           .map(([key, value]) => ({
//             ...value,
//             id: key
//           }))
//           .filter(product => {
//             const productCategory = product.category ? product.category.toLowerCase() : '';
//             const productDisplayCategory = product.displayCategory ? product.displayCategory.toLowerCase() : '';
//             const targetCategory = id.toLowerCase();
//             const targetCategoryName = categoryData?.name ? categoryData.name.toLowerCase() : '';
//             return (
//               productCategory === targetCategory || 
//               productDisplayCategory === targetCategory ||
//               productCategory === targetCategoryName
//             );
//           });
//         const sortedProducts = productsList.sort((a, b) => a.name.localeCompare(b.name));
//         setProducts(sortedProducts);
//       } else {
//         const mockProducts = getMockProductsByCategory(id);
//         setProducts(mockProducts);
//       }
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       const mockProducts = getMockProductsByCategory(id);
//       setProducts(mockProducts);
//       setLoading(false);
//     }
//   };

//   const getAllMockProducts = () => {
//     const mockCategories = ['chicken', 'mutton', 'fish-seafood', 'liver-more', 'prawns-crabs', 'eggs', 'combos'];
//     let allMockProducts = [];
//     mockCategories.forEach(category => {
//       const products = getMockProductsByCategory(category);
//       allMockProducts = [...allMockProducts, ...products];
//     });
//     return allMockProducts;
//   };

//   const getMockCategories = () => {
//     return [
//       {
//         id: 'chicken',
//         name: 'Chicken',
//         image: 'https://t3.ftcdn.net/jpg/08/47/55/46/360_F_847554699_5QdX4XsvKyjMt1KjHAUPJ3y9Z3lhfin2.jpg',
//         description: 'Chicken products',
//         productCount: 5
//       },
//       {
//         id: 'mutton',
//         name: 'Mutton',
//         image: 'https://t3.ftcdn.net/jpg/02/04/61/82/360_F_204618263_v6wWkUH1lmNr2O9qU1Dvd5BBWgrhqR2b.jpg',
//         description: 'Mutton products',
//         productCount: 2
//       },
//       {
//         id: 'fish-seafood',
//         name: 'Fish & Seafood',
//         image: 'https://www.roswellpark.org/sites/default/files/2020-05/seafood.jpeg',
//         description: 'Fish & Seafood products',
//         productCount: 2
//       },
//       {
//         id: 'liver-more',
//         name: 'Liver & More',
//         image: 'https://www.thedeliciouscrescent.com/wp-content/uploads/2019/02/Pan-Fried-Liver-Garlic-Spices-4.jpg',
//         description: 'Liver & More products',
//         productCount: 1
//       },
//       {
//         id: 'prawns-crabs',
//         name: 'Prawns & Crabs',
//         image: 'https://media.istockphoto.com/id/453226127/photo/plate-full-of-king-crab-dinner.jpg?s=612x612&w=0&k=20&c=ZhJ4QSOq-vWeAt8ycdlohnzsO4rUxi5rbyGiBLjn0HY=',
//         description: 'Prawns & Crabs products',
//         productCount: 2
//       },
//       {
//         id: 'eggs',
//         name: 'Eggs',
//         image: 'https://c.ndtvimg.com/gws/5674/assets/4.jpeg?1651561595',
//         description: 'Eggs products',
//         productCount: 2
//       },
//       {
//         id: "combos",
//         name: "Combos",
//         image: "https://cti.farziengineer.co/products/Mutton__Chicken_Combo_1-4e27bce31673.png?auto=format&sharp=20&ixlib=react-9.3.0",
//         description: "Combo products",
//         productCount: 2
//       }
//     ];
//   };

//   const getMockProductsByCategory = (categoryId) => {
//     const normalizedCategoryId = categoryId.toLowerCase();
//     if (normalizedCategoryId === 'mutton') {
//       return [
//         {
//           id: 'mutton-chops-1',
//           name: 'Mutton-Chops',
//           category: 'mutton',
//           image: 'https://t3.ftcdn.net/jpg/02/04/61/82/360_F_204618263_v6wWkUH1lmNr2O9qU1Dvd5BBWgrhqR2b.jpg',
//           price: 950,
//           originalPrice: 1000,
//           discount: 5,
//           weight: '1000g',
//           pieces: '30-40',
//           serves: 4,
//           deliveryTime: 30,
//           meatCut: 'jc-jatka'
//         },
//         {
//           id: 'mutton-boneless-1',
//           name: 'Mutton Boneless',
//           category: 'mutton',
//           image: 'https://www.bigbasket.com/media/uploads/p/l/40048536_2-fresho-mutton-boneless.jpg',
//           price: 282,
//           originalPrice: 300,
//           discount: 6,
//           weight: '500g',
//           pieces: '12-18',
//           serves: 4,
//           deliveryTime: 30,
//           meatCut: 'halal-cut'
//         }
//       ];
//     } else if (normalizedCategoryId === 'chicken') {
//       return [
//         {
//           id: 'crispy-chicken-nuggets-1',
//           name: 'Crispy-Chicken-Nuggets',
//           category: 'chicken',
//           image: 'https://www.bigbasket.com/media/uploads/p/l/1214998_2-fresho-chicken-nuggets.jpg',
//           price: 141,
//           originalPrice: 152,
//           discount: 7,
//           weight: '250g',
//           pieces: '12',
//           serves: 4,
//           deliveryTime: 30,
//           meatCut: 'jc-jatka'
//         },
//         {
//           id: 'tandoori-chicken-1',
//           name: 'Tandoori Chicken',
//           category: 'chicken',
//           image: 'https://www.bigbasket.com/media/uploads/p/l/1214992_2-fresho-chicken-tandoori.jpg',
//           price: 284,
//           originalPrice: 299,
//           discount: 5,
//           weight: '350g',
//           pieces: '4-5',
//           serves: 2,
//           deliveryTime: 30,
//           meatCut: 'halal-cut'
//         },
//         {
//           id: 'chicken-curry-cut-1',
//           name: 'Chicken Curry Cut',
//           category: 'chicken',
//           image: 'https://t3.ftcdn.net/jpg/08/47/55/46/360_F_847554699_5QdX4XsvKyjMt1KjHAUPJ3y9Z3lhfin2.jpg',
//           price: 160,
//           originalPrice: 195,
//           discount: 18,
//           weight: '500g',
//           pieces: '12-18',
//           serves: 4,
//           deliveryTime: 30,
//           meatCut: 'jc-jatka'
//         },
//         {
//           id: 'chicken-breast-1',
//           name: 'Chicken Breast Boneless',
//           category: 'chicken',
//           image: 'https://fooppers.in/wp-content/uploads/2021/01/Chicken-Breast-Boneless-1.jpg',
//           price: 252,
//           originalPrice: 315,
//           discount: 20,
//           weight: '450g',
//           pieces: '2-4',
//           serves: 4,
//           deliveryTime: 30,
//           meatCut: 'halal-cut'
//         },
//         {
//           id: 'chicken-breast-2',
//           name: 'Chicken Breast Boneless 2',
//           category: 'chicken',
//           image: 'https://fooppers.in/wp-content/uploads/2021/01/Chicken-Breast-Boneless-1.jpg',
//           price: 252,
//           originalPrice: 315,
//           discount: 20,
//           weight: '450g',
//           pieces: '2-4',
//           serves: 4,
//           deliveryTime: 30,
//           meatCut: 'halal-cut'
//         }
//       ];
//     } else if (normalizedCategoryId === 'fish-seafood') {
//       return [
//         {
//           id: 'fish-1',
//           name: 'Fresh Pomfret',
//           category: 'fish-seafood',
//           image: 'https://www.roswellpark.org/sites/default/files/2020-05/seafood.jpeg',
//           price: 399,
//           originalPrice: 450,
//           discount: 11,
//           weight: '500g',
//           pieces: '2',
//           serves: 4,
//           deliveryTime: 30,
//           meatCut: 'jc-jatka'
//         },
//         {
//           id: 'fish-2',
//           name: 'Rohu Fish',
//           category: 'fish-seafood',
//           image: 'https://4.imimg.com/data4/KM/PY/ANDROID-57667324/product-500x500.jpeg',
//           price: 259,
//           originalPrice: 299,
//           discount: 13,
//           weight: '1kg',
//           pieces: '1',
//           serves: 4,
//           deliveryTime: 30,
//           meatCut: 'halal-cut'
//         }
//       ];
//     } else if (normalizedCategoryId === 'combos') {
//       return [
//         {
//           id: 'combo-1',
//           name: 'Mutton & Chicken Combo',
//           category: 'combos',
//           image: 'https://cti.farziengineer.co/products/Mutton__Chicken_Combo_1-4e27bce31673.png',
//           price: 599,
//           originalPrice: 700,
//           discount: 14,
//           weight: '1kg',
//           pieces: '20',
//           serves: 8,
//           deliveryTime: 30,
//           meatCut: 'jc-jatka'
//         },
//         {
//           id: 'combo-2',
//           name: 'Seafood Combo',
//           category: 'combos',
//           image: 'https://media.istockphoto.com/id/1126131932/photo/selection-of-aminal-protein-sources-on-wood-background.jpg',
//           price: 799,
//           originalPrice: 950,
//           discount: 16,
//           weight: '1.2kg',
//           pieces: '10',
//           serves: 6,
//           deliveryTime: 30,
//           meatCut: 'halal-cut'
//         }
//       ];
//     } else if (normalizedCategoryId === 'eggs') {
//       return [
//         {
//           id: 'eggs-1',
//           name: 'Farm Fresh Eggs',
//           category: 'eggs',
//           image: 'https://c.ndtvimg.com/gws/5674/assets/4.jpeg',
//           price: 84,
//           originalPrice: 90,
//           discount: 7,
//           weight: '6 pcs',
//           pieces: '6',
//           serves: 3,
//           deliveryTime: 30
//         },
//         {
//           id: 'eggs-2',
//           name: 'Organic Eggs',
//           category: 'eggs',
//           image: 'https://c.ndtvimg.com/gws/5674/assets/4.jpeg',
//           price: 120,
//           originalPrice: 130,
//           discount: 8,
//           weight: '12 pcs',
//           pieces: '12',
//           serves: 6,
//           deliveryTime: 30
//         }
//       ];
//     } else if (normalizedCategoryId === 'liver-more') {
//       return [
//         {
//           id: 'liver-1',
//           name: 'Chicken Liver',
//           category: 'liver-more',
//           image: 'https://www.thedeliciouscrescent.com/wp-content/uploads/2019/02/Pan-Fried-Liver-Garlic-Spices-4.jpg',
//           price: 129,
//           originalPrice: 150,
//           discount: 14,
//           weight: '500g',
//           pieces: '10',
//           serves: 4,
//           deliveryTime: 30,
//           meatCut: 'jc-jatka'
//         }
//       ];
//     } else if (normalizedCategoryId === 'prawns-crabs') {
//       return [
//         {
//           id: 'prawns-1',
//           name: 'Tiger Prawns',
//           category: 'prawns-crabs',
//           image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRerUmuD5XXr10HFnp_awnfhkjaEu2G_Q2pSQ&s',
//           price: 429,
//           originalPrice: 499,
//           discount: 14,
//           weight: '500g',
//           pieces: '20-25',
//           serves: 4,
//           deliveryTime: 30,
//           meatCut: 'jc-jatka'
//         },
//         {
//           id: 'crab-1',
//           name: 'Crab',
//           category: 'prawns-crabs',
//           image: 'https://media.istockphoto.com/id/453226127/photo/plate-full-of-king-crab-dinner.jpg',
//           price: 599,
//           originalPrice: 649,
//           discount: 8,
//           weight: '1kg',
//           pieces: '2',
//           serves: 4,
//           deliveryTime: 30,
//           meatCut: 'halal-cut'
//         }
//       ];
//     }
//     return [];
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//   };

//   const clearSearch = () => {
//     setSearchQuery('');
//   };

//   const getCurrentPageItems = () => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
//   };

//   const paginate = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo(0, 0);
//   };

//   const handleCategoryChange = (e) => {
//     const newCategory = e.target.value;
//     setSelectedCategory(newCategory);
//     if (newCategory === 'default') {
//       localStorage.removeItem('selectedCategory');
//     } else {
//       localStorage.setItem('selectedCategory', newCategory);
//     }
//     if (categoryId && newCategory !== 'default' && newCategory !== categoryId) {
//       navigate(`/category/${newCategory}`);
//     }
//     setCurrentPage(1);
//   };

//   const handleFilterToggle = () => {
//     setShowFilter(!showFilter);
//   };

//   const handleFilterChange = (name, value) => {
//     setFilterOptions({
//       ...filterOptions,
//       [name]: value
//     });
//     setCurrentPage(1);
//   };

//   const resetFilters = () => {
//     setFilterOptions({
//       discount: false
//     });
//     setSelectedCategory('default');
//     localStorage.removeItem('selectedCategory');
//     setSelectedMeatCut('');
//     localStorage.removeItem('selectedMeatCut');
//     setCurrentPage(1);
//     window.location.reload();
//   };

//   const handleMeatCutChange = (cutType) => {
//     if (selectedMeatCut === cutType) {
//       setSelectedMeatCut('');
//       localStorage.removeItem('selectedMeatCut');
//     } else {
//       setSelectedMeatCut(cutType);
//       localStorage.setItem('selectedMeatCut', cutType);
//     }
//     setCurrentPage(1);
//   };

//   const removeFilter = (filterType, filterValue) => {
//     if (filterType === 'meatCut') {
//       setSelectedMeatCut('');
//       localStorage.removeItem('selectedMeatCut');
//     } else if (filterType === 'category') {
//       setSelectedCategory('default');
//       localStorage.removeItem('selectedCategory');
//     } else if (filterType === 'discount') {
//       setFilterOptions({
//         ...filterOptions,
//         discount: false
//       });
//     }
//     setCurrentPage(1);
//     window.location.reload();
//   };

//   const preloadImage = (src) => {
//     if (!src) return 'https://via.placeholder.com/300x180?text=Image+Not+Found';
//     const img = new Image();
//     img.src = src;
//     return src;
//   };

//   const shouldHighlightProduct = (product) => {
//     let matchesFilter = true;
//     if (selectedCategory && selectedCategory !== 'default') {
//       const productCategory = (product.category || '').toLowerCase();
//       const displayCategory = (product.displayCategory || '').toLowerCase();
//       matchesFilter = matchesFilter && (
//         productCategory === selectedCategory.toLowerCase() ||
//         displayCategory === selectedCategory.toLowerCase()
//       );
//     }
//     if (selectedMeatCut) {
//       matchesFilter = matchesFilter && (product.meatCut === selectedMeatCut);
//     }
//     if (filterOptions.discount) {
//       matchesFilter = matchesFilter && ((product.discount || 0) > 0);
//     }
//     if (selectedCategory === 'discount') {
//       matchesFilter = matchesFilter && ((product.discount || 0) > 0);
//     }
//     return matchesFilter;
//   };

//   if (loading) {
//     return (
//       <div className="categories-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading categories...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="categories-error">
//         <p>{error}</p>
//         <button onClick={() => window.location.reload()} className="retry-button">
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (categoryId) {
//     const currentCategory = categories.find(cat => cat.id === categoryId) || 
//                            { name: categoryId, description: 'Products' };
//     const currentItems = getCurrentPageItems();
//     const meatCutLabel = selectedMeatCut === 'jc-jatka' ? 'JC Jatka' : 
//                         selectedMeatCut === 'halal-cut' ? 'Halal Cut' : '';

//     return (
//       <div className="category-detail-page">
//         <div className="container">
//           <div className="breadcrumb-navigation">
//             <Link to="/" className="breadcrumb-link">Home</Link>
//             <span className="breadcrumb-separator">/</span>
//             <Link to="/categories" className="breadcrumb-link">Categories</Link>
//             <span className="breadcrumb-separator">/</span>
//             <span className="breadcrumb-current">{currentCategory.name}</span>
//           </div>
          
//           <div className="category-header">
//             <h1 className="category-title">
//               {currentCategory.name} {selectedMeatCut ? `- ${meatCutLabel}` : ''}
//             </h1>
//             {currentCategory.description && (
//               <p className="category-description">{currentCategory.description}</p>
//             )}
//           </div>
          
//           <div className="product-controls">
//             <div className="category-search-wrapper" style={{ width: '300px' }}>
//               <input
//                 type="text"
//                 placeholder="Search categories"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 className="category-search-input"
//               />
//               {searchQuery && (
//                 <button 
//                   type="button" 
//                   className="clear-search-btn" 
//                   onClick={clearSearch}
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
            
//             <div className="sort-control">
//               <label htmlFor="sort-select">
//                 <FaSortAmountDown /> Category:
//               </label>
//               <select 
//                 id="sort-select" 
//                 value={selectedCategory}
//                 onChange={handleCategoryChange}
//                 className="sort-select"
//               >
//                 {availableCategories.map(category => (
//                   <option key={category.id} value={category.id}>
//                     {category.name}
//                   </option>
//                 ))}
//                 <option value="discount">Discounted Items</option>
//               </select>
//             </div>
//           </div>
          
         
          
//           <div className="products-info">
//             <p className="product-count-info">
//               Showing {currentItems.length} of {filteredProducts.length} products
//             </p>
//           </div>
          
//           {filteredProducts.length === 0 ? (
//             <div className="no-products-found">
//               <p>No products found matching your selection. Try different filter options.</p>
//               <button className="reset-button" onClick={resetFilters}>Reset All Filters</button>
//             </div>
//           ) : (
//             <div className="products-grid">
//               {currentItems.map(product => (
//                 <div 
//                   className={`product-card ${shouldHighlightProduct(product) ? 'highlight' : ''}`} 
//                   key={product.id}
//                 >
//                   <div className="product-image">
//                     {product.discount > 0 && (
//                       <div className="discount-badge">
//                         {product.discount}% OFF
//                       </div>
//                     )}
//                     <img 
//                       src={product.image} 
//                       alt={product.name}
//                       onError={(e) => {
//                         e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
//                       }}
//                     />
//                     <button className="add-to-cart-btn">+</button>
//                   </div>
//                   <div className="product-details">
//                     <h3 className="product-name">{product.name}</h3>
//                     <div className="product-specs">
//                       {product.weight && <span>{product.weight}</span>}
//                       {product.pieces && <span>{product.pieces} {product.pieces === 1 ? 'Piece' : 'Pieces'}</span>}
//                       {product.serves && <span>Serves: {product.serves}</span>}
//                     </div>
//                     {product.meatCut && (
//                       <div className="meat-cut-label">
//                         <span className={`meat-cut-tag ${product.meatCut}`}>
//                           {product.meatCut === 'jc-jatka' ? 'JC Jatka' : 'Halal Cut'}
//                         </span>
//                       </div>
//                     )}
//                     <div className="product-price">
//                       <span className="current-price">₹{product.price}</span>
//                       {product.originalPrice && product.originalPrice > product.price && (
//                         <span className="original-price">₹{product.originalPrice}</span>
//                       )}
//                     </div>
//                     <div className="delivery-info">
//                       {product.deliveryTime && (
//                         <span>Delivered in {product.deliveryTime} mins</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
          
//           {filteredProducts.length > itemsPerPage && (
//             <div className="pagination">
//               <button 
//                 onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} 
//                 className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
//                 disabled={currentPage === 1}
//               >
//                 <FaArrowLeft />
//               </button>
              
//               {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }).map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => paginate(index + 1)}
//                   className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
              
//               <button 
//                 onClick={() => paginate(currentPage < Math.ceil(filteredProducts.length / itemsPerPage) ? currentPage + 1 : Math.ceil(filteredProducts.length / itemsPerPage))} 
//                 className={`pagination-btn ${currentPage === Math.ceil(filteredProducts.length / itemsPerPage) ? 'disabled' : ''}`}
//                 disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
//               >
//                 <FaArrowRight />
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="category-page">
//       <div className="container">
//         <div className="breadcrumb-navigation">
//           <Link to="/" className="home-link">
//             <span>Home</span>
//             <FaArrowRight className="breadcrumb-arrow" />
//           </Link>
//           <span className="current-page">Categories</span>
//         </div>
        
//         <h1 className="page-title">Shop by Categories</h1>
//         <p className="page-subtitle"></p>
        
//         <div className="product-controls">
//           <div className="category-search-wrapper" style={{ width: '300px' }}>
//             <input
//               type="text"
//               placeholder="Search categories"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               className="category-search-input"
//             />
//             {searchQuery && (
//               <button 
//                 type="button" 
//                 className="clear-search-btn" 
//                 onClick={clearSearch}
//               >
//                 ✕
//               </button>
//             )}
//           </div>
          
//           <div className="sort-control">
//             <label htmlFor="sort-select">
//               <FaSortAmountDown /> Category:
//             </label>
//             <select 
//               id="sort-select" 
//               value={selectedCategory}
//               onChange={handleCategoryChange}
//               className="sort-select"
//             >
//               {availableCategories.map(category => (
//                 <option key={category.id} value={category.id}>
//                   {category.name}
//                 </option>
//               ))}
//               <option value="discount">Discounted Items</option>
//             </select>
//           </div>
//         </div>
        
//         {searchQuery && (
//           <p className="search-results-info">
//             {filteredCategories.length === 0 
//               ? `No categories found for "${searchQuery}"`
//               : `Showing results for "${searchQuery}"`
//             }
//           </p>
//         )}
        
//         {filteredCategories.length === 0 && (searchQuery || selectedCategory !== 'default') ? (
//           <div className="no-categories-found">
//             <p>No categories match your selection. Try a different category or search term.</p>
//             <button className="show-all-btn" onClick={() => {
//               clearSearch();
//               setSelectedCategory('default');
//               localStorage.removeItem('selectedCategory');
//             }}>
//               Show All Categories
//             </button>
//           </div>
//         ) : (
//           <div className="categories-grid">
//             {filteredCategories.map((category, index) => {
//               const categoryId = category.id || category.firebaseKey || `category-${index}`;
//               return (
//                 <Link 
//                   to={`/category/${categoryId}`}
//                   className="category-card"
//                   key={categoryId}
//                   state={{ categoryData: category }}
//                 >
//                   <div className="category-image">
//                     <img 
//                       src={preloadImage(category.image)} 
//                       alt={category.name}
//                       onError={(e) => {
//                         console.error('Failed to load image:', category.image);
//                         e.target.src = 'https://via.placeholder.com/300x180?text=Image+Not+Found';
//                       }}
//                     />
//                   </div>
//                   <div className="category-details">
//                     <h2 className="category-name">{category.name || 'Category'}</h2>
//                     {/* <p className="category-description">{category.description || 'Explore our products'}</p> */}
//                     <div className="category-footer">
//                       {/* <span className="product-count">{category.productCount || 0} products</span> */}
//                       <span className="view-link">
//                         View All <FaArrowRight />
//                       </span>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CategoryPage;






import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { ref, get } from 'firebase/database';
import '../styles/pages/CategoryPage.css';
import { FaArrowRight, FaArrowLeft, FaFilter, FaSortAmountDown, FaTimes } from 'react-icons/fa';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem('selectedCategory') || 'default'
  );
  const [showFilter, setShowFilter] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    discount: false
  });

  // Dynamic available categories - will be populated from Firebase
  const [availableCategories, setAvailableCategories] = useState([
    { id: 'default', name: 'All Categories' }
  ]);

  const [selectedMeatCut, setSelectedMeatCut] = useState(
    localStorage.getItem('selectedMeatCut') || ''
  );
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    const query = sessionStorage.getItem('searchQuery');
    if (query) {
      setSearchQuery(query);
      sessionStorage.removeItem('searchQuery');
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch display categories from Firebase (new system)
        const displayCategoriesRef = ref(db, 'displayCategories');
        const displayCategoriesSnapshot = await get(displayCategoriesRef);
        
        let categoriesData = [];
        if (displayCategoriesSnapshot.exists()) {
          const data = displayCategoriesSnapshot.val();
          categoriesData = Object.keys(data).map(key => ({
            ...data[key],
            firebaseKey: key,
            id: data[key].id || key
          })).filter(cat => cat.isActive !== false); // Only show active categories
        }
        
        // Also fetch from old categories system for backward compatibility
        const categoriesRef = ref(db, 'categories');
        const categorySnapshot = await get(categoriesRef);
        if (categorySnapshot.exists()) {
          const oldData = categorySnapshot.val();
          const oldCategoriesData = Object.keys(oldData).map(key => ({
            ...oldData[key],
            firebaseKey: key,
            id: oldData[key].id || key
          }));
          
          // Merge categories, prioritizing display categories
          const existingIds = categoriesData.map(cat => cat.id);
          const additionalCategories = oldCategoriesData.filter(cat => !existingIds.includes(cat.id));
          categoriesData = [...categoriesData, ...additionalCategories];
        }
        
        // If no categories found, use fallback mock categories
        if (categoriesData.length === 0) {
          categoriesData = getMockCategories();
        }
        
        setCategories(categoriesData);
        
        // Update available categories for dropdown
        const dynamicCategories = [
          { id: 'default', name: 'All Categories' },
          ...categoriesData.map(cat => ({
            id: cat.id,
            name: cat.name
          }))
        ];
        setAvailableCategories(dynamicCategories);

        if (!categoryId) {
          const productsRef = ref(db, 'items');
          const productsSnapshot = await get(productsRef);
          let productsData = [];
          if (productsSnapshot.exists()) {
            const data = productsSnapshot.val();
            productsData = Object.keys(data).map(key => ({
              ...data[key],
              id: key
            }));
          } else {
            productsData = getAllMockProducts();
          }
          setAllProducts(productsData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
        // Fallback to mock data
        const mockCategories = getMockCategories();
        setCategories(mockCategories);
        const dynamicCategories = [
          { id: 'default', name: 'All Categories' },
          ...mockCategories.map(cat => ({
            id: cat.id,
            name: cat.name
          }))
        ];
        setAvailableCategories(dynamicCategories);
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      fetchProductsByCategory(categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    let filtered = [...categories];

    // Apply search query filter
    if (searchQuery && searchQuery.trim() !== '') {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(category => 
        (category.name && category.name.toLowerCase().includes(lowerCaseQuery)) ||
        (category.description && category.description.toLowerCase().includes(lowerCaseQuery)) ||
        (category.id && category.id.toLowerCase().includes(lowerCaseQuery))
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== 'default') {
      filtered = filtered.filter(category => 
        category.id.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredCategories(filtered);
  }, [searchQuery, categories, selectedCategory]);

  useEffect(() => {
    if (categoryId && products.length > 0) {
      applyFiltersAndSort(products);
    } else if (!categoryId && allProducts.length > 0) {
      let filteredByCategory = [...allProducts];
      if (selectedCategory && selectedCategory !== 'default') {
        filteredByCategory = allProducts.filter(product => {
          const productCategory = (product.category || '').toLowerCase();
          const displayCategory = (product.displayCategory || '').toLowerCase();
          return productCategory === selectedCategory.toLowerCase() || 
                 displayCategory === selectedCategory.toLowerCase();
        });
      }
      applyFiltersAndSort(filteredByCategory);
    }
    updateActiveFilters();
  }, [products, allProducts, filterOptions, selectedCategory, selectedMeatCut, categoryId]);

  const applyFiltersAndSort = (productsToFilter) => {
    let result = [...productsToFilter];
    if (!categoryId && selectedCategory && selectedCategory !== 'default') {
      result = result.filter(product => {
        const productCategory = (product.category || '').toLowerCase();
        const displayCategory = (product.displayCategory || '').toLowerCase();
        return productCategory === selectedCategory.toLowerCase() || 
              displayCategory === selectedCategory.toLowerCase();
      });
    }
    if (selectedMeatCut) {
      result = result.filter(product => product.meatCut === selectedMeatCut);
    }
    if (filterOptions.discount) {
      result = result.filter(product => 
        (product.discount || 0) > 0
      );
    }
    if (selectedCategory === 'discount') {
      result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }
    setFilteredProducts(result);
  };

  const updateActiveFilters = () => {
    const filters = [];
    if (selectedMeatCut) {
      filters.push({
        type: 'meatCut',
        value: selectedMeatCut === 'jc-jatka' ? 'JC Jatka' : 'Halal Cut'
      });
    }
    if (selectedCategory && selectedCategory !== 'default') {
      const category = availableCategories.find(cat => cat.id === selectedCategory);
      if (category) {
        filters.push({
          type: 'category',
          value: category.name
        });
      }
    }
    if (filterOptions.discount) {
      filters.push({
        type: 'discount',
        value: 'Discounted Items'
      });
    }
    setActiveFilters(filters);
  };

  const fetchProductsByCategory = async (id) => {
    try {
      setLoading(true);
      let categoryData = null;
      
      // First try to find in display categories
      const displayCategoriesRef = ref(db, 'displayCategories');
      const displayCategoriesSnapshot = await get(displayCategoriesRef);
      if (displayCategoriesSnapshot.exists()) {
        const displayCategoriesData = displayCategoriesSnapshot.val();
        const foundDisplayCategory = Object.entries(displayCategoriesData).find(
          ([key, value]) => value.id === id
        );
        if (foundDisplayCategory) {
          categoryData = {
            ...foundDisplayCategory[1],
            id: foundDisplayCategory[0]
          };
        }
      }
      
      // If not found, try old categories system
      if (!categoryData) {
        const categoryRef = ref(db, `categories/${id}`);
        const categorySnapshot = await get(categoryRef);
        if (categorySnapshot.exists()) {
          categoryData = {
            ...categorySnapshot.val(),
            id: id
          };
        } else {
          const categoriesRef = ref(db, 'categories');
          const categoriesSnapshot = await get(categoriesRef);
          if (categoriesSnapshot.exists()) {
            const categoriesData = categoriesSnapshot.val();
            const foundCategory = Object.entries(categoriesData).find(
              ([key, value]) => value.id === id
            );
            if (foundCategory) {
              categoryData = {
                ...foundCategory[1],
                id: foundCategory[0]
              };
            }
          }
        }
      }
      
      // If still not found, use mock data
      if (!categoryData) {
        categoryData = getMockCategories().find(cat => cat.id === id);
      }
      
      const productsRef = ref(db, 'items');
      const productsSnapshot = await get(productsRef);
      if (productsSnapshot.exists()) {
        const productsData = productsSnapshot.val();
        const productsList = Object.entries(productsData)
          .map(([key, value]) => ({
            ...value,
            id: key
          }))
          .filter(product => {
            const productCategory = product.category ? product.category.toLowerCase() : '';
            const productDisplayCategory = product.displayCategory ? product.displayCategory.toLowerCase() : '';
            const targetCategory = id.toLowerCase();
            const targetCategoryName = categoryData?.name ? categoryData.name.toLowerCase() : '';
            return (
              productCategory === targetCategory || 
              productDisplayCategory === targetCategory ||
              productCategory === targetCategoryName
            );
          });
        const sortedProducts = productsList.sort((a, b) => a.name.localeCompare(b.name));
        setProducts(sortedProducts);
      } else {
        const mockProducts = getMockProductsByCategory(id);
        setProducts(mockProducts);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      const mockProducts = getMockProductsByCategory(id);
      setProducts(mockProducts);
      setLoading(false);
    }
  };

  const getAllMockProducts = () => {
    const mockCategories = ['chicken', 'mutton', 'fish-seafood', 'liver-more', 'prawns-crabs', 'eggs', 'combos'];
    let allMockProducts = [];
    mockCategories.forEach(category => {
      const products = getMockProductsByCategory(category);
      allMockProducts = [...allMockProducts, ...products];
    });
    return allMockProducts;
  };

  const getMockCategories = () => {
    return [
      {
        id: 'chicken',
        name: 'Chicken',
        image: 'https://t3.ftcdn.net/jpg/08/47/55/46/360_F_847554699_5QdX4XsvKyjMt1KjHAUPJ3y9Z3lhfin2.jpg',
        description: 'Chicken products',
        productCount: 5
      },
      {
        id: 'mutton',
        name: 'Mutton',
        image: 'https://t3.ftcdn.net/jpg/02/04/61/82/360_F_204618263_v6wWkUH1lmNr2O9qU1Dvd5BBWgrhqR2b.jpg',
        description: 'Mutton products',
        productCount: 2
      },
      {
        id: 'fish-seafood',
        name: 'Fish & Seafood',
        image: 'https://www.roswellpark.org/sites/default/files/2020-05/seafood.jpeg',
        description: 'Fish & Seafood products',
        productCount: 2
      },
      {
        id: 'liver-more',
        name: 'Liver & More',
        image: 'https://www.thedeliciouscrescent.com/wp-content/uploads/2019/02/Pan-Fried-Liver-Garlic-Spices-4.jpg',
        description: 'Liver & More products',
        productCount: 1
      },
      {
        id: 'prawns-crabs',
        name: 'Prawns & Crabs',
        image: 'https://media.istockphoto.com/id/453226127/photo/plate-full-of-king-crab-dinner.jpg?s=612x612&w=0&k=20&c=ZhJ4QSOq-vWeAt8ycdlohnzsO4rUxi5rbyGiBLjn0HY=',
        description: 'Prawns & Crabs products',
        productCount: 2
      },
      {
        id: 'eggs',
        name: 'Eggs',
        image: 'https://c.ndtvimg.com/gws/5674/assets/4.jpeg?1651561595',
        description: 'Eggs products',
        productCount: 2
      },
      {
        id: "combos",
        name: "Combos",
        image: "https://cti.farziengineer.co/products/Mutton__Chicken_Combo_1-4e27bce31673.png?auto=format&sharp=20&ixlib=react-9.3.0",
        description: "Combo products",
        productCount: 2
      }
    ];
  };

  const getMockProductsByCategory = (categoryId) => {
    const normalizedCategoryId = categoryId.toLowerCase();
    if (normalizedCategoryId === 'mutton') {
      return [
        {
          id: 'mutton-chops-1',
          name: 'Mutton-Chops',
          category: 'mutton',
          image: 'https://t3.ftcdn.net/jpg/02/04/61/82/360_F_204618263_v6wWkUH1lmNr2O9qU1Dvd5BBWgrhqR2b.jpg',
          price: 950,
          originalPrice: 1000,
          discount: 5,
          weight: '1000g',
          pieces: '30-40',
          serves: 4,
          deliveryTime: 30,
          meatCut: 'jc-jatka'
        },
        {
          id: 'mutton-boneless-1',
          name: 'Mutton Boneless',
          category: 'mutton',
          image: 'https://www.bigbasket.com/media/uploads/p/l/40048536_2-fresho-mutton-boneless.jpg',
          price: 282,
          originalPrice: 300,
          discount: 6,
          weight: '500g',
          pieces: '12-18',
          serves: 4,
          deliveryTime: 30,
          meatCut: 'halal-cut'
        }
      ];
    } else if (normalizedCategoryId === 'chicken') {
      return [
        {
          id: 'crispy-chicken-nuggets-1',
          name: 'Crispy-Chicken-Nuggets',
          category: 'chicken',
          image: 'https://www.bigbasket.com/media/uploads/p/l/1214998_2-fresho-chicken-nuggets.jpg',
          price: 141,
          originalPrice: 152,
          discount: 7,
          weight: '250g',
          pieces: '12',
          serves: 4,
          deliveryTime: 30,
          meatCut: 'jc-jatka'
        },
        {
          id: 'tandoori-chicken-1',
          name: 'Tandoori Chicken',
          category: 'chicken',
          image: 'https://www.bigbasket.com/media/uploads/p/l/1214992_2-fresho-chicken-tandoori.jpg',
          price: 284,
          originalPrice: 299,
          discount: 5,
          weight: '350g',
          pieces: '4-5',
          serves: 2,
          deliveryTime: 30,
          meatCut: 'halal-cut'
        },
        {
          id: 'chicken-curry-cut-1',
          name: 'Chicken Curry Cut',
          category: 'chicken',
          image: 'https://t3.ftcdn.net/jpg/08/47/55/46/360_F_847554699_5QdX4XsvKyjMt1KjHAUPJ3y9Z3lhfin2.jpg',
          price: 160,
          originalPrice: 195,
          discount: 18,
          weight: '500g',
          pieces: '12-18',
          serves: 4,
          deliveryTime: 30,
          meatCut: 'jc-jatka'
        },
        {
          id: 'chicken-breast-1',
          name: 'Chicken Breast Boneless',
          category: 'chicken',
          image: 'https://fooppers.in/wp-content/uploads/2021/01/Chicken-Breast-Boneless-1.jpg',
          price: 252,
          originalPrice: 315,
          discount: 20,
          weight: '450g',
          pieces: '2-4',
          serves: 4,
          deliveryTime: 30,
          meatCut: 'halal-cut'
        },
        {
          id: 'chicken-breast-2',
          name: 'Chicken Breast Boneless 2',
          category: 'chicken',
          image: 'https://fooppers.in/wp-content/uploads/2021/01/Chicken-Breast-Boneless-1.jpg',
          price: 252,
          originalPrice: 315,
          discount: 20,
          weight: '450g',
          pieces: '2-4',
          serves: 4,
          deliveryTime: 30,
          meatCut: 'halal-cut'
        }
      ];
    } else if (normalizedCategoryId === 'fish-seafood') {
      return [
        {
          id: 'fish-1',
          name: 'Fresh Pomfret',
          category: 'fish-seafood',
          image: 'https://www.roswellpark.org/sites/default/files/2020-05/seafood.jpeg',
          price: 399,
          originalPrice: 450,
          discount: 11,
          weight: '500g',
          pieces: '2',
          serves: 4,
          deliveryTime: 30,
          meatCut: 'jc-jatka'
        },
        {
          id: 'fish-2',
          name: 'Rohu Fish',
          category: 'fish-seafood',
          image: 'https://4.imimg.com/data4/KM/PY/ANDROID-57667324/product-500x500.jpeg',
          price: 259,
          originalPrice: 299,
          discount: 13,
          weight: '1kg',
          pieces: '1',
          serves: 4,
          deliveryTime: 30,
          meatCut: 'halal-cut'
        }
      ];
    } else if (normalizedCategoryId === 'combos') {
      return [
        {
          id: 'combo-1',
          name: 'Mutton & Chicken Combo',
          category: 'combos',
          image: 'https://cti.farziengineer.co/products/Mutton__Chicken_Combo_1-4e27bce31673.png',
          price: 599,
          originalPrice: 700,
          discount: 14,
          weight: '1kg',
          pieces: '20',
          serves: 8,
          deliveryTime: 30,
          meatCut: 'jc-jatka'
        },
        {
          id: 'combo-2',
          name: 'Seafood Combo',
          category: 'combos',
          image: 'https://media.istockphoto.com/id/1126131932/photo/selection-of-aminal-protein-sources-on-wood-background.jpg',
          price: 799,
          originalPrice: 950,
          discount: 16,
          weight: '1.2kg',
          pieces: '10',
          serves: 6,
          deliveryTime: 30,
          meatCut: 'halal-cut'
        }
      ];
    } else if (normalizedCategoryId === 'eggs') {
      return [
        {
          id: 'eggs-1',
          name: 'Farm Fresh Eggs',
          category: 'eggs',
          image: 'https://c.ndtvimg.com/gws/5674/assets/4.jpeg',
          price: 84,
          originalPrice: 90,
          discount: 7,
          weight: '6 pcs',
          pieces: '6',
          serves: 3,
          deliveryTime: 30
        },
        {
          id: 'eggs-2',
          name: 'Organic Eggs',
          category: 'eggs',
          image: 'https://c.ndtvimg.com/gws/5674/assets/4.jpeg',
          price: 120,
          originalPrice: 130,
          discount: 8,
          weight: '12 pcs',
          pieces: '12',
          serves: 6,
          deliveryTime: 30
        }
      ];
    } else if (normalizedCategoryId === 'liver-more') {
      return [
        {
          id: 'liver-1',
          name: 'Chicken Liver',
          category: 'liver-more',
          image: 'https://www.thedeliciouscrescent.com/wp-content/uploads/2019/02/Pan-Fried-Liver-Garlic-Spices-4.jpg',
          price: 129,
          originalPrice: 150,
          discount: 14,
          weight: '500g',
          pieces: '10',
          serves: 4,
          deliveryTime: 30,
          meatCut: 'jc-jatka'
        }
      ];
    } else if (normalizedCategoryId === 'prawns-crabs') {
      return [
        {
          id: 'prawns-1',
          name: 'Tiger Prawns',
          category: 'prawns-crabs',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRerUmuD5XXr10HFnp_awnfhkjaEu2G_Q2pSQ&s',
          price: 429,
          originalPrice: 499,
          discount: 14,
          weight: '500g',
          pieces: '20-25',
          serves: 4,
          deliveryTime: 30,
          meatCut: 'jc-jatka'
        },
        {
          id: 'crab-1',
          name: 'Crab',
          category: 'prawns-crabs',
          image: 'https://media.istockphoto.com/id/453226127/photo/plate-full-of-king-crab-dinner.jpg',
          price: 599,
          originalPrice: 649,
          discount: 8,
          weight: '1kg',
          pieces: '2',
          serves: 4,
          deliveryTime: 30,
          meatCut: 'halal-cut'
        }
      ];
    }
    return [];
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getCurrentPageItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    if (newCategory === 'default') {
      localStorage.removeItem('selectedCategory');
    } else {
      localStorage.setItem('selectedCategory', newCategory);
    }
    if (categoryId && newCategory !== 'default' && newCategory !== categoryId) {
      navigate(`/category/${newCategory}`);
    }
    setCurrentPage(1);
  };

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };

  const handleFilterChange = (name, value) => {
    setFilterOptions({
      ...filterOptions,
      [name]: value
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterOptions({
      discount: false
    });
    setSelectedCategory('default');
    localStorage.removeItem('selectedCategory');
    setSelectedMeatCut('');
    localStorage.removeItem('selectedMeatCut');
    setCurrentPage(1);
    window.location.reload();
  };

  const handleMeatCutChange = (cutType) => {
    if (selectedMeatCut === cutType) {
      setSelectedMeatCut('');
      localStorage.removeItem('selectedMeatCut');
    } else {
      setSelectedMeatCut(cutType);
      localStorage.setItem('selectedMeatCut', cutType);
    }
    setCurrentPage(1);
  };

  const removeFilter = (filterType, filterValue) => {
    if (filterType === 'meatCut') {
      setSelectedMeatCut('');
      localStorage.removeItem('selectedMeatCut');
    } else if (filterType === 'category') {
      setSelectedCategory('default');
      localStorage.removeItem('selectedCategory');
    } else if (filterType === 'discount') {
      setFilterOptions({
        ...filterOptions,
        discount: false
      });
    }
    setCurrentPage(1);
    window.location.reload();
  };

  const preloadImage = (src) => {
    if (!src) return 'https://via.placeholder.com/300x180?text=Image+Not+Found';
    const img = new Image();
    img.src = src;
    return src;
  };

  const shouldHighlightProduct = (product) => {
    let matchesFilter = true;
    if (selectedCategory && selectedCategory !== 'default') {
      const productCategory = (product.category || '').toLowerCase();
      const displayCategory = (product.displayCategory || '').toLowerCase();
      matchesFilter = matchesFilter && (
        productCategory === selectedCategory.toLowerCase() ||
        displayCategory === selectedCategory.toLowerCase()
      );
    }
    if (selectedMeatCut) {
      matchesFilter = matchesFilter && (product.meatCut === selectedMeatCut);
    }
    if (filterOptions.discount) {
      matchesFilter = matchesFilter && ((product.discount || 0) > 0);
    }
    if (selectedCategory === 'discount') {
      matchesFilter = matchesFilter && ((product.discount || 0) > 0);
    }
    return matchesFilter;
  };

  if (loading) {
    return (
      <div className="categories-loading">
        <div className="loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (categoryId) {
    const currentCategory = categories.find(cat => cat.id === categoryId) || 
                           { name: categoryId, description: 'Products' };
    const currentItems = getCurrentPageItems();
    const meatCutLabel = selectedMeatCut === 'jc-jatka' ? 'JC Jatka' : 
                        selectedMeatCut === 'halal-cut' ? 'Halal Cut' : '';

    return (
      <div className="category-detail-page">
        <div className="container">
          <div className="breadcrumb-navigation">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/categories" className="breadcrumb-link">Categories</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{currentCategory.name}</span>
          </div>
          
          <div className="category-header">
            <h1 className="category-title">
              {currentCategory.name} {selectedMeatCut ? `- ${meatCutLabel}` : ''}
            </h1>
            {currentCategory.description && (
              <p className="category-description">{currentCategory.description}</p>
            )}
          </div>
          
          <div className="product-controls">
            <div className="category-search-wrapper" style={{ width: '300px' }}>
              <input
                type="text"
                placeholder="Search categories"
                value={searchQuery}
                onChange={handleSearchChange}
                className="category-search-input"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="clear-search-btn" 
                  onClick={clearSearch}
                >
                  ✕
                </button>
              )}
            </div>
            
            <div className="sort-control">
              <label htmlFor="sort-select">
                <FaSortAmountDown /> Category:
              </label>
              <select 
                id="sort-select" 
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="sort-select"
              >
                {availableCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
                <option value="discount">Discounted Items</option>
              </select>
            </div>
          </div>
          
          <div className="products-info">
            <p className="product-count-info">
              Showing {currentItems.length} of {filteredProducts.length} products
            </p>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="no-products-found">
              <p>No products found matching your selection. Try different filter options.</p>
              <button className="reset-button" onClick={resetFilters}>Reset All Filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {currentItems.map(product => (
                <div 
                  className={`product-card ${shouldHighlightProduct(product) ? 'highlight' : ''}`} 
                  key={product.id}
                >
                  <div className="product-image">
                    {product.discount > 0 && (
                      <div className="discount-badge">
                        {product.discount}% OFF
                      </div>
                    )}
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                      }}
                    />
                    <button className="add-to-cart-btn">+</button>
                  </div>
                  <div className="product-details">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-specs">
                      {product.weight && <span>{product.weight}</span>}
                      {product.pieces && <span>{product.pieces} {product.pieces === 1 ? 'Piece' : 'Pieces'}</span>}
                      {product.serves && <span>Serves: {product.serves}</span>}
                    </div>
                    {product.meatCut && (
                      <div className="meat-cut-label">
                        <span className={`meat-cut-tag ${product.meatCut}`}>
                          {product.meatCut === 'jc-jatka' ? 'JC Jatka' : 'Halal Cut'}
                        </span>
                      </div>
                    )}
                    <div className="product-price">
                      <span className="current-price">₹{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original-price">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <div className="delivery-info">
                      {product.deliveryTime && (
                        <span>Delivered in {product.deliveryTime} mins</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredProducts.length > itemsPerPage && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} 
                className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                disabled={currentPage === 1}
              >
                <FaArrowLeft />
              </button>
              
              {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button 
                onClick={() => paginate(currentPage < Math.ceil(filteredProducts.length / itemsPerPage) ? currentPage + 1 : Math.ceil(filteredProducts.length / itemsPerPage))} 
                className={`pagination-btn ${currentPage === Math.ceil(filteredProducts.length / itemsPerPage) ? 'disabled' : ''}`}
                disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
              >
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="container">
        <div className="breadcrumb-navigation">
          <Link to="/" className="home-link">
            <span>Home</span>
            <FaArrowRight className="breadcrumb-arrow" />
          </Link>
          <span className="current-page">Categories</span>
        </div>
        
        <h1 className="page-title">Shop by Categories</h1>
        <p className="page-subtitle"></p>
        
        <div className="product-controls">
          <div className="category-search-wrapper" style={{ width: '300px' }}>
            <input
              type="text"
              placeholder="Search categories"
              value={searchQuery}
              onChange={handleSearchChange}
              className="category-search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn" 
                onClick={clearSearch}
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="sort-control">
            <label htmlFor="sort-select">
              <FaSortAmountDown /> Category:
            </label>
            <select 
              id="sort-select" 
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="sort-select"
            >
              {availableCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value="discount">Discounted Items</option>
            </select>
          </div>
        </div>
        
        {searchQuery && (
          <p className="search-results-info">
            {filteredCategories.length === 0 
              ? `No categories found for "${searchQuery}"`
              : `Showing results for "${searchQuery}"`
            }
          </p>
        )}
        
        {filteredCategories.length === 0 && (searchQuery || selectedCategory !== 'default') ? (
          <div className="no-categories-found">
            <p>No categories match your selection. Try a different category or search term.</p>
            <button className="show-all-btn" onClick={() => {
              clearSearch();
              setSelectedCategory('default');
              localStorage.removeItem('selectedCategory');
            }}>
              Show All Categories
            </button>
          </div>
        ) : (
          <div className="categories-grid">
            {filteredCategories.map((category, index) => {
              const categoryId = category.id || category.firebaseKey || `category-${index}`;
              return (
                <Link 
                  to={`/category/${categoryId}`}
                  className="category-card"
                  key={categoryId}
                  state={{ categoryData: category }}
                >
                  <div className="category-image">
                    <img 
                      src={preloadImage(category.image)} 
                      alt={category.name}
                      onError={(e) => {
                        console.error('Failed to load image:', category.image);
                        e.target.src = 'https://via.placeholder.com/300x180?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  <div className="category-details">
                    <h2 className="category-name">{category.name || 'Category'}</h2>
                    {/* <p className="category-description">{category.description || 'Explore our products'}</p> */}
                    <div className="category-footer">
                      {/* <span className="product-count">{category.productCount || 0} products</span> */}
                      <span className="view-link">
                        View All <FaArrowRight />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;