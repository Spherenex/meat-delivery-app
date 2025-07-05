// import React, { useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { CartContext } from '../context/CartContext';
// import { ref, push } from 'firebase/database';
// import { auth } from '../firebase/config';
// import { onAuthStateChanged } from 'firebase/auth';
// import { db } from '../firebase/config';
// import '../styles/pages/Checkout.css';
// import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaMoneyBill } from 'react-icons/fa';
// import Login from '../pages/Login';

// const Checkout = () => {
//   console.log("Checkout component rendering");
//   console.log("Firebase db instance:", db);

//   const { cart, total, clearCart } = useContext(CartContext);
//   const navigate = useNavigate();
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loadingAuth, setLoadingAuth] = useState(true);
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [deliveryDistance, setDeliveryDistance] = useState(0); // in km
//   const [deliveryFee, setDeliveryFee] = useState(0);

//   // Form state
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     pincode: '',
//     paymentMethod: 'cod'
//   });

//   // Validation state
//   const [errors, setErrors] = useState({});

//   // Order summary calculations
//   const cartTotal = total || 0;
//   const DELIVERY_RATE_PER_KM = 30; // ₹30 per km
//   const totalAmount = cartTotal + deliveryFee;

//   // Check authentication status
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setIsAuthenticated(true);
//         setFormData(prev => ({
//           ...prev,
//           fullName: user.displayName || prev.fullName,
//           email: user.email || prev.email
//         }));
//       } else {
//         setIsAuthenticated(false);
//         setIsLoginOpen(true); // Open login modal if not authenticated
//       }
//       setLoadingAuth(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Calculate delivery fee when address changes
//   useEffect(() => {
//     // This would typically involve using a geocoding service to get coordinates
//     // For now, we'll use a simple approximation based on the address length
//     if (formData.address && formData.pincode) {
//       const calculateDistance = () => {
//         // Mock distance calculation - in a real app, you would use a maps API
//         // This is just a simplified example that creates a pseudo-random distance based on address

//         // Using the pincode and address to create a predictable but varied distance
//         const addressSum = formData.address.length + parseInt(formData.pincode || '0');
//         const randomFactor = (addressSum % 7) + 1; // 1-7 km range

//         return randomFactor;
//       };

//       const distance = calculateDistance();
//       setDeliveryDistance(distance);

//       // Calculate delivery fee based on distance
//       const fee = Math.round(distance * DELIVERY_RATE_PER_KM);
//       setDeliveryFee(fee);
//     } else {
//       setDeliveryDistance(0);
//       setDeliveryFee(0);
//     }
//   }, [formData.address, formData.pincode]);

//   // Redirect to home if cart is empty
//   useEffect(() => {
//     if (cart.length === 0 && !orderPlaced) {
//       navigate('/');
//     }
//   }, [cart, navigate, orderPlaced]);

