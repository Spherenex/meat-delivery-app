// // src/pages/ProductDetail.js
// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { CartContext } from '../context/CartContext';
// import { db } from '../firebase/config';
// import { doc, getDoc } from 'firebase/firestore';
// import '../styles/pages/ProductDetail.css';
// import { FaArrowLeft, FaClock, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';

// const ProductDetail = () => {
//   const { id } = useParams();
//   const { addToCart } = useContext(CartContext);
  
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState('description');
  
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         // Simulate API call with mock data
//         // In a real app, you'd fetch from Firebase
//         setTimeout(() => {
//           const mockProduct = {
//             id: 'chicken-curry-cut-small',
//             name: 'Chicken Curry Cut - Small Pieces',
//             image: 'https://t3.ftcdn.net/jpg/08/47/55/46/360_F_847554699_5QdX4XsvKyjMt1KjHAUPJ3y9Z3lhfin2.jpg',
//             weight: '500 g',
//             pieces: '12-18 Pieces',
//             serves: 4,
//             price: 160,
//             originalPrice: 195,
//             discount: 18,
//             deliveryTime: 30,
//             description: 'Our classic curry cut chicken is a mix of bone-in, small pieces of breast, wing (without the tip), leg, and thigh meat. These smaller cuts cook faster, work well with most curries and are a perfect addition to biryanis. Our Chicken Curry cuts are cleaned thoroughly and contain more meat and less bones.',
//             nutritionalInfo: {
//               calories: '215 kcal',
//               protein: '18.5g',
//               fat: '15.7g',
//               carbohydrates: '0g'
//             },
//             cookingInstructions: [
//               'Wash the curry cut pieces thoroughly.',
//               'Marinate with salt, turmeric, chili powder, ginger-garlic paste for at least 30 minutes.',
//               'Sauté onions, add spices and tomatoes.',
//               'Add the marinated chicken and cook for 25-30 minutes until tender.',
//               'Garnish with coriander and serve hot with rice or roti.'
//             ],
//             relatedProducts: [
//               {
//                 id: 'chicken-breast-boneless',
//                 name: 'Chicken Breast - Boneless',
//                 image: 'https://t3.ftcdn.net/jpg/08/47/55/46/360_F_847554699_5QdX4XsvKyjMt1KjHAUPJ3y9Z3lhfin2.jpg',
//                 price: 252
//               },
//               {
//                 id: 'chicken-boneless-mini-bites',
//                 name: 'Chicken Boneless - Mini Bites',
//                 image: 'https://t3.ftcdn.net/jpg/08/47/55/46/360_F_847554699_5QdX4XsvKyjMt1KjHAUPJ3y9Z3lhfin2.jpg',
//                 price: 176
//               },
//               {
//                 id: 'premium-chicken-thigh-boneless',
//                 name: 'Premium Chicken Thigh - Boneless',
//                 image: 'https://t3.ftcdn.net/jpg/08/47/55/46/360_F_847554699_5QdX4XsvKyjMt1KjHAUPJ3y9Z3lhfin2.jpg',
//                 price: 268
//               }
//             ]
//           };
          
//           setProduct(mockProduct);
//           setLoading(false);
//         }, 1000);
        
//         // In a real app, you'd use code like this:
//         /*
//         const productRef = doc(db, 'products', id);
//         const productSnap = await getDoc(productRef);
        
//         if (productSnap.exists()) {
//           setProduct({
//             id: productSnap.id,
//             ...productSnap.data()
//           });
//         } else {
//           console.error('Product not found');
//         }
//         setLoading(false);
//         */
//       } catch (error) {
//         console.error('Error fetching product:', error);
//         setLoading(false);
//       }
//     };
    
//     fetchProduct();
//     // Reset quantity when product changes
//     setQuantity(1);
//     // Scroll to top when component mounts
//     window.scrollTo(0, 0);
//   }, [id]);
  
//   const handleQuantityChange = (newQuantity) => {
//     if (newQuantity >= 1) {
//       setQuantity(newQuantity);
//     }
//   };
  
//   const handleAddToCart = () => {
//     if (product) {
//       // Add quantity to product object
//       const productToAdd = { ...product, quantity };
//       addToCart(productToAdd);
      
//       // Show success message (in a real app, you'd have a proper toast notification)
//       alert(`${quantity} ${product.name} added to cart!`);
//     }
//   };
  
