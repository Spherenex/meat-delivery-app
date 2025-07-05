// // src/context/CartContext.js
// import React, { createContext, useState, useEffect } from 'react';
// import { db } from '../firebase/config';
// import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [total, setTotal] = useState(0);
  
//   // Load cart from local storage
//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart');
//     if (savedCart) {
//       setCart(JSON.parse(savedCart));
//     }
//   }, []);
  
//   // Save cart to local storage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cart));
//     calculateTotal();
//   }, [cart]);
  
//   // Calculate total price
//   const calculateTotal = () => {
//     const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     setTotal(totalPrice);
//   };
  
//   // Add item to cart
//   const addToCart = (product) => {
//     const existingItem = cart.find(item => item.id === product.id);
    
//     if (existingItem) {
//       setCart(cart.map(item => 
//         item.id === product.id 
//           ? { ...item, quantity: item.quantity + 1 } 
//           : item
//       ));
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
//   };
  
//   // Remove item from cart
//   const removeFromCart = (productId) => {
//     setCart(cart.filter(item => item.id !== productId));
//   };
  
//   // Update item quantity
//   const updateQuantity = (productId, quantity) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//     } else {
//       setCart(cart.map(item => 
//         item.id === productId 
//           ? { ...item, quantity } 
//           : item
//       ));
//     }
//   };
  
//   // Clear cart
//   const clearCart = () => {
//     setCart([]);
//   };
  
//   // Save order to Firebase
//   const saveOrder = async (customerInfo) => {
//     try {
//       const order = {
//         items: cart,
//         totalAmount: total,
//         customer: customerInfo,
//         orderDate: new Date().toISOString(),
//         status: 'pending'
//       };
      
//       const docRef = await addDoc(collection(db, 'orders'), order);
//       clearCart();
//       return docRef.id;
//     } catch (error) {
//       console.error('Error saving order: ', error);
//       return null;
//     }
//   };
  
//   return (
//     <CartContext.Provider value={{ 
//       cart, 
//       total, 
//       addToCart, 
//       removeFromCart, 
//       updateQuantity, 
//       clearCart,
//       saveOrder
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, total, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};