//   // Alert on page leave if checkout is incomplete
//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       if (!orderPlaced && (formData.fullName || formData.email || formData.phone || formData.address)) {
//         e.preventDefault();
//         e.returnValue = 'Your process is stopped in the middle. Would you like to continue the process?';
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [formData, orderPlaced]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     if (errors[name]) {
//       setErrors({ ...errors, [name]: null });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.fullName.trim()) {
//       newErrors.fullName = 'Name is required';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone is required';
//     } else if (!/^\d{10}$/.test(formData.phone)) {
//       newErrors.phone = 'Phone must be 10 digits';
//     }

//     if (!formData.address.trim()) {
//       newErrors.address = 'Address is required';
//     }

//     if (!formData.city.trim()) {
//       newErrors.city = 'City is required';
//     }

//     if (!formData.pincode.trim()) {
//       newErrors.pincode = 'PIN code is required';
//     } else if (!/^\d{6}$/.test(formData.pincode)) {
//       newErrors.pincode = 'PIN code must be 6 digits';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();

//     // Check if it's after 10 PM
//     const currentHour = new Date().getHours();
//     if (currentHour >= 22) { // 22 is 10 PM in 24-hour format
//       alert('Process closed for today, book order tomorrow.');
//       return;
//     }

//     if (!isAuthenticated) {
//       setIsLoginOpen(true); // Open login modal if not authenticated
//       return;
//     }

//     if (!validateForm()) {
//       return;
//     }

//     try {
//       console.log("Attempting to place order...");

//       if (!db) {
//         console.error("Firebase db is undefined!");
//         alert("There was an error with the database connection. Please try again later.");
//         return;
//       }

//       const orderData = {
//         customer: {
//           fullName: formData.fullName,
//           email: formData.email,
//           phone: formData.phone,
//           address: formData.address,
//           city: formData.city,
//           pincode: formData.pincode
//         },
//         items: cart,
//         paymentMethod: formData.paymentMethod,
//         subtotal: cartTotal,
//         deliveryDistance: deliveryDistance,
//         deliveryFee: deliveryFee,
//         totalAmount: totalAmount,
//         orderDate: new Date().toISOString(),
//         status: 'pending',
//         userId: auth.currentUser?.uid
//       };

//       console.log("Order data:", orderData);

//       const ordersRef = ref(db, 'orders');
//       console.log("Orders reference:", ordersRef);

//       const newOrderRef = await push(ordersRef, orderData);

//       if (newOrderRef.key) {
//         console.log("Order placed successfully with ID:", newOrderRef.key);
//         clearCart();
//         setOrderPlaced(true);
//       } else {
//         console.error("No order key returned");
//         alert('There was an error placing your order. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error placing order:', error);
//       alert('There was an error placing your order. Please try again.');
//     }
//   };

//   const handleBackToCart = () => {
//     if (!orderPlaced && (formData.fullName || formData.email || formData.phone || formData.address)) {
//       const confirmLeave = window.confirm('Your process is stopped in the middle. Would you like to continue the process?');
//       if (!confirmLeave) {
//         navigate('/cart');
//       }
//     } else {
//       navigate('/cart');
//     }
//   };

//   const handleLoginClose = () => {
//     setIsLoginOpen(false);
//     navigate('/cart'); // Redirect to cart if login is cancelled
//   };

//   const handleLoginSuccess = (user) => {
//     setIsAuthenticated(true);
//     setIsLoginOpen(false);
//     // Stay on checkout page after successful login
//   };

//   if (loadingAuth) {
//     return <div>Loading...</div>;
//   }

//   if (orderPlaced) {
//     return (
//       <div className="checkout-page confirmation-page">
//         <div className="confirmation-container">
//           <div className="confirmation-message">
//             <h1>Congratulations! 🎉</h1>
//             <p>Your order has been placed successfully and will be delivered in 30 to 40 minutes.</p>
//             <button className="continue-shopping-button" onClick={() => navigate('/')}>
//               Explore More
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="checkout-page">
//         <div className="checkout-container">
//           <button 
//             className="back-to-cart-button" 
//             onClick={handleBackToCart}
//           >
//             <FaArrowLeft /> Back to Cart
//           </button>

//           <h1 className="checkout-title">Checkout</h1>

//           <div className="checkout-content">
//             <div className="checkout-form-container">
//               <h2>Shipping Information</h2>

//               <form className="checkout-form" onSubmit={handlePlaceOrder}>
//                 <div className="form-group">
//                   <label htmlFor="fullName">Full Name</label>
//                   <input
//                     type="text"
//                     id="fullName"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleInputChange}
//                     className={errors.fullName ? 'error' : ''}
//                   />
//                   {errors.fullName && <span className="error-message">{errors.fullName}</span>}
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label htmlFor="email">Email</label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className={errors.email ? 'error' : ''}
//                     />
//                     {errors.email && <span className="error-message">{errors.email}</span>}
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="phone">Phone</label>
//                     <input
//                       type="tel"
//                       id="phone"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       className={errors.phone ? 'error' : ''}
//                     />
//                     {errors.phone && <span className="error-message">{errors.phone}</span>}
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="address">Address</label>
//                   <input
//                     type="text"
//                     id="address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     className={errors.address ? 'error' : ''}
//                   />
//                   {errors.address && <span className="error-message">{errors.address}</span>}
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label htmlFor="city">City</label>
//                     <input
//                       type="text"
//                       id="city"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       className={errors.city ? 'error' : ''}
//                     />
//                     {errors.city && <span className="error-message">{errors.city}</span>}
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="pincode">PIN Code</label>
//                     <input
//                       type="text"
//                       id="pincode"
//                       name="pincode"
//                       value={formData.pincode}
//                       onChange={handleInputChange}
//                       className={errors.pincode ? 'error' : ''}
//                     />
//                     {errors.pincode && <span className="error-message">{errors.pincode}</span>}
//                   </div>
//                 </div>

//                 <h2 className="payment-title">Payment Method</h2>

//                 <div className="payment-methods">
//                   <div className="payment-method">
//                     <input
//                       type="radio"
//                       id="cod"
//                       name="paymentMethod"
//                       value="cod"
//                       checked={formData.paymentMethod === 'cod'}
//                       onChange={handleInputChange}
//                     />
//                     <label htmlFor="cod">
//                       <FaMoneyBill />
//                       Cash on Delivery
//                     </label>
//                   </div>

//                   <div className="payment-method">
//                     <input
//                       type="radio"
//                       id="card"
//                       name="paymentMethod"
//                       value="card"
//                       checked={formData.paymentMethod === 'card'}
//                       onChange={handleInputChange}
//                     />
//                     <label htmlFor="card">
//                       <FaCreditCard />
//                       Credit/Debit Card
//                     </label>
//                   </div>
//                 </div>

//                 {formData.paymentMethod === 'card' && (
//                   <div className="card-details">
//                     <div className="form-group">
//                       <label htmlFor="cardNumber">Card Number</label>
//                       <input
//                         type="text"
//                         id="cardNumber"
//                         placeholder="1234 5678 9012 3456"
//                       />
//                     </div>

//                     <div className="form-row">
//                       <div className="form-group">
//                         <label htmlFor="expiryDate">Expiry Date</label>
//                         <input
//                           type="text"
//                           id="expiryDate"
//                           placeholder="MM/YY"
//                         />
//                       </div>

//                       <div className="form-group">
//                         <label htmlFor="cvv">CVV</label>
//                         <input
//                           type="text"
//                           id="cvv"
//                           placeholder="123"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <button type="submit" className="place-order-button" disabled={!isAuthenticated}>
//                   Place Order
//                 </button>
//               </form>
//             </div>

//             <div className="order-summary">
//               <h2>Order Summary</h2>

//               <div className="order-items">
//                 {cart.map(item => (
//                   <div key={item.id} className="order-item">
//                     <div className="order-item-image">
//                       <img src={item.image} alt={item.name} onError={(e) => (e.target.src = 'https://via.placeholder.com/50?text=No+Image')} />
//                       <span className="item-quantity">{item.quantity}</span>
//                     </div>
//                     <div className="order-item-details">
//                       <h3 className="order-item-name">{item.name}</h3>
//                       <p className="order-item-price">₹{item.price} x {item.quantity}</p>
//                     </div>
//                     <div className="order-item-total">
//                       ₹{item.price * item.quantity}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="order-summary-details">
//                 <div className="summary-item">
//                   <span>Subtotal</span>
//                   <span>₹{cartTotal}</span>
//                 </div>

//                 <div className="summary-item">
//                   <span>Delivery Fee ({deliveryDistance} km × ₹{DELIVERY_RATE_PER_KM})</span>
//                   <span>₹{deliveryFee}</span>
//                 </div>

//                 <div className="summary-item total">
//                   <span>Total</span>
//                   <span>₹{totalAmount}</span>
//                 </div>
//               </div>

//               <div className="delivery-info">
//                 <FaMapMarkerAlt />
//                 <p>Your order will be delivered in 30-40 minutes</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Login
//         isOpen={isLoginOpen}
//         onClose={handleLoginClose}
//         onLogin={handleLoginSuccess}
//       />
//     </>
//   );
// };

// export default Checkout;







// import React, { useState, useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { CartContext } from '../context/CartContext';
// import { ref, push } from 'firebase/database';
// import { auth } from '../firebase/config';
// import { onAuthStateChanged } from 'firebase/auth';
// import { db } from '../firebase/config';
// import '../styles/pages/Checkout.css';
// import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaMoneyBill, FaWallet } from 'react-icons/fa';
// import Login from '../pages/Login';

// // API base URL - change this if your server is running on a different port
// // const API_BASE_URL = 'http://localhost:5000';
// const API_BASE_URL = window.location.hostname === 'localhost'
//   ? 'http://localhost:5000'
//   : 'https://us-central1-zappcart-control-panel.cloudfunctions.net/paymentApi';

// const Checkout = () => {
//   console.log("Checkout component rendering");
//   console.log("Firebase db instance:", db);

//   const { cart, total, clearCart } = useContext(CartContext);
//   const navigate = useNavigate();
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loadingAuth, setLoadingAuth] = useState(true);
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [deliveryDistance, setDeliveryDistance] = useState(0); // in km
//   const [deliveryFee, setDeliveryFee] = useState(0);
//   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
//   const [orderId, setOrderId] = useState('');
//   const [serverStatus, setServerStatus] = useState(null);