//   if (loading) {
//     return (
//       <div className="product-detail-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading product details...</p>
//       </div>
//     );
//   }
  
//   if (!product) {
//     return (
//       <div className="product-not-found">
//         <h2>Product Not Found</h2>
//         <p>Sorry, the product you're looking for doesn't exist.</p>
//         <Link to="/" className="back-to-home">
//           Back to Home
//         </Link>
//       </div>
//     );
//   }
  
//   return (
//     <div className="product-detail-page">
//       <div className="product-detail-container">
//         <Link to="/" className="back-button">
//           <FaArrowLeft /> Back to Products
//         </Link>
        
//         <div className="product-detail">
//           <div className="product-image-container">
//             <img src={product.image} alt={product.name} className="product-detail-image" />
//           </div>
          
//           <div className="product-info-container">
//             <h1 className="product-detail-title">{product.name}</h1>
            
//             <div className="product-detail-specs">
//               {product.weight && <span>{product.weight}</span>}
//               {product.pieces && <span>{product.pieces}</span>}
//               {product.serves && <span>Serves {product.serves}</span>}
//             </div>
            
//             <div className="product-detail-price">
//               <span className="current-price">₹{product.price}</span>
//               {product.originalPrice && (
//                 <>
//                   <span className="original-price">₹{product.originalPrice}</span>
//                   <span className="discount">{product.discount}% off</span>
//                 </>
//               )}
//             </div>
            
//             <div className="delivery-estimate">
//               <FaClock />
//               <span>Delivered in {product.deliveryTime} minutes</span>
//             </div>
            
//             <div className="quantity-selector">
//               <span className="quantity-label">Quantity:</span>
//               <div className="quantity-controls">
//                 <button 
//                   className="quantity-button" 
//                   onClick={() => handleQuantityChange(quantity - 1)}
//                   disabled={quantity <= 1}
//                 >
//                   <FaMinus />
//                 </button>
//                 <span className="quantity-value">{quantity}</span>
//                 <button 
//                   className="quantity-button" 
//                   onClick={() => handleQuantityChange(quantity + 1)}
//                 >
//                   <FaPlus />
//                 </button>
//               </div>
//             </div>
            
//             <button className="add-to-cart-button" onClick={handleAddToCart}>
//               <FaShoppingCart />
//               Add to Cart - ₹{product.price * quantity}
//             </button>
            
//             <div className="product-tabs">
//               <div className="tab-buttons">
//                 <button 
//                   className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
//                   onClick={() => setActiveTab('description')}
//                 >
//                   Description
//                 </button>
//                 <button 
//                   className={`tab-button ${activeTab === 'nutrition' ? 'active' : ''}`}
//                   onClick={() => setActiveTab('nutrition')}
//                 >
//                   Nutritional Info
//                 </button>
//                 <button 
//                   className={`tab-button ${activeTab === 'cooking' ? 'active' : ''}`}
//                   onClick={() => setActiveTab('cooking')}
//                 >
//                   Cooking Instructions
//                 </button>
//               </div>
              
//               <div className="tab-content">
//                 {activeTab === 'description' && (
//                   <div className="description-tab">
//                     <p>{product.description}</p>
//                   </div>
//                 )}
                
//                 {activeTab === 'nutrition' && (
//                   <div className="nutrition-tab">
//                     <h3>Nutritional Information (per 100g)</h3>
//                     <ul className="nutrition-list">
//                       <li><strong>Calories:</strong> {product.nutritionalInfo.calories}</li>
//                       <li><strong>Protein:</strong> {product.nutritionalInfo.protein}</li>
//                       <li><strong>Fat:</strong> {product.nutritionalInfo.fat}</li>
//                       <li><strong>Carbohydrates:</strong> {product.nutritionalInfo.carbohydrates}</li>
//                     </ul>
//                   </div>
//                 )}
                
//                 {activeTab === 'cooking' && (
//                   <div className="cooking-tab">
//                     <h3>Cooking Instructions</h3>
//                     <ol className="cooking-steps">
//                       {product.cookingInstructions.map((step, index) => (
//                         <li key={index}>{step}</li>
//                       ))}
//                     </ol>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="related-products">
//           <h2>You might also like</h2>
//           <div className="related-products-grid">
//             {product.relatedProducts.map(relatedProduct => (
//               <Link 
//                 to={`/product/${relatedProduct.id}`} 
//                 className="related-product-card"
//                 key={relatedProduct.id}
//               >
//                 <div className="related-product-image">
//                   <img src={relatedProduct.image} alt={relatedProduct.name} />
//                 </div>
//                 <div className="related-product-info">
//                   <h3 className="related-product-title">{relatedProduct.name}</h3>
//                   <p className="related-product-price">₹{relatedProduct.price}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;