//   // Form state
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     pincode: '',
//     paymentMethod: 'cod'
//   });

//   // Validation state
//   const [errors, setErrors] = useState({});

//   // Order summary calculations
//   const cartTotal = total || 0;
//   const DELIVERY_RATE_PER_KM = 30; // ₹30 per km
//   const totalAmount = cartTotal + deliveryFee;

//   // Check server health on mount
//   useEffect(() => {
//     const checkServerHealth = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/health`);
//         setServerStatus({ status: 'online', data: await response.json() });
//         console.log('Server is online');
//       } catch (error) {
//         console.error('Server health check failed:', error);
//         setServerStatus({ status: 'offline', error });
//       }
//     };

//     checkServerHealth();
//   }, []);

//   // Check authentication status
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setIsAuthenticated(true);
//         setFormData(prev => ({
//           ...prev,
//           fullName: user.displayName || prev.fullName,
//           email: user.email || prev.email
//         }));
//       } else {
//         setIsAuthenticated(false);
//         setIsLoginOpen(true); // Open login modal if not authenticated
//       }
//       setLoadingAuth(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Calculate delivery fee when address changes
//   useEffect(() => {
//     if (formData.address && formData.pincode) {
//       const calculateDistance = () => {
//         // Mock distance calculation - in a real app, you would use a maps API
//         const addressSum = formData.address.length + parseInt(formData.pincode || '0');
//         const randomFactor = (addressSum % 7) + 1; // 1-7 km range

//         return randomFactor;
//       };

//       const distance = calculateDistance();
//       setDeliveryDistance(distance);

//       // Calculate delivery fee based on distance
//       const fee = Math.round(distance * DELIVERY_RATE_PER_KM);
//       setDeliveryFee(fee);
//     } else {
//       setDeliveryDistance(0);
//       setDeliveryFee(0);
//     }
//   }, [formData.address, formData.pincode]);

//   // Redirect to home if cart is empty
//   useEffect(() => {
//     if (cart.length === 0 && !orderPlaced) {
//       navigate('/');
//     }
//   }, [cart, navigate, orderPlaced]);

//   // Alert on page leave if checkout is incomplete
//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       if (!orderPlaced && (formData.fullName || formData.email || formData.phone || formData.address)) {
//         e.preventDefault();
//         e.returnValue = 'Your process is stopped in the middle. Would you like to continue the process?';
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [formData, orderPlaced]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // Special handling for phone field - restrict to numbers only
//     if (name === 'phone') {
//       // Remove any non-digit characters
//       const digitsOnly = value.replace(/\D/g, '');
//       // Limit to 10 digits
//       const truncated = digitsOnly.substring(0, 10);
//       setFormData({ ...formData, [name]: truncated });
//     }
//     // Regular handling for other fields
//     else {
//       setFormData({ ...formData, [name]: value });
//     }

//     // Clear error for this field
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: null });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Name validation - required and format check
//     if (!formData.fullName.trim()) {
//       newErrors.fullName = 'Name is required';
//     } else if (/[^a-zA-Z0-9\s]/.test(formData.fullName)) {
//       // Check for special characters that might cause issues with payment gateway
//       newErrors.fullName = 'Name should not contain special characters';
//     }

//     // Email validation - required and format check
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     // Phone validation - required and MUST be exactly 10 digits for Easebuzz
//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone is required';
//     } else if (!/^\d{10}$/.test(formData.phone)) {
//       newErrors.phone = 'Phone must be exactly 10 digits';
//     }

//     // Address validation
//     if (!formData.address.trim()) {
//       newErrors.address = 'Address is required';
//     }

//     // City validation
//     if (!formData.city.trim()) {
//       newErrors.city = 'City is required';
//     }

//     // PIN code validation
//     if (!formData.pincode.trim()) {
//       newErrors.pincode = 'PIN code is required';
//     } else if (!/^\d{6}$/.test(formData.pincode)) {
//       newErrors.pincode = 'PIN code must be 6 digits';
//     }

//     // Set errors and return validation result
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };


//   // Create order in Firebase
//   const createOrder = async (paymentStatus = 'pending') => {
//     try {
//       if (!db) {
//         console.error("Firebase db is undefined!");
//         throw new Error("Database connection error");
//       }

//       const orderData = {
//         customer: {
//           fullName: formData.fullName,
//           email: formData.email,
//           phone: formData.phone,
//           address: formData.address,
//           city: formData.city,
//           pincode: formData.pincode
//         },
//         items: cart,
//         paymentMethod: formData.paymentMethod,
//         subtotal: cartTotal,
//         deliveryDistance: deliveryDistance,
//         deliveryFee: deliveryFee,
//         totalAmount: totalAmount,
//         orderDate: new Date().toISOString(),
//         status: paymentStatus,
//         userId: auth.currentUser?.uid
//       };

//       console.log("Order data:", orderData);

//       const ordersRef = ref(db, 'orders');
//       const newOrderRef = await push(ordersRef, orderData);

//       return newOrderRef.key;
//     } catch (error) {
//       console.error('Error creating order:', error);
//       throw error;
//     }
//   };

//   // Add this at the beginning of your Checkout component
//   useEffect(() => {
//     // Handle the beforeunload event
//     const handleBeforeUnload = (e) => {
//       // Only show warning if not a form submission
//       const forms = document.querySelectorAll('form');
//       const isFormSubmitted = Array.from(forms).some(form => form.dataset.formSubmitted === 'true');

//       if (!orderPlaced && !isFormSubmitted && (formData.fullName || formData.email || formData.phone || formData.address)) {
//         e.preventDefault();
//         e.returnValue = 'Your process is stopped in the middle. Would you like to continue the process?';
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [formData, orderPlaced]);
//   // Update this function in your Checkout.js file

//   const initiateEasebuzzPayment = async (orderKey) => {
//     try {
//       setIsProcessingPayment(true);

//       // Format values as needed
//       const formattedAmount = parseFloat(totalAmount).toFixed(2);
//       const formattedName = formData.fullName.trim();
//       const formattedEmail = formData.email.trim();
//       const formattedPhone = formData.phone.trim();
//       const productInfo = "Test Product";

//       // Create payment data
//       const paymentData = {
//         amount: formattedAmount,
//         name: formattedName,
//         email: formattedEmail,
//         phone: formattedPhone,
//         productInfo: productInfo,
//         orderId: orderKey
//       };

//       // Call server API - note the URL path differences between local and production
//       const apiEndpoint = window.location.hostname === 'localhost'
//         ? `${API_BASE_URL}/api/initiate-payment`
//         : `${API_BASE_URL}/api/initiate-payment`;