// src/pages/ProductDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/pages/ProductDetail.css';
import { FaArrowLeft, FaClock, FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Simulate API call with mock data
        // In a real app, you'd fetch from Firebase
        setTimeout(() => {
          // Product catalog with all products organized by categories
          const productCatalog = {
            'chicken': [
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
                category: 'chicken',
                description: 'Our classic curry cut chicken is a mix of bone-in, small pieces of breast, wing (without the tip), leg, and thigh meat. These smaller cuts cook faster, work well with most curries and are a perfect addition to biryanis. Our Chicken Curry cuts are cleaned thoroughly and contain more meat and less bones.',
                nutritionalInfo: {
                  calories: '215 kcal',
                  protein: '18.5g',
                  fat: '15.7g',
                  carbohydrates: '0g'
                },
                cookingInstructions: [
                  'Wash the curry cut pieces thoroughly.',
                  'Marinate with salt, turmeric, chili powder, ginger-garlic paste for at least 30 minutes.',
                  'Sauté onions, add spices and tomatoes.',
                  'Add the marinated chicken and cook for 25-30 minutes until tender.',
                  'Garnish with coriander and serve hot with rice or roti.'
                ]
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
                category: 'chicken',
                description: 'Premium boneless chicken breast cuts that are perfect for grilling, stir-fries, or making cutlets. Our chicken breast pieces are lean, tender, and versatile - ideal for health-conscious cooking.',
                nutritionalInfo: {
                  calories: '165 kcal',
                  protein: '31g',
                  fat: '3.6g',
                  carbohydrates: '0g'
                },
                cookingInstructions: [
                  'Pat dry the chicken breast pieces with a paper towel.',
                  'Season with salt, pepper, and your choice of herbs.',
                  'Grill or pan-fry for 5-6 minutes on each side until internal temperature reaches 165°F.',
                  'Let rest for 5 minutes before serving to retain juices.'
                ]
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
                category: 'chicken',
                description: 'Small, bite-sized boneless chicken pieces that are perfect for quick cooking. Ideal for stir-fries, appetizers, and kids meals. These mini bites are tender and absorb flavors quickly.',
                nutritionalInfo: {
                  calories: '180 kcal',
                  protein: '25g',
                  fat: '8g',
                  carbohydrates: '0g'
                },
                cookingInstructions: [
                  'Marinate the mini bites with your choice of seasonings for 15-20 minutes.',
                  'Heat oil in a pan on high heat.',
                  'Stir-fry the bites for 6-8 minutes until golden brown and cooked through.',
                  'Add sauces or garnishes in the last minute of cooking.'
                ]
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
                category: 'chicken',
                description: 'Our family-sized pack of curry cut chicken pieces. Perfect for large gatherings or meal prep. Contains the same great quality as our regular curry cuts but in double quantity.',
                nutritionalInfo: {
                  calories: '215 kcal',
                  protein: '18.5g',
                  fat: '15.7g',
                  carbohydrates: '0g'
                },
                cookingInstructions: [
                  'Wash the curry cut pieces thoroughly.',
                  'Marinate with salt, turmeric, chili powder, ginger-garlic paste for at least 30 minutes.',
                  'In a large pot, sauté onions, add spices and tomatoes.',
                  'Add the marinated chicken and cook for 25-30 minutes until tender.',
                  'Garnish with coriander and serve hot.'
                ]
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
                category: 'chicken',
                description: 'Juicy, tender boneless chicken thighs that are perfect for grilling or slow cooking. These flavorful cuts remain tender and moist through various cooking methods.',
                nutritionalInfo: {
                  calories: '209 kcal',
                  protein: '26g',
                  fat: '10.9g',
                  carbohydrates: '0g'
                },
                cookingInstructions: [
                  'Marinate the thigh pieces with your choice of herbs and spices for at least 1 hour.',
                  'Preheat oven to 375°F or prepare grill on medium-high heat.',
                  'Cook for 20-25 minutes, flipping halfway through, until internal temperature reaches 165°F.',
                  'Let rest for 5 minutes before serving.'
                ]
              }
            ],
            'mutton': [
              {
                id: 'mutton-curry-cut',
                name: 'Premium Mutton Curry Cut',
                image: 'https://www.thespruceeats.com/thmb/AsHVWEq5JaotXjMIvrs1wKU8WaM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/JMTalbott-466838246c734494b30bcf47b633e116.jpg',
                weight: '450 g',
                pieces: '5-10 Pieces',
                serves: 3,
                price: 368,
                originalPrice: 435,
                discount: 20,
                deliveryTime: 30,
                category: 'mutton',
                description: 'Premium quality bone-in mutton pieces perfect for curries, biryanis, and slow-cooked dishes. Each piece is carefully cut for even cooking and maximum flavor.',
                nutritionalInfo: {
                  calories: '294 kcal',
                  protein: '25.6g',
                  fat: '21g',
                  carbohydrates: '0g'
                },
                cookingInstructions: [
                  'Wash the mutton pieces and pat dry.',
                  'Marinate with yogurt, salt, turmeric, and spices for at least 2 hours or overnight.',
                  'Pressure cook for 3-4 whistles or until tender.',
                  'Prepare curry base with onions, tomatoes and spices, then add cooked mutton.',
                  'Simmer for 10-15 minutes before serving.'
                ]
              },
              {
                id: 'mutton-boneless',
                name: 'Premium Mutton Boneless',
                image: 'https://www.thespruceeats.com/thmb/AsHVWEq5JaotXjMIvrs1wKU8WaM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/JMTalbott-466838246c734494b30bcf47b633e116.jpg',
                weight: '500 g',
                pieces: '8-12 Pieces',
                serves: 4,
                price: 425,
                originalPrice: 500,
                discount: 15,
                deliveryTime: 35,
                category: 'mutton',
                description: 'Tender, boneless mutton cuts that are perfect for kebabs, curries, and stir-fries. These premium cuts cook more quickly than bone-in pieces while retaining their rich flavor.',
                nutritionalInfo: {
                  calories: '276 kcal',
                  protein: '27g',
                  fat: '18g',
                  carbohydrates: '0g'
                },
                cookingInstructions: [
                  'Cut boneless mutton into desired sizes if needed.',
                  'Marinate with spices, herbs, and oil for at least 1-2 hours.',
                  'For kebabs: Thread onto skewers and grill for 12-15 minutes, turning occasionally.',
                  'For curry: Sear the pieces first, then simmer in sauce for 30-40 minutes until tender.'
                ]
              },
              {
                id: 'mutton-keema',
                name: 'Fresh Mutton Keema (Minced)',
                image: 'https://www.thespruceeats.com/thmb/AsHVWEq5JaotXjMIvrs1wKU8WaM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/JMTalbott-466838246c734494b30bcf47b633e116.jpg',
                weight: '400 g',
                pieces: 'N/A',
                serves: 4,
                price: 399,
                originalPrice: 450,
                discount: 11,
                deliveryTime: 30,
                category: 'mutton',
                description: 'Freshly minced mutton that is perfect for making keema curries, meatballs, kebabs, and stuffed dishes. Our keema is prepared from premium cuts with the perfect lean-to-fat ratio.',
                nutritionalInfo: {
                  calories: '282 kcal',
                  protein: '24g',
                  fat: '20g',
                  carbohydrates: '0g'
                },
                cookingInstructions: [
                  'Heat oil and sauté onions, ginger-garlic paste until golden brown.',
                  'Add the minced mutton and cook on high heat for 5 minutes, breaking up any lumps.',
                  'Add spices, tomatoes and cook on medium heat for 15-20 minutes.',
                  'Add peas or other vegetables if desired in the last 5 minutes of cooking.'
                ]
              }
            ],
            'seafood': [
              {
                id: 'fish-rohu',
                name: 'Premium Fish - Rohu',
                image: 'https://media.istockphoto.com/id/1126131932/photo/selection-of-aminal-protein-sources-on-wood-background.jpg?s=612x612&w=0&k=20&c=u1bGJpQnn2jrJgJLldXOa5mAMSnF2oFU3ZhwHBxgOmk=',
                weight: '450 g',
                pieces: '1-3 Pieces',
                serves: 3,
                price: 308,
                originalPrice: 355,
                discount: 13,
                deliveryTime: 30,
                category: 'seafood',
                description: 'Fresh Rohu fish cuts, perfect for curries and frying. Known for its tender texture and mild flavor, Rohu is a freshwater fish that is a staple in many Indian households.',
                nutritionalInfo: {
                  calories: '170 kcal',
                  protein: '19g',
                  fat: '10g',
                  carbohydrates: '0g'
                },
                cookingInstructions: [
                  'Clean the fish pieces thoroughly and pat dry.',
                  'Marinate with turmeric, salt, and lemon juice for 10 minutes.',
                  'For frying: Coat with spiced rice flour or semolina and shallow fry for 4-5 minutes per side.',
                  'For curry: Prepare gravy with onions, tomatoes, spices, and gently simmer fish for 8-10 minutes.'
                ]
              },
              {
                id: 'prawns-medium',
                name: 'Premium Prawns - Medium',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRerUmuD5XXr10HFnp_awnfhkjaEu2G_Q2pSQ&s',
                weight: '250 g',
                pieces: '15-20 Pieces',
                serves: 3,
                price: 250,
                originalPrice: 300,
                discount: 17,
                deliveryTime: 30,
                category: 'seafood',
                description: 'Medium-sized, deveined prawns that are ready to cook. Perfect for curries, stir-fries, and grilling. Our prawns are cleaned and processed with utmost care to maintain freshness.',
                nutritionalInfo: {
                  calories: '99 kcal',
                  protein: '20.3g',
                  fat: '1.7g',
                  carbohydrates: '0g'
                },
                cookingInstructions: [
                  'Rinse prawns under cold water and pat dry.',
                  'Marinate with desired spices, herbs, and a bit of oil for 15 minutes.',
                  'Heat pan on high heat and cook prawns for 2-3 minutes per side until they turn pink.',
                  'Be careful not to overcook as prawns can become rubbery.'
                ]
              },
              {
                id: 'pomfret-whole',
                name: 'Silver Pomfret - Whole',
                image: 'https://media.istockphoto.com/id/1126131932/photo/selection-of-aminal-protein-sources-on-wood-background.jpg?s=612x612&w=0&k=20&c=u1bGJpQnn2jrJgJLldXOa5mAMSnF2oFU3ZhwHBxgOmk=',
                weight: '300 g',
                pieces: '1 Piece',
                serves: 2,
                price: 399,
                originalPrice: 450,
                discount: 11,
                deliveryTime: 35,
                category: 'seafood',
                description: 'Whole Silver Pomfret, cleaned and ready to cook. This premium fish is known for its delicate flavor and soft texture, making it perfect for frying, grilling, or steaming.',
                nutritionalInfo: {
                  calories: '144 kcal',
                  protein: '18.8g',
                  fat: '7.6g',
                  carbohydrates: '0g'
                },
                cookingInstructions: [
                  'Clean the fish thoroughly if not already cleaned.',
                  'Make 3-4 diagonal slits on each side of the fish.',
                  'Marinate with salt, turmeric, and lemon juice for 10 minutes.',
                  'For frying: Coat with spiced flour and shallow fry for 5-6 minutes on each side.',
                  'For grilling: Brush with oil and grill for 6-8 minutes on each side.'
                ]
              }
            ]
          };
          
          // Find the product in our catalog based on id
          let foundProduct = null;
          for (const category in productCatalog) {
            const foundInCategory = productCatalog[category].find(p => p.id === id);
            if (foundInCategory) {
              foundProduct = foundInCategory;
              // Find related products from the same category
              foundProduct.relatedProducts = productCatalog[category]
                .filter(p => p.id !== id)
                .slice(0, 3)
                .map(p => ({
                  id: p.id,
                  name: p.name,
                  image: p.image,
                  price: p.price,
                  category: p.category
                }));
              break;
            }
          }
          
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            console.error('Product not found');
          }
          
          setLoading(false);
        }, 1000);
        
        // In a real app, you'd use code like this:
        /*
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const productData = {
            id: productSnap.id,
            ...productSnap.data()
          };
          
          // Get related products from the same category
          const categoryRef = collection(db, 'products');
          const q = query(
            categoryRef, 
            where('category', '==', productData.category),
            where('id', '!=', productData.id),
            limit(3)
          );
          
          const relatedQuerySnapshot = await getDocs(q);
          const relatedProducts = relatedQuerySnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            image: doc.data().image,
            price: doc.data().price,
            category: doc.data().category
          }));
          
          productData.relatedProducts = relatedProducts;
          setProduct(productData);
        } else {
          console.error('Product not found');
        }
        setLoading(false);
        */
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    
    fetchProduct();
    // Reset quantity when product changes
    setQuantity(1);
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      // Add quantity to product object
      const productToAdd = { ...product, quantity };
      addToCart(productToAdd);
      
      // Show success message (in a real app, you'd have a proper toast notification)
      alert(`${quantity} ${product.name} added to cart!`);
    }
  };
  
  // Function to handle category navigation
  const handleCategoryClick = (category) => {
    navigate(`/?category=${category}`);
  };
  
  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>Sorry, the product you're looking for doesn't exist.</p>
        <Link to="/" className="back-to-home">
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="navigation-buttons">
          <Link to="/" className="back-button">
            <FaArrowLeft /> Back to Products
          </Link>
          
          {product.category && (
            <button 
              className="view-category-button"
              onClick={() => handleCategoryClick(product.category)}
            >
              View All {product.category.charAt(0).toUpperCase() + product.category.slice(1)} Products
            </button>
          )}
        </div>
        
        <div className="product-detail">
          <div className="product-image-container">
            <img src={product.image} alt={product.name} className="product-detail-image" />
            {product.category && (
              <div className="product-category-tag">{product.category}</div>
            )}
          </div>
          
          <div className="product-info-container">
            <h1 className="product-detail-title">{product.name}</h1>
            
            <div className="product-detail-specs">
              {product.weight && <span>{product.weight}</span>}
              {product.pieces && <span>{product.pieces}</span>}
              {product.serves && <span>Serves {product.serves}</span>}
            </div>
            
            <div className="product-detail-price">
              <span className="current-price">₹{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="original-price">₹{product.originalPrice}</span>
                  <span className="discount">{product.discount}% off</span>
                </>
              )}
            </div>
            
            <div className="delivery-estimate">
              <FaClock />
              <span>Delivered in {product.deliveryTime} minutes</span>
            </div>
            
            <div className="quantity-selector">
              <span className="quantity-label">Quantity:</span>
              <div className="quantity-controls">
                <button 
                  className="quantity-button" 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-button" 
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            
            <button className="add-to-cart-button" onClick={handleAddToCart}>
              <FaShoppingCart />
              Add to Cart - ₹{product.price * quantity}
            </button>
            
            <div className="product-tabs">
              <div className="tab-buttons">
                <button 
                  className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button 
                  className={`tab-button ${activeTab === 'nutrition' ? 'active' : ''}`}
                  onClick={() => setActiveTab('nutrition')}
                >
                  Nutritional Info
                </button>
                <button 
                  className={`tab-button ${activeTab === 'cooking' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cooking')}
                >
                  Cooking Instructions
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'description' && (
                  <div className="description-tab">
                    <p>{product.description}</p>
                  </div>
                )}
                
                {activeTab === 'nutrition' && (
                  <div className="nutrition-tab">
                    <h3>Nutritional Information (per 100g)</h3>
                    <ul className="nutrition-list">
                      <li><strong>Calories:</strong> {product.nutritionalInfo.calories}</li>
                      <li><strong>Protein:</strong> {product.nutritionalInfo.protein}</li>
                      <li><strong>Fat:</strong> {product.nutritionalInfo.fat}</li>
                      <li><strong>Carbohydrates:</strong> {product.nutritionalInfo.carbohydrates}</li>
                    </ul>
                  </div>
                )}
                
                {activeTab === 'cooking' && (
                  <div className="cooking-tab">
                    <h3>Cooking Instructions</h3>
                    <ol className="cooking-steps">
                      {product.cookingInstructions.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="related-products">
          <h2>You might also like</h2>
          {product.relatedProducts && product.relatedProducts.length > 0 ? (
            <div className="related-products-grid">
              {product.relatedProducts.map(relatedProduct => (
                <Link 
                  to={`/product/${relatedProduct.id}`} 
                  className="related-product-card"
                  key={relatedProduct.id}
                >
                  <div className="related-product-image">
                    <img src={relatedProduct.image} alt={relatedProduct.name} />
                  </div>
                  <div className="related-product-info">
                    <h3 className="related-product-title">{relatedProduct.name}</h3>
                    <p className="related-product-price">₹{relatedProduct.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="no-related-products">No related products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;