//       const response = await fetch(apiEndpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(paymentData)
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("API Error:", response.status, errorText);
//         throw new Error(`Payment API error: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Payment response:", data);

//       if (data.status !== 1 || !data.data) {
//         throw new Error(data.msg || 'Payment initialization failed');
//       }

//       // Create form
//       const form = document.createElement('form');
//       form.method = 'POST';
//       form.action = 'https://testpay.easebuzz.in/pay/secure';
//       form.style.display = 'none';

//       // Add all fields
//       Object.entries(data.data).forEach(([key, value]) => {
//         const input = document.createElement('input');
//         input.type = 'hidden';
//         input.name = key;
//         input.value = value;
//         form.appendChild(input);
//       });

//       // IMPORTANT: Add this to prevent unsaved changes warning
//       window.onbeforeunload = null;

//       // ALSO: Mark form as being submitted to prevent warnings
//       const existingForms = document.querySelectorAll('form');
//       existingForms.forEach(existingForm => {
//         existingForm.dataset.formSubmitted = 'true';
//       });

//       // Append form to document and submit
//       document.body.appendChild(form);
//       console.log("Submitting form to Easebuzz...");
//       form.submit();
//     } catch (error) {
//       console.error("Payment error:", error);
//       alert('Payment processing failed: ' + error.message);
//       setIsProcessingPayment(false);
//     }
//   };

//   const handlePlaceOrder = async (e) => {
//     e.preventDefault();
//     e.target.dataset.formSubmitted = 'true';
//     // Check if it's after 10 PM
//     const currentHour = new Date().getHours();
//     if (currentHour >= 22) {
//       alert('Process closed for today, book order tomorrow.');
//       return;
//     }

//     if (!isAuthenticated) {
//       setIsLoginOpen(true);
//       return;
//     }

//     // Validate form - enhanced validation
//     if (!validateForm()) {
//       // Scroll to the first error
//       const firstErrorField = Object.keys(errors)[0];
//       if (firstErrorField) {
//         document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth' });
//       }
//       return;
//     }

//     try {
//       console.log("Placing order with payment method:", formData.paymentMethod);

//       if (formData.paymentMethod === 'cod') {
//         // For COD, create the order and mark it as pending
//         const orderKey = await createOrder('pending');
//         if (orderKey) {
//           console.log("Order placed successfully with ID:", orderKey);
//           clearCart();
//           setOrderPlaced(true);
//         }
//       } else if (formData.paymentMethod === 'easebuzz') {
//         // For Easebuzz payment, check server status first
//         if (serverStatus?.status !== 'online') {
//           alert('Payment server is currently unavailable. Please try again later or choose Cash on Delivery.');
//           return;
//         }

//         // Create order first, then initiate payment
//         const orderKey = await createOrder('payment-pending');
//         if (orderKey) {
//           console.log("Order created with ID:", orderKey);
//           setOrderId(orderKey);
//           await initiateEasebuzzPayment(orderKey);
//         }
//       }
//     } catch (error) {
//       console.error('Error processing order:', error);
//       alert('There was an error placing your order: ' + error.message);
//     }
//   };

//   const handleBackToCart = () => {
//     if (!orderPlaced && (formData.fullName || formData.email || formData.phone || formData.address)) {
//       const confirmLeave = window.confirm('Your process is stopped in the middle. Would you like to continue the process?');
//       if (!confirmLeave) {
//         navigate('/cart');
//       }
//     } else {
//       navigate('/cart');
//     }
//   };

//   const handleLoginClose = () => {
//     setIsLoginOpen(false);
//     navigate('/cart'); // Redirect to cart if login is cancelled
//   };

//   const handleLoginSuccess = (user) => {
//     setIsAuthenticated(true);
//     setIsLoginOpen(false);
//     // Stay on checkout page after successful login
//   };

//   if (loadingAuth) {
//     return <div>Loading...</div>;
//   }

//   if (orderPlaced) {
//     return (
//       <div className="checkout-page confirmation-page">
//         <div className="confirmation-container">
//           <div className="confirmation-message">
//             <h1>Congratulations! 🎉</h1>
//             <p>Your order has been placed successfully and will be delivered in 30 to 40 minutes.</p>
//             <button className="continue-shopping-button" onClick={() => navigate('/')}>
//               Explore More
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isProcessingPayment) {
//     return (
//       <div className="checkout-page confirmation-page">
//         <div className="confirmation-container">
//           <div className="confirmation-message">
//             <h1>Processing Payment...</h1>
//             <p>Please wait while we redirect you to the payment gateway.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="checkout-page">
//         <div className="checkout-container">
//           <button
//             className="back-to-cart-button"
//             onClick={handleBackToCart}
//           >
//             <FaArrowLeft /> Back to Cart
//           </button>

//           <h1 className="checkout-title">Checkout</h1>

//           <div className="checkout-content">
//             <div className="checkout-form-container">
//               <h2>Shipping Information</h2>

//               <form className="checkout-form" onSubmit={handlePlaceOrder}>
//                 <div className="form-group">
//                   <label htmlFor="fullName">Full Name</label>
//                   <input
//                     type="text"
//                     id="fullName"
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleInputChange}
//                     className={errors.fullName ? 'error' : ''}
//                   />
//                   {errors.fullName && <span className="error-message">{errors.fullName}</span>}
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label htmlFor="email">Email</label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       className={errors.email ? 'error' : ''}
//                     />
//                     {errors.email && <span className="error-message">{errors.email}</span>}
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="phone">Phone</label>
//                     <input
//                       type="tel"
//                       id="phone"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       className={errors.phone ? 'error' : ''}
//                     />
//                     {errors.phone && <span className="error-message">{errors.phone}</span>}
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="address">Address</label>
//                   <input
//                     type="text"
//                     id="address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     className={errors.address ? 'error' : ''}
//                   />
//                   {errors.address && <span className="error-message">{errors.address}</span>}
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label htmlFor="city">City</label>
//                     <input
//                       type="text"
//                       id="city"
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       className={errors.city ? 'error' : ''}
//                     />
//                     {errors.city && <span className="error-message">{errors.city}</span>}
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="pincode">PIN Code</label>
//                     <input
//                       type="text"
//                       id="pincode"
//                       name="pincode"
//                       value={formData.pincode}
//                       onChange={handleInputChange}
//                       className={errors.pincode ? 'error' : ''}
//                     />
//                     {errors.pincode && <span className="error-message">{errors.pincode}</span>}
//                   </div>
//                 </div>

//                 <h2 className="payment-title">Payment Method</h2>

//                 <div className="payment-methods">
//                   <div className="payment-method">
//                     <input
//                       type="radio"
//                       id="cod"
//                       name="paymentMethod"
//                       value="cod"
//                       checked={formData.paymentMethod === 'cod'}
//                       onChange={handleInputChange}
//                     />
//                     <label htmlFor="cod">
//                       <FaMoneyBill />
//                       Cash on Delivery
//                     </label>
//                   </div>

//                   <div className={`payment-method ${serverStatus?.status !== 'online' ? 'disabled' : ''}`}>
//                     <input
//                       type="radio"
//                       id="easebuzz"
//                       name="paymentMethod"
//                       value="easebuzz"
//                       checked={formData.paymentMethod === 'easebuzz'}
//                       onChange={handleInputChange}
//                       disabled={serverStatus?.status !== 'online'}
//                     />
//                     <label htmlFor="easebuzz">
//                       <FaWallet />
//                       Online Payment (Card, UPI, Wallet, etc.)
//                       {serverStatus?.status !== 'online' && (
//                         <span className="payment-server-status">
//                           (Payment server is currently unavailable)
//                         </span>
//                       )}
//                     </label>
//                   </div>
//                 </div>

//                 <button type="submit" className="place-order-button" disabled={!isAuthenticated}>
//                   Place Order
//                 </button>

//               </form>
//             </div>

//             <div className="order-summary">
//               <h2>Order Summary</h2>

//               <div className="order-items">
//                 {cart.map(item => (
//                   <div key={item.id} className="order-item">
//                     <div className="order-item-image">
//                       <img src={item.image} alt={item.name} onError={(e) => (e.target.src = 'https://via.placeholder.com/50?text=No+Image')} />
//                       <span className="item-quantity">{item.quantity}</span>
//                     </div>
//                     <div className="order-item-details">
//                       <h3 className="order-item-name">{item.name}</h3>
//                       <p className="order-item-price">₹{item.price} x {item.quantity}</p>
//                     </div>
//                     <div className="order-item-total">
//                       ₹{item.price * item.quantity}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="order-summary-details">
//                 <div className="summary-item">
//                   <span>Subtotal</span>
//                   <span>₹{cartTotal}</span>
//                 </div>

//                 <div className="summary-item">
//                   <span>Delivery Fee ({deliveryDistance} km × ₹{DELIVERY_RATE_PER_KM})</span>
//                   <span>₹{deliveryFee}</span>
//                 </div>

//                 <div className="summary-item total">
//                   <span>Total</span>
//                   <span>₹{totalAmount}</span>
//                 </div>
//               </div>

//               <div className="delivery-info">
//                 <FaMapMarkerAlt />
//                 <p>Your order will be delivered in 30-40 minutes</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Login
//         isOpen={isLoginOpen}
//         onClose={handleLoginClose}
//         onLogin={handleLoginSuccess}
//       />
//     </>
//   );
// };

// export default Checkout;








import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { ref, push } from 'firebase/database';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/config';
import '../styles/pages/Checkout.css';
import { FaArrowLeft, FaMapMarkerAlt, FaCreditCard, FaMoneyBill, FaWallet } from 'react-icons/fa';
import Login from '../pages/Login';

// API base URL - change this if your server is running on a different port
// const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5002'
  : 'https://us-central1-zappcart-control-panel.cloudfunctions.net/paymentApi';

const Checkout = () => {
  console.log("Checkout component rendering");
  console.log("Firebase db instance:", db);

  const { cart, total, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [deliveryDistance, setDeliveryDistance] = useState(0); // in km
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [serverStatus, setServerStatus] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Order summary calculations
  const cartTotal = total || 0;
  const DELIVERY_RATE_PER_KM = 30; // ₹30 per km
  const totalAmount = cartTotal + deliveryFee;

  // Check server health on mount
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        setServerStatus({ status: 'online', data: await response.json() });
        console.log('Server is online');
      } catch (error) {
        console.error('Server health check failed:', error);
        setServerStatus({ status: 'offline', error });
      }
    };

    checkServerHealth();
  }, []);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setFormData(prev => ({
          ...prev,
          fullName: user.displayName || prev.fullName,
          email: user.email || prev.email
        }));
      } else {
        setIsAuthenticated(false);
        setIsLoginOpen(true); // Open login modal if not authenticated
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Calculate delivery fee when address changes
  useEffect(() => {
    if (formData.address && formData.pincode) {
      const calculateDistance = () => {
        // Mock distance calculation - in a real app, you would use a maps API
        const addressSum = formData.address.length + parseInt(formData.pincode || '0');
        const randomFactor = (addressSum % 7) + 1; // 1-7 km range

        return randomFactor;
      };

      const distance = calculateDistance();
      setDeliveryDistance(distance);

      // Calculate delivery fee based on distance
      const fee = Math.round(distance * DELIVERY_RATE_PER_KM);
      setDeliveryFee(fee);
    } else {
      setDeliveryDistance(0);
      setDeliveryFee(0);
    }
  }, [formData.address, formData.pincode]);

  // Redirect to home if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate('/');
    }
  }, [cart, navigate, orderPlaced]);

  // REMOVED: beforeunload event handlers that caused "Leave site?" alerts

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone field - restrict to numbers only
    if (name === 'phone') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      // Limit to 10 digits
      const truncated = digitsOnly.substring(0, 10);
      setFormData({ ...formData, [name]: truncated });
    }
    // Regular handling for other fields
    else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation - required and format check
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    } else if (/[^a-zA-Z0-9\s]/.test(formData.fullName)) {
      // Check for special characters that might cause issues with payment gateway
      newErrors.fullName = 'Name should not contain special characters';
    }

    // Email validation - required and format check
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Phone validation - required and MUST be exactly 10 digits for Easebuzz
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // PIN code validation
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'PIN code is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'PIN code must be 6 digits';
    }

    // Set errors and return validation result
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Create order in Firebase
  const createOrder = async (paymentStatus = 'pending') => {
    try {
      if (!db) {
        console.error("Firebase db is undefined!");
        throw new Error("Database connection error");
      }

      const orderData = {
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode
        },
        items: cart,
        paymentMethod: formData.paymentMethod,
        subtotal: cartTotal,
        deliveryDistance: deliveryDistance,
        deliveryFee: deliveryFee,
        totalAmount: totalAmount,
        orderDate: new Date().toISOString(),
        status: paymentStatus,
        userId: auth.currentUser?.uid
      };

      console.log("Order data:", orderData);

      const ordersRef = ref(db, 'orders');
      const newOrderRef = await push(ordersRef, orderData);

      return newOrderRef.key;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const initiateEasebuzzPayment = async (orderKey) => {
    try {
      setIsProcessingPayment(true);

      // Format values as needed
      const formattedAmount = parseFloat(totalAmount).toFixed(2);
      const formattedName = formData.fullName.trim();
      const formattedEmail = formData.email.trim();
      const formattedPhone = formData.phone.trim();
      const productInfo = "Test Product";

      // Create payment data
      const paymentData = {
        amount: formattedAmount,
        name: formattedName,
        email: formattedEmail,
        phone: formattedPhone,
        productInfo: productInfo,
        orderId: orderKey
      };

      // Call server API - note the URL path differences between local and production
      const apiEndpoint = window.location.hostname === 'localhost'
        ? `${API_BASE_URL}/api/initiate-payment`
        : `${API_BASE_URL}/api/initiate-payment`;

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`Payment API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Payment response:", data);

      if (data.status !== 1 || !data.data) {
        throw new Error(data.msg || 'Payment initialization failed');
      }

      // Create form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://testpay.easebuzz.in/pay/secure';
      form.style.display = 'none';

      // Add all fields
      Object.entries(data.data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      // IMPORTANT: Disable unload warning when submitting to payment gateway
      window.onbeforeunload = null;

      // Mark form as being submitted
      const existingForms = document.querySelectorAll('form');
      existingForms.forEach(existingForm => {
        existingForm.dataset.formSubmitted = 'true';
      });

      // Append form to document and submit
      document.body.appendChild(form);
      console.log("Submitting form to Easebuzz...");
      form.submit();
    } catch (error) {
      console.error("Payment error:", error);
      alert('Payment processing failed: ' + error.message);
      setIsProcessingPayment(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    e.target.dataset.formSubmitted = 'true';
    // Check if it's after 10 PM
    const currentHour = new Date().getHours();
    if (currentHour >= 22) {
      alert('Process closed for today, book order tomorrow.');
      return;
    }

    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }

    // Validate form - enhanced validation
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    try {
      console.log("Placing order with payment method:", formData.paymentMethod);

      if (formData.paymentMethod === 'cod') {
        // For COD, create the order and mark it as pending
        const orderKey = await createOrder('pending');
        if (orderKey) {
          console.log("Order placed successfully with ID:", orderKey);
          clearCart();
          setOrderPlaced(true);
        }
      } else if (formData.paymentMethod === 'easebuzz') {
        // For Easebuzz payment, check server status first
        if (serverStatus?.status !== 'online') {
          alert('Payment server is currently unavailable. Please try again later or choose Cash on Delivery.');
          return;
        }

        // Create order first, then initiate payment
        const orderKey = await createOrder('payment-pending');
        if (orderKey) {
          console.log("Order created with ID:", orderKey);
          setOrderId(orderKey);
          await initiateEasebuzzPayment(orderKey);
        }
      }
    } catch (error) {
      console.error('Error processing order:', error);
      alert('There was an error placing your order: ' + error.message);
    }
  };

  const handleBackToCart = () => {
    // Instead of using a generic "leave site" warning, use a more specific message
    // for the back button that only appears if the form has meaningful data
    const hasFilledImportantFields = formData.fullName || formData.address || formData.phone;
    
    if (hasFilledImportantFields && !orderPlaced) {
      const confirmLeave = window.confirm('You have unsaved checkout information. Are you sure you want to return to your cart?');
      if (!confirmLeave) {
        return; // Stay on checkout page
      }
    }
    
    navigate('/cart');
  };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
    navigate('/cart'); // Redirect to cart if login is cancelled
  };

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setIsLoginOpen(false);
    // Stay on checkout page after successful login
  };

  if (loadingAuth) {
    return <div>Loading...</div>;
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page confirmation-page">
        <div className="confirmation-container">
          <div className="confirmation-message">
            <h1>Congratulations! 🎉</h1>
            <p>Your order has been placed successfully and will be delivered in 30 to 40 minutes.</p>
            <button className="continue-shopping-button" onClick={() => navigate('/')}>
              Explore More
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessingPayment) {
    return (
      <div className="checkout-page confirmation-page">
        <div className="confirmation-container">
          <div className="confirmation-message">
            <h1>Processing Payment...</h1>
            <p>Please wait while we redirect you to the payment gateway.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="checkout-page">
        <div className="checkout-container">
          <button
            className="back-to-cart-button"
            onClick={handleBackToCart}
          >
            <FaArrowLeft /> Back to Cart
          </button>

          <h1 className="checkout-title">Checkout</h1>

          <div className="checkout-content">
            <div className="checkout-form-container">
              <h2>Shipping Information</h2>

              <form className="checkout-form" onSubmit={handlePlaceOrder}>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode">PIN Code</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={errors.pincode ? 'error' : ''}
                    />
                    {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                  </div>
                </div>

                <h2 className="payment-title">Payment Method</h2>

                <div className="payment-methods">
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="cod">
                      <FaMoneyBill />
                      Cash on Delivery
                    </label>
                  </div>

                  <div className={`payment-method ${serverStatus?.status !== 'online' ? 'disabled' : ''}`}>
                    <input
                      type="radio"
                      id="easebuzz"
                      name="paymentMethod"
                      value="easebuzz"
                      checked={formData.paymentMethod === 'easebuzz'}
                      onChange={handleInputChange}
                      disabled={serverStatus?.status !== 'online'}
                    />
                    <label htmlFor="easebuzz">
                      <FaWallet />
                      Online Payment (Card, UPI, Wallet, etc.)
                      {serverStatus?.status !== 'online' && (
                        <span className="payment-server-status">
                          (Payment server is currently unavailable)
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                <button type="submit" className="place-order-button" disabled={!isAuthenticated}>
                  Place Order
                </button>

              </form>
            </div>

            <div className="order-summary">
              <h2>Order Summary</h2>

              <div className="order-items">
                {cart.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="order-item-image">
                      <img src={item.image} alt={item.name} onError={(e) => (e.target.src = 'https://via.placeholder.com/50?text=No+Image')} />
                      <span className="item-quantity">{item.quantity}</span>
                    </div>
                    <div className="order-item-details">
                      <h3 className="order-item-name">{item.name}</h3>
                      <p className="order-item-price">₹{item.price} x {item.quantity}</p>
                    </div>
                    <div className="order-item-total">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary-details">
                <div className="summary-item">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>

                <div className="summary-item">
                  <span>Delivery Fee ({deliveryDistance} km × ₹{DELIVERY_RATE_PER_KM})</span>
                  <span>₹{deliveryFee}</span>
                </div>

                <div className="summary-item total">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <div className="delivery-info">
                <FaMapMarkerAlt />
                <p>Your order will be delivered in 30-40 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Login
        isOpen={isLoginOpen}
        onClose={handleLoginClose}
        onLogin={handleLoginSuccess}
      />
    </>
  );
};

export default Checkout;