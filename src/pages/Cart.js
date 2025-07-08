




// import React, { useContext, useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { CartContext } from '../context/CartContext';
// import '../styles/pages/Cart.css';
// import { FaShoppingCart, FaArrowLeft, FaMinus, FaPlus, FaTrash, FaHistory, FaHeadset, FaTimes, FaPaperPlane } from 'react-icons/fa';
// import { db, auth } from '../firebase/config';
// import { ref, onValue, push, set, query, orderByChild, equalTo } from 'firebase/database';
// import { onAuthStateChanged } from 'firebase/auth';

// const Cart = () => {
//   const { cart, total, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
//   const navigate = useNavigate();
//   const [couponCode, setCouponCode] = useState('');
//   const [couponApplied, setCouponApplied] = useState(false);
//   const [discount, setDiscount] = useState(0);
//   const [previousOrders, setPreviousOrders] = useState([]);
//   const [showPreviousOrders, setShowPreviousOrders] = useState(false);
//   const [isLoadingOrders, setIsLoadingOrders] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);

//   // Help Center states
//   const [activeHelpOrder, setActiveHelpOrder] = useState(null);
//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [customerNote, setCustomerNote] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   const cartTotal = total || 0;
//   // Removed tax calculation
//   const totalAmount = cartTotal - discount;

//   // Track current user authentication state
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Common issues and solutions for meat delivery
//   const helpIssues = [
//     {
//       id: 1,
//       title: "Order Delayed",
//       solution: "We're sorry for the delay. Our standard delivery time is 30-40 minutes, but sometimes delays occur due to high demand or weather conditions. If your order is more than 20 minutes past the estimated delivery time, you'll receive a partial refund automatically. If it's been over an hour, please contact our customer service for immediate assistance."
//     },
//     {
//       id: 2,
//       title: "Quality Issues with Meat",
//       solution: "We prioritize freshness and quality. If you've received meat that doesn't meet our quality standards (unusual smell, discoloration, or incorrect cut), please take a photo before cooking and contact us within 24 hours of delivery. We'll arrange for a replacement or refund. All our meat undergoes rigorous quality checks before dispatch."
//     },
//     {
//       id: 3,
//       title: "Incorrect Items Delivered",
//       solution: "We apologize for the mix-up. Please check your order confirmation against what you received. If there are missing or incorrect items, please let us know within 6 hours of delivery. We'll arrange for the correct items to be delivered on priority or provide a refund for the incorrect items."
//     },
//     {
//       id: 4,
//       title: "Canceled Order But Still Charged",
//       solution: "If you canceled your order but were still charged, don't worry. Refunds for canceled orders typically take 5-7 business days to reflect in your account. If it's been longer than 7 days, please provide your order number and payment details, and our team will expedite the refund process."
//     },
//     {
//       id: 5,
//       title: "Need Help with Returns/Refunds",
//       solution: "For perishable items like meat, we don't accept returns, but we do provide refunds for quality issues. If you're unsatisfied with your order, please contact us within 24 hours of delivery with photos if possible. Refunds are processed within 3-5 business days and will be credited to your original payment method or as store credit, depending on your preference."
//     }
//   ];

//   // Fetch previous orders from Firebase - only for the current user
//   useEffect(() => {
//     // Only proceed if we have a current user
//     if (!currentUser) {
//       setPreviousOrders([]);
//       setIsLoadingOrders(false);
//       return;
//     }

//     const ordersRef = ref(db, 'orders');

//     // Listen for changes to the orders collection
//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       setIsLoadingOrders(true);
//       if (snapshot.exists()) {
//         const ordersData = [];
//         snapshot.forEach((childSnapshot) => {
//           const orderId = childSnapshot.key;
//           const orderData = childSnapshot.val();

//           // Only include orders for the current user
//           if (orderData.customer && 
//               (orderData.customer.userId === currentUser.uid || 
//                orderData.customer.email === currentUser.email)) {
//             ordersData.push({ id: orderId, ...orderData });
//           }
//         });

//         // Sort orders by date (newest first)
//         ordersData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
//         setPreviousOrders(ordersData);
//       } else {
//         setPreviousOrders([]);
//       }
//       setIsLoadingOrders(false);
//     }, (error) => {
//       console.error('Error fetching orders:', error);
//       setIsLoadingOrders(false);
//     });

//     // Clean up listener on component unmount
//     return () => unsubscribe();
//   }, [currentUser]); // Depend on currentUser so it reruns when user logs in/out

//   // Helper function to get status color
//   const getStatusColor = (status) => {
//     switch(status?.toLowerCase()) {
//       case 'pending':
//         return '#f39c12'; // Orange
//       case 'processing':
//         return '#3498db'; // Blue
//       case 'shipped':
//         return '#9b59b6'; // Purple
//       case 'delivered':
//         return '#2ecc71'; // Green
//       case 'cancelled':
//         return '#e74c3c'; // Red
//       default:
//         return '#95a5a6'; // Gray (default)
//     }
//   };

//   // Helper function to get status icon based on order status
//   const getStatusIcon = (status) => {
//     switch(status?.toLowerCase()) {
//       case 'pending':
//         return '⏱️'; // Clock
//       case 'processing':
//         return '🔄'; // Processing
//       case 'shipped':
//         return '🚚'; // Truck
//       case 'delivered':
//         return '✅'; // Checkmark
//       case 'cancelled':
//         return '❌'; // X mark
//       default:
//         return '📦'; // Package (default)
//     }
//   };

//   const handleQuantityChange = (productId, newQuantity) => {
//     updateQuantity(productId, newQuantity);
//   };

//   const handleRemoveItem = (productId) => {
//     removeFromCart(productId);
//   };

//   const handleCouponApply = () => {
//     if (couponCode.toUpperCase() === 'FRESH20' && !couponApplied) {
//       const discountAmount = Math.round(cartTotal * 0.2); // 20% discount
//       setDiscount(discountAmount);
//       setCouponApplied(true);
//       alert('Coupon applied successfully!');
//     } else if (couponApplied) {
//       alert('Coupon already applied!');
//     } else {
//       alert('Invalid coupon code!');
//     }
//   };

//   const handleCheckout = () => {
//     // Proceed directly to checkout without login check
//     navigate('/checkout');
//   };

//   const togglePreviousOrders = () => {
//     setShowPreviousOrders(!showPreviousOrders);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Help Center Functions
//   const openHelpCenter = (order) => {
//     setActiveHelpOrder(order);
//     setSelectedIssue(null);
//     setCustomerNote('');
//     setSubmitSuccess(false);
//   };

//   const closeHelpCenter = () => {
//     setActiveHelpOrder(null);
//     setSelectedIssue(null);
//     setCustomerNote('');
//     setSubmitSuccess(false);
//   };

//   const selectIssue = (issue) => {
//     setSelectedIssue(issue);
//   };

//   const handleNoteChange = (e) => {
//     setCustomerNote(e.target.value);
//   };

//   const submitHelpRequest = async () => {
//     if (!activeHelpOrder) return;

//     setIsSubmitting(true);

//     try {
//       // Create a reference to the help requests collection
//       const helpRef = ref(db, 'help');
//       const newHelpRef = push(helpRef);

//       // Get customer information if available (from order)
//       const customerInfo = activeHelpOrder.customer || {};

//       // Prepare data to save
//       const helpData = {
//         orderId: activeHelpOrder.id,
//         orderDate: activeHelpOrder.orderDate,
//         issueType: selectedIssue ? selectedIssue.title : 'General Inquiry',
//         customerNote: customerNote.trim(),
//         submittedAt: new Date().toISOString(),
//         status: 'open', // open, in-progress, resolved
//         items: activeHelpOrder.items || [],
//         customer: {
//           userId: currentUser ? currentUser.uid : null,
//           fullName: customerInfo.fullName || 'Anonymous Customer',
//           email: customerInfo.email || (currentUser ? currentUser.email : ''),
//           phone: customerInfo.phone || '',
//           address: customerInfo.address || ''
//         },
//         adminResponses: [] // Initialize empty array for admin responses
//       };

//       // Save to Firebase
//       await set(newHelpRef, helpData);

//       // Show success message
//       setSubmitSuccess(true);

//       // Reset form after a short delay
//       setTimeout(() => {
//         setSelectedIssue(null);
//         setCustomerNote('');
//       }, 2000);

//     } catch (error) {
//       console.error('Error submitting help request:', error);
//       alert('Failed to submit your request. Please try again later.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Render Help Center
//   const renderHelpCenter = () => {
//     if (!activeHelpOrder) return null;

//     return (
//       <div className="help-center-overlay">
//         <div className="help-center-container">
//           <div className="help-center-header">
//             <h3>Help Center</h3>
//             <button className="close-help-button" onClick={closeHelpCenter}>
//               <FaTimes />
//             </button>
//           </div>

//           <div className="help-center-order-info">
//             <p>Order #{activeHelpOrder.id}</p>
//             <p>Ordered on: {formatDate(activeHelpOrder.orderDate)}</p>
//             <div className="order-status-badge" style={{ backgroundColor: getStatusColor(activeHelpOrder.status) }}>
//               {getStatusIcon(activeHelpOrder.status)} {activeHelpOrder.status || 'Processing'}
//             </div>
//           </div>

//           {submitSuccess ? (
//             <div className="help-success-message">
//               <h4>Thank you for reaching out!</h4>
//               <p>Your request has been submitted successfully. Our team will get back to you within 24 hours.</p>
//               <button className="close-help-button-success" onClick={closeHelpCenter}>
//                 Close
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="help-center-question">
//                 <h4>What issue are you facing?</h4>

//                 <div className="help-issues-list">
//                   {helpIssues.map(issue => (
//                     <div 
//                       key={issue.id} 
//                       className={`help-issue-item ${selectedIssue && selectedIssue.id === issue.id ? 'selected' : ''}`}
//                       onClick={() => selectIssue(issue)}
//                     >
//                       {issue.title}
//                     </div>
//                   ))}
//                 </div>

//                 {selectedIssue && (
//                   <div className="help-solution">
//                     <h5>{selectedIssue.title}</h5>
//                     <p>{selectedIssue.solution}</p>
//                   </div>
//                 )}

//                 <div className="help-note-section">
//                   <h4>Add a note (optional)</h4>
//                   <textarea
//                     className="help-note-input"
//                     placeholder="Describe your issue in detail or add any specific information..."
//                     value={customerNote}
//                     onChange={handleNoteChange}
//                     rows={4}
//                   ></textarea>

//                   <button 
//                     className="submit-help-button"
//                     onClick={submitHelpRequest}
//                     disabled={isSubmitting || (!selectedIssue && !customerNote.trim())}
//                   >
//                     {isSubmitting ? 'Submitting...' : 'Submit Request'} <FaPaperPlane />
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Render previous orders section
//   const renderPreviousOrders = () => {
//     if (isLoadingOrders) {
//       return <div className="loading-orders">Loading your previous orders...</div>;
//     }

//     if (!currentUser) {
//       return <div className="no-previous-orders">Please sign in to view your order history.</div>;
//     }

//     if (previousOrders.length === 0) {
//       return <div className="no-previous-orders">You don't have any previous orders.</div>;
//     }

//     return (
//       <div className="previous-orders-list">
//         {previousOrders.map((order) => (
//           <div key={order.id} className="previous-order-item">
//             <div className="previous-order-header">
//               <div className="previous-order-info">
//                 <h4>Order #{order.id}</h4>
//                 <span className="previous-order-date">{formatDate(order.orderDate)}</span>
//               </div>
//               <div className="previous-order-total">
//                 ₹{order.totalAmount}
//               </div>
//             </div>

//             {/* Order Status Badge */}
//             <div className="order-status-container">
//               <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
//                 {getStatusIcon(order.status)} {order.status || 'Processing'}
//               </div>
//               {order.paymentMethod && (
//                 <div className="payment-method">
//                   Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
//                 </div>
//               )}
//             </div>

//             <div className="previous-order-items">
//               {order.items && order.items.map((item, index) => (
//                 <div key={index} className="previous-order-item-detail">
//                   <span className="previous-item-name">{item.name} × {item.quantity}</span>
//                   <span className="previous-item-price">₹{item.price * item.quantity}</span>
//                 </div>
//               ))}
//             </div>

//             <button 
//               className="help-center-button"
//               onClick={() => openHelpCenter(order)}
//             >
//               <FaHeadset /> Help Center
//             </button>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (!cart || cart.length === 0) {
//     return (
//       <div className="empty-cart">
//         <div className="empty-cart-container">
//           <div className="empty-cart-icon">
//             <FaShoppingCart />
//           </div>
//           <h2>Your cart is empty</h2>
//           <p>Looks like you haven't added anything to your cart yet.</p>
//           <Link to="/" className="continue-shopping-button">
//             Start Shopping
//           </Link>

//           {/* Display previous orders even when cart is empty */}
//           <div className="previous-orders-section">
//             <button 
//               className="toggle-previous-orders-button"
//               onClick={togglePreviousOrders}
//             >
//               <FaHistory /> {showPreviousOrders ? 'Hide Previous Orders' : 'View Previous Orders'}
//             </button>

//             {showPreviousOrders && renderPreviousOrders()}
//           </div>
//         </div>

//         {/* Render Help Center if active */}
//         {renderHelpCenter()}
//       </div>
//     );
//   }

//   return (
//     <div className="cart-page">
//       <div className="cart-container">
//         <div className="cart-header">
//           <Link to="/" className="back-to-shopping">
//             <FaArrowLeft /> Continue Shopping
//           </Link>
//           <h1>Your Cart ({cart.length} items)</h1>
//         </div>

//         <div className="cart-content">
//           <div className="cart-items">
//             {cart.map(item => (
//               <div key={item.id} className="cart-item">
//                 <div className="cart-item-image">
//                   <img src={item.image} alt={item.name} onError={(e) => (e.target.src = 'https://via.placeholder.com/100?text=No+Image')} />
//                 </div>

//                 <div className="cart-item-details">
//                   <h3 className="cart-item-name">{item.name}</h3>

//                   <div className="cart-item-specs">
//                     {item.weight && <span>{item.weight}</span>}
//                     {item.pieces && <span>{item.pieces}</span>}
//                   </div>

//                   <div className="cart-item-price">
//                     <span className="current-price">₹{item.price}</span>
//                     {item.originalPrice > item.price && (
//                       <>
//                         <span className="original-price">₹{item.originalPrice}</span>
//                         <span className="discount">{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off</span>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 <div className="cart-item-quantity">
//                   <div className="quantity-controls">
//                     <button 
//                       className="quantity-button" 
//                       onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
//                       disabled={item.quantity <= 1}
//                     >
//                       <FaMinus />
//                     </button>
//                     <span className="quantity-value">{item.quantity}</span>
//                     <button 
//                       className="quantity-button" 
//                       onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
//                     >
//                       <FaPlus />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="cart-item-subtotal">
//                   ₹{item.price * item.quantity}
//                 </div>

//                 <button 
//                   className="remove-item-button" 
//                   onClick={() => handleRemoveItem(item.id)}
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             ))}

//             <button className="clear-cart-button" onClick={clearCart}>
//               Clear Cart
//             </button>
//           </div>

//           <div className="cart-summary">
//             <h2>Order Summary</h2>

//             <div className="coupon-code">
//               <input
//                 type="text"
//                 placeholder="Enter coupon code"
//                 value={couponCode}
//                 onChange={(e) => setCouponCode(e.target.value)}
//                 disabled={couponApplied}
//               />
//               <button 
//                 className="apply-coupon-button"
//                 onClick={handleCouponApply}
//                 disabled={couponApplied || !couponCode}
//               >
//                 Apply
//               </button>
//             </div>

//             {couponApplied && (
//               <div className="applied-coupon">
//                 <span className="coupon-badge">FRESH20</span>
//                 <span className="coupon-info">20% discount applied</span>
//               </div>
//             )}

//             <div className="summary-item">
//               <span>Subtotal</span>
//               <span>₹{cartTotal}</span>
//             </div>

//             {discount > 0 && (
//               <div className="summary-item discount">
//                 <span>Discount</span>
//                 <span>-₹{discount}</span>
//               </div>
//             )}

//             <div className="summary-item total">
//               <span>Total</span>
//               <span>₹{totalAmount}</span>
//             </div>

//             <button className="checkout-button" onClick={handleCheckout}>
//               Proceed to Checkout
//             </button>

//             <div className="delivery-note">
//               <p>Delivery within 30-40 minutes</p>
//             </div>
//           </div>
//         </div>

//         {/* Previous Orders Section */}
//         <div className="previous-orders-section">
//           <button 
//             className="toggle-previous-orders-button"
//             onClick={togglePreviousOrders}
//           >
//             <FaHistory /> {showPreviousOrders ? 'Hide Previous Orders' : 'View Previous Orders'}
//           </button>

//           {showPreviousOrders && renderPreviousOrders()}
//         </div>
//       </div>

//       {/* Render Help Center if active */}
//       {renderHelpCenter()}
//     </div>
//   );
// };

// export default Cart;



// import React, { useContext, useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { CartContext } from '../context/CartContext';
// import '../styles/pages/Cart.css';
// import { FaShoppingCart, FaArrowLeft, FaMinus, FaPlus, FaTrash, FaHistory, FaHeadset, FaTimes, FaPaperPlane } from 'react-icons/fa';
// import { db, auth } from '../firebase/config';
// import { ref, onValue, push, set, query, orderByChild, equalTo, get } from 'firebase/database';
// import { onAuthStateChanged } from 'firebase/auth';

// const Cart = () => {
//   const { cart, total, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
//   const navigate = useNavigate();
//   const [couponCode, setCouponCode] = useState('');
//   const [couponApplied, setCouponApplied] = useState(false);
//   const [discount, setDiscount] = useState(0);
//   const [previousOrders, setPreviousOrders] = useState([]);
//   const [showPreviousOrders, setShowPreviousOrders] = useState(false);
//   const [isLoadingOrders, setIsLoadingOrders] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);

//   // Help Center states
//   const [activeHelpOrder, setActiveHelpOrder] = useState(null);
//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [customerNote, setCustomerNote] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [helpTickets, setHelpTickets] = useState({});
//   const [ticketDetails, setTicketDetails] = useState(null);
//   const [loadingTicket, setLoadingTicket] = useState(false);

//   const cartTotal = total || 0;
//   // Removed tax calculation
//   const totalAmount = cartTotal - discount;

//   // Add at the beginning of your component
//   useEffect(() => {
//     // Check if we need to force refresh orders
//     const forceRefresh = localStorage.getItem('forceRefreshCart');
//     if (forceRefresh === 'true') {
//       console.log('Forcing refresh of orders due to recent payment');
//       localStorage.removeItem('forceRefreshCart'); // Clear the flag

//       // Force refresh orders by triggering a reload
//       if (currentUser) {
//         const ordersRef = ref(db, 'orders');
//         get(ordersRef).then(() => {
//           console.log('Orders refreshed after payment');
//         });
//       }
//     }
//   }, []);
//   // Track current user authentication state
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Common issues and solutions for meat delivery
//   const helpIssues = [
//     {
//       id: 1,
//       title: "Order Delayed",
//       solution: "We're sorry for the delay. Our standard delivery time is 30-40 minutes, but sometimes delays occur due to high demand or weather conditions. If your order is more than 20 minutes past the estimated delivery time, you'll receive a partial refund automatically. If it's been over an hour, please contact our customer service for immediate assistance."
//     },
//     {
//       id: 2,
//       title: "Quality Issues with Meat",
//       solution: "We prioritize freshness and quality. If you've received meat that doesn't meet our quality standards (unusual smell, discoloration, or incorrect cut), please take a photo before cooking and contact us within 24 hours of delivery. We'll arrange for a replacement or refund. All our meat undergoes rigorous quality checks before dispatch."
//     },
//     {
//       id: 3,
//       title: "Incorrect Items Delivered",
//       solution: "We apologize for the mix-up. Please check your order confirmation against what you received. If there are missing or incorrect items, please let us know within 6 hours of delivery. We'll arrange for the correct items to be delivered on priority or provide a refund for the incorrect items."
//     },
//     {
//       id: 4,
//       title: "Canceled Order But Still Charged",
//       solution: "If you canceled your order but were still charged, don't worry. Refunds for canceled orders typically take 5-7 business days to reflect in your account. If it's been longer than 7 days, please provide your order number and payment details, and our team will expedite the refund process."
//     },
//     {
//       id: 5,
//       title: "Need Help with Returns/Refunds",
//       solution: "For perishable items like meat, we don't accept returns, but we do provide refunds for quality issues. If you're unsatisfied with your order, please contact us within 24 hours of delivery with photos if possible. Refunds are processed within 3-5 business days and will be credited to your original payment method or as store credit, depending on your preference."
//     }
//   ];

//   // Fetch help tickets to show status updates
//   useEffect(() => {
//     if (!currentUser) return;

//     const helpRef = ref(db, 'help');

//     const unsubscribe = onValue(helpRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const ticketsData = {};

//         snapshot.forEach((childSnapshot) => {
//           const helpId = childSnapshot.key;
//           const helpDetails = childSnapshot.val();

//           // Only include tickets relevant to this user
//           if (helpDetails.customer &&
//             (helpDetails.customer.userId === currentUser.uid ||
//               helpDetails.customer.email === currentUser.email)) {

//             // Save tickets by orderId for easy lookup
//             if (helpDetails.orderId) {
//               // Count unread responses (could implement a "read" marker in the future)
//               const adminResponses = helpDetails.adminResponses || [];

//               ticketsData[helpDetails.orderId] = {
//                 id: helpId,
//                 status: helpDetails.status,
//                 lastUpdated: helpDetails.lastUpdated,
//                 adminResponses: adminResponses,
//                 issueType: helpDetails.issueType,
//                 hasNewResponses: adminResponses.length > 0,
//                 responseCount: adminResponses.length,
//                 customerNotes: helpDetails.customerNotes || []
//               };
//             }
//           }
//         });

//         setHelpTickets(ticketsData);
//       }
//     });

//     return () => unsubscribe();
//   }, [currentUser]);

//   // If active help order changes and has a ticket, fetch the details
//   useEffect(() => {
//     const getTicketDetails = async () => {
//       if (activeHelpOrder && activeHelpOrder.ticket && activeHelpOrder.ticket.id) {
//         setLoadingTicket(true);
//         const details = await fetchTicketDetails(activeHelpOrder.ticket.id);
//         setTicketDetails(details);
//         setLoadingTicket(false);
//       }
//     };

//     if (activeHelpOrder) {
//       getTicketDetails();
//     } else {
//       setTicketDetails(null);
//     }
//   }, [activeHelpOrder]);


//   useEffect(() => {
//     // Only proceed if we have a current user
//     if (!currentUser) {
//       setPreviousOrders([]);
//       setIsLoadingOrders(false);
//       return;
//     }

//     console.log("Setting up order listener for user:", currentUser.uid);
//     const ordersRef = ref(db, 'orders');

//     // Listen for changes to the orders collection
//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       setIsLoadingOrders(true);
//       if (snapshot.exists()) {
//         const ordersData = [];
//         snapshot.forEach((childSnapshot) => {
//           const orderId = childSnapshot.key;
//           const orderData = childSnapshot.val();

//           // Debug: Print order status
//           console.log(`Order ${orderId} status: ${orderData.status}`);

//           // Only include orders for the current user
//           if (orderData.customer &&
//             (orderData.customer.userId === currentUser.uid ||
//               orderData.customer.email === currentUser.email)) {

//             // Check if there's a help ticket for this order
//             const ticket = helpTickets[orderId];

//             // Add ticket information to the order if available
//             const orderWithTicket = {
//               id: orderId,
//               ...orderData,
//               ticket: ticket ? {
//                 id: ticket.id,
//                 status: ticket.status,
//                 lastUpdated: ticket.lastUpdated,
//                 hasNewResponses: ticket.adminResponses && ticket.adminResponses.length > 0,
//                 responseCount: ticket.adminResponses ? ticket.adminResponses.length : 0,
//                 issueType: ticket.issueType
//               } : null
//             };

//             ordersData.push(orderWithTicket);
//           }
//         });

//         // Sort orders by date (newest first)
//         ordersData.sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0));
//         console.log("Updated orders in Cart.js:", ordersData.length);
//         setPreviousOrders(ordersData);
//       } else {
//         setPreviousOrders([]);
//       }
//       setIsLoadingOrders(false);
//     }, (error) => {
//       console.error('Error fetching orders:', error);
//       setIsLoadingOrders(false);
//     });

//     // Clean up listener on component unmount
//     return () => unsubscribe();
//   }, [currentUser, helpTickets]);

//   // Helper function to get status color
//   // Helper function to get status color
//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'pending':
//         return '#f39c12'; // Orange
//       case 'processing':
//         return '#3498db'; // Blue
//       case 'shipped':
//         return '#9b59b6'; // Purple
//       case 'delivered':
//         return '#2ecc71'; // Green
//       case 'cancelled':
//       case 'payment-failed':
//         return '#e74c3c'; // Red
//       case 'payment-completed':
//         return '#27ae60'; // Darker Green
//       case 'payment-pending':
//         return '#f1c40f'; // Yellow
//       default:
//         return '#95a5a6'; // Gray (default)
//     }
//   };

//   // Helper function to get status icon and display text
//   const getStatusDisplay = (status) => {
//     let icon = '📦'; // Default icon
//     let displayText = status || 'Processing';

//     // Format the status text for display
//     if (status) {
//       switch (status.toLowerCase()) {
//         case 'payment-completed':
//           icon = '💰';
//           displayText = 'Payment Completed';
//           break;
//         case 'payment-failed':
//           icon = '❌';
//           displayText = 'Payment Failed';
//           break;
//         case 'payment-pending':
//           icon = '⏳';
//           displayText = 'Payment Pending';
//           break;
//         case 'pending':
//           icon = '⏱️';
//           displayText = 'Pending';
//           break;
//         case 'processing':
//           icon = '🔄';
//           displayText = 'Processing';
//           break;
//         case 'shipped':
//           icon = '🚚';
//           displayText = 'Shipped';
//           break;
//         case 'delivered':
//           icon = '✅';
//           displayText = 'Delivered';
//           break;
//         case 'cancelled':
//           icon = '❌';
//           displayText = 'Cancelled';
//           break;
//       }
//     }

//     return { icon, displayText };
//   };

//   // Helper function to get status icon based on order status
//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'pending':
//         return '⏱️'; // Clock
//       case 'processing':
//         return '🔄'; // Processing
//       case 'shipped':
//         return '🚚'; // Truck
//       case 'delivered':
//         return '✅'; // Checkmark
//       case 'cancelled':
//         return '❌'; // X mark
//       default:
//         return '📦'; // Package (default)
//     }
//   };

//   // Helper function to get ticket status badge
//   const getTicketStatusBadge = (status) => {
//     let badgeClass = '';
//     let statusText = '';

//     switch (status) {
//       case 'open':
//         badgeClass = 'ticket-status-open';
//         statusText = 'Open';
//         break;
//       case 'in-progress':
//         badgeClass = 'ticket-status-progress';
//         statusText = 'In Progress';
//         break;
//       case 'resolved':
//         badgeClass = 'ticket-status-resolved';
//         statusText = 'Resolved';
//         break;
//       default:
//         badgeClass = 'ticket-status-default';
//         statusText = 'Submitted';
//     }

//     return (
//       <div className={`ticket-status-badge ${badgeClass}`}>
//         {statusText}
//       </div>
//     );
//   };

//   const handleQuantityChange = (productId, newQuantity) => {
//     updateQuantity(productId, newQuantity);
//   };

//   const handleRemoveItem = (productId) => {
//     removeFromCart(productId);
//   };

//   const handleCouponApply = () => {
//     if (couponCode.toUpperCase() === 'FRESH20' && !couponApplied) {
//       const discountAmount = Math.round(cartTotal * 0.2); // 20% discount
//       setDiscount(discountAmount);
//       setCouponApplied(true);
//       alert('Coupon applied successfully!');
//     } else if (couponApplied) {
//       alert('Coupon already applied!');
//     } else {
//       alert('Invalid coupon code!');
//     }
//   };

//   const handleCheckout = () => {
//     // Proceed directly to checkout without login check
//     navigate('/checkout');
//   };

//   const togglePreviousOrders = () => {
//     setShowPreviousOrders(!showPreviousOrders);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';

//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Format response date
//   const formatResponseDate = (dateString) => {
//     if (!dateString) return '';

//     const date = new Date(dateString);
//     return date.toLocaleString('en-IN', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Open Help Center
//   const openHelpCenter = async (order) => {
//     setActiveHelpOrder(order);
//     setSelectedIssue(null);
//     setCustomerNote('');
//     setSubmitSuccess(false);

//     // Check if there's an existing ticket
//     if (order.ticket && order.ticket.id) {
//       setLoadingTicket(true);
//       const details = await fetchTicketDetails(order.ticket.id);
//       setTicketDetails(details);
//       setLoadingTicket(false);
//     } else {
//       setTicketDetails(null);
//     }
//   };

//   // Close Help Center
//   const closeHelpCenter = () => {
//     setActiveHelpOrder(null);
//     setSelectedIssue(null);
//     setCustomerNote('');
//     setSubmitSuccess(false);
//     setTicketDetails(null);
//   };

//   const selectIssue = (issue) => {
//     setSelectedIssue(issue);
//   };

//   const handleNoteChange = (e) => {
//     setCustomerNote(e.target.value);
//   };



//   // Fetch detailed ticket information including admin responses
//   const fetchTicketDetails = async (ticketId) => {
//     if (!ticketId) return null;

//     try {
//       const ticketRef = ref(db, `help/${ticketId}`);
//       const snapshot = await get(ticketRef);

//       if (snapshot.exists()) {
//         return { id: ticketId, ...snapshot.val() };
//       }
//     } catch (error) {
//       console.error('Error fetching ticket details:', error);
//     }

//     return null;
//   };

//   // Function to check for existing help requests for this order
//   const checkExistingTicket = async (orderId) => {
//     if (!orderId) return null;

//     // First check the cached helpTickets state
//     if (helpTickets[orderId]) {
//       return helpTickets[orderId];
//     }

//     // If not found in cache, check the database
//     try {
//       const helpRef = ref(db, 'help');
//       const orderTicketQuery = query(helpRef, orderByChild('orderId'), equalTo(orderId));
//       const snapshot = await get(orderTicketQuery);

//       if (snapshot.exists()) {
//         // Return the first matching ticket
//         let ticket = null;
//         snapshot.forEach((childSnapshot) => {
//           if (!ticket) {
//             const ticketId = childSnapshot.key;
//             const ticketData = childSnapshot.val();
//             ticket = { id: ticketId, ...ticketData };
//           }
//         });
//         return ticket;
//       }
//     } catch (error) {
//       console.error('Error checking for existing ticket:', error);
//     }

//     return null;
//   };

//   const submitHelpRequest = async () => {
//     if (!activeHelpOrder) return;

//     setIsSubmitting(true);

//     try {
//       // Check if there's already a help request for this order
//       const existingTicket = await checkExistingTicket(activeHelpOrder.id);

//       // If there's an existing ticket, update it instead of creating a new one
//       if (existingTicket) {
//         // Update the existing ticket - add a new customer message
//         const ticketRef = ref(db, `help/${existingTicket.id}`);

//         // Get the current ticket data
//         const ticketSnap = await get(ticketRef);
//         const currentTicket = ticketSnap.val() || {};

//         // Prepare the update data
//         const updateData = {
//           lastUpdated: new Date().toISOString(),
//           status: 'open', // Reopen the ticket if it was resolved
//         };

//         // Only add a new customer note if one was provided
//         if (customerNote.trim()) {
//           // Add the new note to customerNotes array or create it
//           const customerNotes = currentTicket.customerNotes || [];
//           customerNotes.push({
//             text: customerNote.trim(),
//             timestamp: new Date().toISOString()
//           });
//           updateData.customerNotes = customerNotes;

//           // Also update the main customerNote field for backwards compatibility
//           updateData.customerNote = `${currentTicket.customerNote || ''}\n\nAdditional note (${new Date().toLocaleString()}):\n${customerNote.trim()}`;
//         }

//         // If a new issue type was selected, update it
//         if (selectedIssue && (!currentTicket.issueType || currentTicket.issueType !== selectedIssue.title)) {
//           updateData.issueType = selectedIssue.title;
//         }

//         // Update the ticket in Firebase
//         await set(ticketRef, {
//           ...currentTicket,
//           ...updateData
//         });

//         // Update the helpTickets state to reflect changes
//         setHelpTickets(prev => ({
//           ...prev,
//           [activeHelpOrder.id]: {
//             ...prev[activeHelpOrder.id],
//             status: 'open',
//             lastUpdated: new Date().toISOString(),
//             customerNotes: updateData.customerNotes || currentTicket.customerNotes,
//             issueType: updateData.issueType || currentTicket.issueType
//           }
//         }));

//         setSubmitSuccess(true);
//         setTimeout(() => {
//           closeHelpCenter();
//         }, 2000);

//       } else {
//         // Create a new help request
//         const helpRef = ref(db, 'help');
//         const newHelpRef = push(helpRef);

//         // Get customer information if available (from order)
//         const customerInfo = activeHelpOrder.customer || {};

//         // Prepare data to save
//         const helpData = {
//           orderId: activeHelpOrder.id,
//           orderDate: activeHelpOrder.orderDate,
//           issueType: selectedIssue ? selectedIssue.title : 'General Inquiry',
//           customerNote: customerNote.trim(),
//           submittedAt: new Date().toISOString(),
//           lastUpdated: new Date().toISOString(),
//           status: 'open', // open, in-progress, resolved
//           items: activeHelpOrder.items || [],
//           customer: {
//             userId: currentUser ? currentUser.uid : null,
//             fullName: customerInfo.fullName || 'Anonymous Customer',
//             email: customerInfo.email || (currentUser ? currentUser.email : ''),
//             phone: customerInfo.phone || '',
//             address: customerInfo.address || ''
//           },
//           adminResponses: [], // Initialize empty array for admin responses
//           customerNotes: [{
//             text: customerNote.trim(),
//             timestamp: new Date().toISOString()
//           }]
//         };

//         // Save to Firebase
//         await set(newHelpRef, helpData);

//         // Update helpTickets state to include the new ticket
//         setHelpTickets(prev => ({
//           ...prev,
//           [activeHelpOrder.id]: {
//             id: newHelpRef.key,
//             status: 'open',
//             lastUpdated: new Date().toISOString(),
//             adminResponses: [],
//             issueType: selectedIssue ? selectedIssue.title : 'General Inquiry'
//           }
//         }));

//         // Show success message
//         setSubmitSuccess(true);

//         // Reset form after a short delay
//         setTimeout(() => {
//           closeHelpCenter();
//         }, 2000);
//       }
//     } catch (error) {
//       console.error('Error submitting help request:', error);
//       alert('Failed to submit your request. Please try again later.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // View ticket details
//   const viewTicketDetails = (orderId) => {
//     // Find the order
//     const order = previousOrders.find(o => o.id === orderId);
//     if (order) {
//       openHelpCenter(order);
//     }
//   };

//   // Render Help Center
//   const renderHelpCenter = () => {
//     if (!activeHelpOrder) return null;

//     // Check if there's an existing ticket for this order
//     const existingTicket = activeHelpOrder.ticket;

//     return (
//       <div className="help-center-overlay">
//         <div className="help-center-container">
//           <div className="help-center-header">
//             <h3>Help Center</h3>
//             <button className="close-help-button" onClick={closeHelpCenter}>
//               <FaTimes />
//             </button>
//           </div>

//           <div className="help-center-order-info">
//             <p>Order #{activeHelpOrder.id}</p>
//             <p>Ordered on: {formatDate(activeHelpOrder.orderDate)}</p>
//             <div className="order-status-badge" style={{ backgroundColor: getStatusColor(activeHelpOrder.status) }}>
//               {getStatusIcon(activeHelpOrder.status)} {activeHelpOrder.status || 'Processing'}
//             </div>

//             {/* Show ticket status if there's an existing ticket */}
//             {existingTicket && (
//               <div className="existing-ticket-info">
//                 <p>Support ticket: {getTicketStatusBadge(existingTicket.status)}</p>
//                 {existingTicket.hasNewResponses && (
//                   <p className="new-responses-alert">
//                     {existingTicket.responseCount} {existingTicket.responseCount === 1 ? 'response' : 'responses'} from support
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {submitSuccess ? (
//             <div className="help-success-message">
//               <h4>Thank you for reaching out!</h4>
//               <p>Your request has been {existingTicket ? 'updated' : 'submitted'} successfully. Our team will get back to you within 24 hours.</p>
//               <button className="close-help-button-success" onClick={closeHelpCenter}>
//                 Close
//               </button>
//             </div>
//           ) : (
//             <>
//               {/* Display admin responses when ticket details are loaded */}
//               {loadingTicket ? (
//                 <div className="ticket-loading">
//                   <div className="loading-spinner"></div>
//                   <p>Loading ticket details...</p>
//                 </div>
//               ) : ticketDetails && ticketDetails.adminResponses && ticketDetails.adminResponses.length > 0 ? (
//                 <div className="admin-responses-section">
//                   <h4>Responses from Support Team</h4>
//                   <div className="admin-responses-list">
//                     {ticketDetails.adminResponses.map((response, index) => (
//                       <div key={index} className="admin-response-item">
//                         <div className="response-header">
//                           <span className="admin-name">{response.adminName || 'Support Team'}</span>
//                           <span className="response-time">{formatResponseDate(response.timestamp)}</span>
//                         </div>
//                         <div className="response-content">
//                           <p>{response.text}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="ticket-status-info">
//                     <p>Current status: <strong>{ticketDetails.status === 'open' ? 'Open' :
//                       ticketDetails.status === 'in-progress' ? 'In Progress' : 'Resolved'}</strong></p>
//                     <p>Last updated: {formatDate(ticketDetails.lastUpdated)}</p>
//                   </div>
//                 </div>
//               ) : null}

//               <div className="help-center-question">
//                 <h4>{ticketDetails && ticketDetails.adminResponses && ticketDetails.adminResponses.length > 0 ?
//                   'Need more help with this order?' : 'What issue are you facing?'}</h4>

//                 <div className="help-issues-list">
//                   {helpIssues.map(issue => (
//                     <div
//                       key={issue.id}
//                       className={`help-issue-item ${selectedIssue && selectedIssue.id === issue.id ? 'selected' : ''}`}
//                       onClick={() => selectIssue(issue)}
//                     >
//                       {issue.title}
//                     </div>
//                   ))}
//                 </div>

//                 {selectedIssue && (
//                   <div className="help-solution">
//                     <h5>{selectedIssue.title}</h5>
//                     <p>{selectedIssue.solution}</p>
//                   </div>
//                 )}

//                 <div className="help-note-section">
//                   <h4>
//                     {ticketDetails && ticketDetails.adminResponses && ticketDetails.adminResponses.length > 0 ?
//                       'Add a reply to support team' :
//                       `Add a note ${existingTicket ? '(update your ticket)' : '(optional)'}`}
//                   </h4>
//                   <textarea
//                     className="help-note-input"
//                     placeholder={ticketDetails && ticketDetails.adminResponses && ticketDetails.adminResponses.length > 0 ?
//                       "Reply to the support team with additional information..." :
//                       "Describe your issue in detail or add any specific information..."}
//                     value={customerNote}
//                     onChange={handleNoteChange}
//                     rows={4}
//                   ></textarea>

//                   <button
//                     className="submit-help-button"
//                     onClick={submitHelpRequest}
//                     disabled={isSubmitting || (!selectedIssue && !customerNote.trim() && !existingTicket)}
//                   >
//                     {isSubmitting ? 'Submitting...' :
//                       ticketDetails && ticketDetails.adminResponses && ticketDetails.adminResponses.length > 0 ?
//                         'Send Reply' : existingTicket ? 'Update Request' : 'Submit Request'} <FaPaperPlane />
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Render previous orders section
//   const renderPreviousOrders = () => {
//     if (isLoadingOrders) {
//       return <div className="loading-orders">Loading your previous orders...</div>;
//     }

//     if (!currentUser) {
//       return <div className="no-previous-orders">Please sign in to view your order history.</div>;
//     }

//     if (previousOrders.length === 0) {
//       return <div className="no-previous-orders">You don't have any previous orders.</div>;
//     }

//     return (
//       <div className="previous-orders-list">
//         {previousOrders.map((order) => (
//           <div key={order.id} className="previous-order-item">
//             <div className="previous-order-header">
//               <div className="previous-order-info">
//                 <h4>Order #{order.id}</h4>
//                 <span className="previous-order-date">{formatDate(order.orderDate)}</span>
//               </div>
//               <div className="previous-order-total">
//                 ₹{order.totalAmount || 0}
//               </div>
//             </div>

//             {/* Order Status Badge */}
//             <div className="order-status-container">
//               {order.status && (
//                 <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
//                   {(() => {
//                     const { icon, displayText } = getStatusDisplay(order.status);
//                     return (
//                       <>
//                         {icon} {displayText}
//                       </>
//                     );
//                   })()}
//                 </div>
//               )}
//               {order.paymentMethod && (
//                 <div className="payment-method">
//                   Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' :
//                     order.paymentMethod === 'easebuzz' ? 'Online Payment' :
//                       order.paymentMethod}
//                 </div>
//               )}
//               {order.paymentDetails && (
//                 <div className="payment-details">
//                   {order.paymentDetails.paymentId && (
//                     <small>Payment ID: {order.paymentDetails.paymentId}</small>
//                   )}
//                   {order.paymentTimestamp && (
//                     <small>Paid on: {formatDate(order.paymentTimestamp)}</small>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Show ticket status if exists */}
//             {order.ticket && (
//               <div className="order-ticket-status">
//                 <div className="ticket-info">
//                   <span className="ticket-label">Support Ticket:</span>
//                   {getTicketStatusBadge(order.ticket.status)}
//                 </div>
//                 {order.ticket.hasNewResponses && (
//                   <div className="ticket-responses">
//                     <span className="new-response-indicator">
//                       {order.ticket.responseCount} {order.ticket.responseCount === 1 ? 'response' : 'responses'} from support
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="previous-order-items">
//               {order.items && order.items.map((item, index) => (
//                 <div key={index} className="previous-order-item-detail">
//                   <span className="previous-item-name">{item.name || 'Unknown Item'} × {item.quantity || 1}</span>
//                   <span className="previous-item-price">₹{(item.price || 0) * (item.quantity || 1)}</span>
//                 </div>
//               ))}
//             </div>

//             <button
//               className={`help-center-button ${order.ticket ? 'has-ticket' : ''}`}
//               onClick={() => openHelpCenter(order)}
//             >
//               <FaHeadset /> {order.ticket ? 'View Support Ticket' : 'Help Center'}
//             </button>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (!cart || cart.length === 0) {
//     return (
//       <div className="empty-cart">
//         <div className="empty-cart-container">
//           <div className="empty-cart-icon">
//             <FaShoppingCart />
//           </div>
//           <h2>Your cart is empty</h2>
//           <p>Looks like you haven't added anything to your cart yet.</p>
//           <Link to="/" className="continue-shopping-button">
//             Start Shopping
//           </Link>

//           {/* Display previous orders even when cart is empty */}
//           <div className="previous-orders-section">
//             <button
//               className="toggle-previous-orders-button"
//               onClick={togglePreviousOrders}
//             >
//               <FaHistory /> {showPreviousOrders ? 'Hide Previous Orders' : 'View Previous Orders'}
//             </button>

//             {showPreviousOrders && renderPreviousOrders()}
//           </div>
//         </div>

//         {/* Render Help Center if active */}
//         {renderHelpCenter()}
//       </div>
//     );
//   }

//   return (
//     <div className="cart-page">
//       <div className="cart-container">
//         <div className="cart-header">
//           <Link to="/" className="back-to-shopping">
//             <FaArrowLeft /> Continue Shopping
//           </Link>
//           <h1>Your Cart ({cart.length} items)</h1>
//         </div>

//         <div className="cart-content">
//           <div className="cart-items">
//             {cart.map(item => (
//               <div key={item.id} className="cart-item">
//                 <div className="cart-item-image">
//                   <img src={item.image} alt={item.name} onError={(e) => (e.target.src = 'https://via.placeholder.com/100?text=No+Image')} />
//                 </div>

//                 <div className="cart-item-details">
//                   <h3 className="cart-item-name">{item.name}</h3>

//                   <div className="cart-item-specs">
//                     {item.weight && <span>{item.weight}</span>}
//                     {item.pieces && <span>{item.pieces}</span>}
//                   </div>

//                   <div className="cart-item-price">
//                     <span className="current-price">₹{item.price}</span>
//                     {item.originalPrice > item.price && (
//                       <>
//                         <span className="original-price">₹{item.originalPrice}</span>
//                         <span className="discount">{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off</span>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 <div className="cart-item-quantity">
//                   <div className="quantity-controls">
//                     <button
//                       className="quantity-button"
//                       onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
//                       disabled={item.quantity <= 1}
//                     >
//                       <FaMinus />
//                     </button>
//                     <span className="quantity-value">{item.quantity}</span>
//                     <button
//                       className="quantity-button"
//                       onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
//                     >
//                       <FaPlus />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="cart-item-subtotal">
//                   ₹{item.price * item.quantity}
//                 </div>

//                 <button
//                   className="remove-item-button"
//                   onClick={() => handleRemoveItem(item.id)}
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             ))}

//             <button className="clear-cart-button" onClick={clearCart}>
//               Clear Cart
//             </button>
//           </div>

//           <div className="cart-summary">
//             <h2>Order Summary</h2>

//             <div className="coupon-code">
//               <input
//                 type="text"
//                 placeholder="Enter coupon code"
//                 value={couponCode}
//                 onChange={(e) => setCouponCode(e.target.value)}
//                 disabled={couponApplied}
//               />
//               <button
//                 className="apply-coupon-button"
//                 onClick={handleCouponApply}
//                 disabled={couponApplied || !couponCode}
//               >
//                 Apply
//               </button>
//             </div>

//             {couponApplied && (
//               <div className="applied-coupon">
//                 <span className="coupon-badge">FRESH20</span>
//                 <span className="coupon-info">20% discount applied</span>
//               </div>
//             )}

//             <div className="summary-item">
//               <span>Subtotal</span>
//               <span>₹{cartTotal}</span>
//             </div>

//             {discount > 0 && (
//               <div className="summary-item discount">
//                 <span>Discount</span>
//                 <span>-₹{discount}</span>
//               </div>
//             )}

//             <div className="summary-item total">
//               <span>Total</span>
//               <span>₹{totalAmount}</span>
//             </div>

//             <button className="checkout-button" onClick={handleCheckout}>
//               Proceed to Checkout
//             </button>

//             <div className="delivery-note">
//               <p>Delivery within 30-40 minutes</p>
//             </div>
//           </div>
//         </div>

//         {/* Previous Orders Section */}
//         <div className="previous-orders-section">
//           <button
//             className="toggle-previous-orders-button"
//             onClick={togglePreviousOrders}
//           >
//             <FaHistory /> {showPreviousOrders ? 'Hide Previous Orders' : 'View Previous Orders'}
//           </button>

//           {showPreviousOrders && renderPreviousOrders()}
//         </div>
//       </div>

//       {/* Render Help Center if active */}
//       {renderHelpCenter()}
//     </div>
//   );
// };

// export default Cart;


import React, { useCallback, useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/pages/Cart.css';
import { FaShoppingCart, FaArrowLeft, FaMinus, FaPlus, FaTrash, FaHistory, FaHeadset, FaTimes, FaPaperPlane, FaUndo } from 'react-icons/fa';
import { db, auth } from '../firebase/config';
import { ref, onValue, push, set, query, orderByChild, equalTo, get, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import RefundOrder from '../components/RefundOrder'; // Import the RefundOrder component

const Cart = () => {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [showPreviousOrders, setShowPreviousOrders] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Help Center states
  const [activeHelpOrder, setActiveHelpOrder] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [helpTickets, setHelpTickets] = useState({});
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [refreshedOrder, setRefreshedOrder] = useState(null);
  // Refund states
  const [activeRefundOrder, setActiveRefundOrder] = useState(null);

  const cartTotal = total || 0;
  // Removed tax calculation
  const totalAmount = cartTotal - discount;
  const renderOrderStatusBadge = (order) => {
    // First check if there's a refund ticket that's resolved - override the displayed status
    if (order.ticket &&
      order.ticket.issueType === 'Refund Request' &&
      order.ticket.status === 'resolved') {
      return (
        <div className="order-status-badge" style={{ backgroundColor: getStatusColor('refunded') }}>
          💸 Refunded
        </div>
      );
    }

    // Otherwise, show the actual order status
    return (
      <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
        {(() => {
          const { icon, displayText } = getStatusDisplay(order.status);
          return (
            <>
              {icon} {displayText}
            </>
          );
        })()}
      </div>
    );
  };
  // Add at the beginning of your component
  useEffect(() => {
    // Check if we need to force refresh orders
    const forceRefresh = localStorage.getItem('forceRefreshCart');
    if (forceRefresh === 'true') {
      console.log('Forcing refresh of orders due to recent payment');
      localStorage.removeItem('forceRefreshCart'); // Clear the flag

      // Force refresh orders by triggering a reload
      if (currentUser) {
        const ordersRef = ref(db, 'orders');
        get(ordersRef).then(() => {
          console.log('Orders refreshed after payment');
        });
      }
    }
  }, []);

  // Track current user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Common issues and solutions for meat delivery
  const helpIssues = [
    {
      id: 1,
      title: "Order Delayed",
      solution: "We're sorry for the delay. Our standard delivery time is 30-40 minutes, but sometimes delays occur due to high demand or weather conditions. If your order is more than 20 minutes past the estimated delivery time, you'll receive a partial refund automatically. If it's been over an hour, please contact our customer service for immediate assistance."
    },
    {
      id: 2,
      title: "Quality Issues with Meat",
      solution: "We prioritize freshness and quality. If you've received meat that doesn't meet our quality standards (unusual smell, discoloration, or incorrect cut), please take a photo before cooking and contact us within 24 hours of delivery. We'll arrange for a replacement or refund. All our meat undergoes rigorous quality checks before dispatch."
    },
    {
      id: 3,
      title: "Incorrect Items Delivered",
      solution: "We apologize for the mix-up. Please check your order confirmation against what you received. If there are missing or incorrect items, please let us know within 6 hours of delivery. We'll arrange for the correct items to be delivered on priority or provide a refund for the incorrect items."
    },
    {
      id: 4,
      title: "Canceled Order But Still Charged",
      solution: "If you canceled your order but were still charged, don't worry. Refunds for canceled orders typically take 5-7 business days to reflect in your account. If it's been longer than 7 days, please provide your order number and payment details, and our team will expedite the refund process."
    },
    {
      id: 5,
      title: "Need Help with Returns/Refunds",
      solution: "For perishable items like meat, we don't accept returns, but we do provide refunds for quality issues. If you're unsatisfied with your order, please contact us within 24 hours of delivery with photos if possible. Refunds are processed within 3-5 business days and will be credited to your original payment method or as store credit, depending on your preference."
    }
  ];

  // Fetch help tickets to show status updates
  useEffect(() => {
    if (!currentUser) return;

    const helpRef = ref(db, 'help');

    const unsubscribe = onValue(helpRef, (snapshot) => {
      if (snapshot.exists()) {
        const ticketsData = {};

        snapshot.forEach((childSnapshot) => {
          const helpId = childSnapshot.key;
          const helpDetails = childSnapshot.val();

          // Only include tickets relevant to this user
          if (helpDetails.customer &&
            (helpDetails.customer.userId === currentUser.uid ||
              helpDetails.customer.email === currentUser.email)) {

            // Save tickets by orderId for easy lookup
            if (helpDetails.orderId) {
              // Count unread responses (could implement a "read" marker in the future)
              const adminResponses = helpDetails.adminResponses || [];

              ticketsData[helpDetails.orderId] = {
                id: helpId,
                status: helpDetails.status,
                lastUpdated: helpDetails.lastUpdated,
                adminResponses: adminResponses,
                issueType: helpDetails.issueType,
                hasNewResponses: adminResponses.length > 0,
                responseCount: adminResponses.length,
                customerNotes: helpDetails.customerNotes || []
              };

              // Check if this is a refund ticket with resolved status and update the order
              if (helpDetails.issueType === 'Refund Request') {
                const orderId = helpDetails.orderId;
                const orderRef = ref(db, `orders/${orderId}`);

                // Get current order to check status
                get(orderRef).then((orderSnapshot) => {
                  if (orderSnapshot.exists()) {
                    const orderData = orderSnapshot.val();

                    // Only update if necessary to avoid infinite loops
                    if (helpDetails.status === 'resolved' && orderData.status === 'refund-pending') {
                      update(orderRef, {
                        status: 'refunded',
                        lastUpdated: new Date().toISOString()
                      }).then(() => {
                        console.log(`Order ${orderId} status updated to refunded`);
                      }).catch(error => {
                        console.error(`Error updating order ${orderId} status:`, error);
                      });
                    }
                    else if (helpDetails.status === 'in-progress' && orderData.status === 'refund-pending') {
                      update(orderRef, {
                        status: 'refund-in-progress',
                        lastUpdated: new Date().toISOString()
                      }).then(() => {
                        console.log(`Order ${orderId} status updated to refund-in-progress`);
                      }).catch(error => {
                        console.error(`Error updating order ${orderId} status:`, error);
                      });
                    }
                  }
                }).catch(error => {
                  console.error(`Error fetching order ${orderId}:`, error);
                });
              }
            }
          }
        });

        setHelpTickets(ticketsData);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // If active help order changes and has a ticket, fetch the details
  useEffect(() => {
    const getTicketDetails = async () => {
      if (activeHelpOrder && activeHelpOrder.ticket && activeHelpOrder.ticket.id) {
        setLoadingTicket(true);
        const details = await fetchTicketDetails(activeHelpOrder.ticket.id);
        setTicketDetails(details);
        setLoadingTicket(false);
      }
    };

    if (activeHelpOrder) {
      getTicketDetails();
    } else {
      setTicketDetails(null);
    }
  }, [activeHelpOrder]);


  const refreshOrders = useCallback((expiredOrderId = null) => {
    if (currentUser) {
      console.log("Refreshing orders to update refund availability");

      // First, check for any resolved refund tickets and force update their order statuses
      const helpRef = ref(db, 'help');
      get(helpRef).then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const helpId = childSnapshot.key;
            const helpDetails = childSnapshot.val();

            // Look for resolved refund tickets
            if (helpDetails.issueType === 'Refund Request' &&
              helpDetails.status === 'resolved' &&
              helpDetails.orderId) {

              // Force update the order status to "refunded"
              const orderRef = ref(db, `orders/${helpDetails.orderId}`);
              get(orderRef).then((orderSnapshot) => {
                if (orderSnapshot.exists()) {
                  const orderData = orderSnapshot.val();

                  // Update if the order status doesn't match the ticket status
                  if (orderData.status !== 'refunded') {
                    update(orderRef, {
                      status: 'refunded',
                      lastUpdated: new Date().toISOString()
                    }).then(() => {
                      console.log(`Force updated order ${helpDetails.orderId} to refunded status`);
                    });
                  }
                }
              });
            }
          });
        }
      });
      // Then refresh all orders
      const ordersRef = ref(db, 'orders');
      get(ordersRef).then(() => {
        console.log('Orders refreshed');
        if (expiredOrderId) {
          setRefreshedOrder(expiredOrderId);
          // Clear notification after 3 seconds
          setTimeout(() => setRefreshedOrder(null), 3000);
        }
      }).catch(error => {
        console.error('Error refreshing orders:', error);
      });
    }
  }, [currentUser]);
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (showPreviousOrders) {
        refreshOrders();
      }
    }, 60000); // Refresh every minute when orders are visible

    return () => clearInterval(refreshInterval);
  }, [showPreviousOrders, currentUser, refreshOrders]);
  useEffect(() => {
    // Only proceed if we have a current user
    if (!currentUser) {
      setPreviousOrders([]);
      setIsLoadingOrders(false);
      return;
    }

    console.log("Setting up order listener for user:", currentUser.uid);
    const ordersRef = ref(db, 'orders');

    // Listen for changes to the orders collection
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      setIsLoadingOrders(true);
      if (snapshot.exists()) {
        const ordersData = [];
        snapshot.forEach((childSnapshot) => {
          const orderId = childSnapshot.key;
          const orderData = childSnapshot.val();

          // Debug: Print order status
          console.log(`Order ${orderId} status: ${orderData.status}`);

          // Only include orders for the current user
          if (orderData.customer &&
            (orderData.customer.userId === currentUser.uid ||
              orderData.customer.email === currentUser.email)) {

            // Check if there's a help ticket for this order
            const ticket = helpTickets[orderId];

            // Add ticket information to the order if available
            const orderWithTicket = {
              id: orderId,
              ...orderData,
              ticket: ticket ? {
                id: ticket.id,
                status: ticket.status,
                lastUpdated: ticket.lastUpdated,
                hasNewResponses: ticket.adminResponses && ticket.adminResponses.length > 0,
                responseCount: ticket.adminResponses ? ticket.adminResponses.length : 0,
                issueType: ticket.issueType
              } : null
            };

            // Synchronize refund status with ticket status if needed
            if (ticket && ticket.issueType === 'Refund Request' &&
              orderData.status === 'refund-pending' && ticket.status === 'resolved') {
              // Update order status to match resolved refund request
              const orderRef = ref(db, `orders/${orderId}`);
              update(orderRef, {
                status: 'refunded',
                lastUpdated: new Date().toISOString()
              }).then(() => {
                console.log(`Order ${orderId} status updated to refunded`);
              }).catch(error => {
                console.error(`Error updating order ${orderId} status:`, error);
              });

              // Update local order data to reflect the change immediately
              orderWithTicket.status = 'refunded';
            }
            else if (ticket && ticket.issueType === 'Refund Request' &&
              orderData.status === 'refund-pending' && ticket.status === 'in-progress') {
              // Update order status to match in-progress refund request
              const orderRef = ref(db, `orders/${orderId}`);
              update(orderRef, {
                status: 'refund-in-progress',
                lastUpdated: new Date().toISOString()
              }).then(() => {
                console.log(`Order ${orderId} status updated to refund-in-progress`);
              }).catch(error => {
                console.error(`Error updating order ${orderId} status:`, error);
              });

              // Update local order data to reflect the change immediately
              orderWithTicket.status = 'refund-in-progress';
            }

            ordersData.push(orderWithTicket);
          }
        });

        // Sort orders by date (newest first)
        ordersData.sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0));
        console.log("Updated orders in Cart.js:", ordersData.length);
        setPreviousOrders(ordersData);
      } else {
        setPreviousOrders([]);
      }
      setIsLoadingOrders(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setIsLoadingOrders(false);
    });

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, [currentUser, helpTickets]);

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#f39c12'; // Orange
      case 'processing':
        return '#3498db'; // Blue
      case 'shipped':
        return '#9b59b6'; // Purple
      case 'delivered':
        return '#2ecc71'; // Green
      case 'cancelled':
      case 'payment-failed':
        return '#e74c3c'; // Red
      case 'payment-completed':
        return '#27ae60'; // Darker Green
      case 'payment-pending':
        return '#f1c40f'; // Yellow
      case 'refunded':
        return '#8e44ad'; // Purple
      case 'partial-refund':
        return '#9b59b6'; // Light Purple
      case 'refund-pending':
        return '#e67e22'; // Orange
      case 'refund-in-progress':
        return '#3498db'; // Blue
      default:
        return '#95a5a6'; // Gray (default)
    }
  };

  // Helper function to get status icon and display text
  const getStatusDisplay = (status) => {
    let icon = '📦'; // Default icon
    let displayText = status || 'Processing';

    // Format the status text for display
    if (status) {
      switch (status.toLowerCase()) {
        case 'payment-completed':
          icon = '💰';
          displayText = 'Payment Completed';
          break;
        case 'payment-failed':
          icon = '❌';
          displayText = 'Payment Failed';
          break;
        case 'payment-pending':
          icon = '⏳';
          displayText = 'Payment Pending';
          break;
        case 'pending':
          icon = '⏱️';
          displayText = 'Pending';
          break;
        case 'processing':
          icon = '🔄';
          displayText = 'Processing';
          break;
        case 'shipped':
          icon = '🚚';
          displayText = 'Shipped';
          break;
        case 'delivered':
          icon = '✅';
          displayText = 'Delivered';
          break;
        case 'cancelled':
          icon = '❌';
          displayText = 'Cancelled';
          break;
        case 'refunded':
          icon = '💸';
          displayText = 'Refunded';
          break;
        case 'partial-refund':
          icon = '💰';
          displayText = 'Partial Refund';
          break;
        case 'refund-pending':
          icon = '⏳';
          displayText = 'Refund Pending';
          break;
        case 'refund-in-progress':
          icon = '🔄';
          displayText = 'Refund In Progress';
          break;
      }
    }

    return { icon, displayText };
  };

  // Helper function to get status icon based on order status
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '⏱️'; // Clock
      case 'processing':
        return '🔄'; // Processing
      case 'shipped':
        return '🚚'; // Truck
      case 'delivered':
        return '✅'; // Checkmark
      case 'cancelled':
        return '❌'; // X mark
      case 'refunded':
        return '💸'; // Money with wings
      case 'partial-refund':
        return '💰'; // Money bag
      case 'refund-pending':
        return '⏳'; // Hourglass
      case 'refund-in-progress':
        return '🔄'; // Processing
      default:
        return '📦'; // Package (default)
    }
  };

  // Helper function to get ticket status badge
  const getTicketStatusBadge = (status, issueType) => {
    let badgeClass = '';
    let statusText = '';

    switch (status) {
      case 'open':
        badgeClass = 'ticket-status-open';
        statusText = 'Open';
        break;
      case 'in-progress':
        badgeClass = 'ticket-status-progress';
        statusText = 'In Progress';
        break;
      case 'resolved':
        badgeClass = 'ticket-status-resolved';
        statusText = 'Resolved';
        break;
      default:
        badgeClass = 'ticket-status-default';
        statusText = 'Submitted';
    }

    // Add special styling for refund tickets
    if (issueType === 'Refund Request') {
      badgeClass += ' refund-ticket';
    }

    return (
      <div className={`ticket-status-badge ${badgeClass}`}>
        {issueType === 'Refund Request' ? `Refund: ${statusText}` : statusText}
      </div>
    );
  };

  // Helper function to get refund status badge
  const getRefundStatusBadge = (status) => {
    let badgeClass = '';
    let statusText = '';

    switch (status?.toLowerCase()) {
      case 'refunded':
        badgeClass = 'refund-status-completed';
        statusText = 'Refunded';
        break;
      case 'partial-refund':
        badgeClass = 'refund-status-partial';
        statusText = 'Partial Refund';
        break;
      case 'refund-pending':
        badgeClass = 'refund-status-pending';
        statusText = 'Refund Pending';
        break;
      default:
        badgeClass = 'refund-status-none';
        statusText = 'No Refund';
    }

    return (
      <div className={`refund-status-badge ${badgeClass}`}>
        {statusText}
      </div>
    );
  };

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCouponApply = () => {
    if (couponCode.toUpperCase() === 'FRESH20' && !couponApplied) {
      const discountAmount = Math.round(cartTotal * 0.2); // 20% discount
      setDiscount(discountAmount);
      setCouponApplied(true);
      alert('Coupon applied successfully!');
    } else if (couponApplied) {
      alert('Coupon already applied!');
    } else {
      alert('Invalid coupon code!');
    }
  };

  const handleCheckout = () => {
    // Proceed directly to checkout without login check
    navigate('/checkout');
  };

  const togglePreviousOrders = () => {
    setShowPreviousOrders(!showPreviousOrders);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format response date
  const formatResponseDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Open Help Center
  const openHelpCenter = async (order) => {
    setActiveHelpOrder(order);
    setSelectedIssue(null);
    setCustomerNote('');
    setSubmitSuccess(false);

    // Check if there's an existing ticket
    if (order.ticket && order.ticket.id) {
      setLoadingTicket(true);
      const details = await fetchTicketDetails(order.ticket.id);
      setTicketDetails(details);
      setLoadingTicket(false);
    } else {
      setTicketDetails(null);
    }
  };

  // Close Help Center
  const closeHelpCenter = () => {
    setActiveHelpOrder(null);
    setSelectedIssue(null);
    setCustomerNote('');
    setSubmitSuccess(false);
    setTicketDetails(null);
  };

  // Open Refund Request form
  const openRefundRequest = (order) => {
    setActiveRefundOrder(order);
  };

  // Close Refund Request form
  const closeRefundRequest = () => {
    setActiveRefundOrder(null);
  };

  // Handle refund completion and create support ticket
  const handleRefundComplete = async (refundDetails) => {
    closeRefundRequest();

    // Don't create another help ticket - the RefundOrder component now handles this
    console.log('Refund request completed');

    // Force refresh orders to show updated status
    const ordersRef = ref(db, 'orders');
    get(ordersRef).then(() => {
      console.log('Orders refreshed after refund request');
    });
  };

  const selectIssue = (issue) => {
    setSelectedIssue(issue);
  };

  const handleNoteChange = (e) => {
    setCustomerNote(e.target.value);
  };

  // Fetch detailed ticket information including admin responses
  const fetchTicketDetails = async (ticketId) => {
    if (!ticketId) return null;

    try {
      const ticketRef = ref(db, `help/${ticketId}`);
      const snapshot = await get(ticketRef);

      if (snapshot.exists()) {
        return { id: ticketId, ...snapshot.val() };
      }
    } catch (error) {
      console.error('Error fetching ticket details:', error);
    }

    return null;
  };

  // Function to check for existing help requests for this order
  const checkExistingTicket = async (orderId) => {
    if (!orderId) return null;

    // First check the cached helpTickets state
    if (helpTickets[orderId]) {
      return helpTickets[orderId];
    }

    // If not found in cache, check the database
    try {
      const helpRef = ref(db, 'help');
      const orderTicketQuery = query(helpRef, orderByChild('orderId'), equalTo(orderId));
      const snapshot = await get(orderTicketQuery);

      if (snapshot.exists()) {
        // Return the first matching ticket
        let ticket = null;
        snapshot.forEach((childSnapshot) => {
          if (!ticket) {
            const ticketId = childSnapshot.key;
            const ticketData = childSnapshot.val();
            ticket = { id: ticketId, ...ticketData };
          }
        });
        return ticket;
      }
    } catch (error) {
      console.error('Error checking for existing ticket:', error);
    }

    return null;
  };

  const submitHelpRequest = async () => {
    if (!activeHelpOrder) return;

    setIsSubmitting(true);

    try {
      // Check if there's already a help request for this order
      const existingTicket = await checkExistingTicket(activeHelpOrder.id);

      // If there's an existing ticket, update it instead of creating a new one
      if (existingTicket) {
        // Update the existing ticket - add a new customer message
        const ticketRef = ref(db, `help/${existingTicket.id}`);

        // Get the current ticket data
        const ticketSnap = await get(ticketRef);
        const currentTicket = ticketSnap.val() || {};

        // Prepare the update data
        const updateData = {
          lastUpdated: new Date().toISOString(),
          status: 'open', // Reopen the ticket if it was resolved
        };

        // Only add a new customer note if one was provided
        if (customerNote.trim()) {
          // Add the new note to customerNotes array or create it
          const customerNotes = currentTicket.customerNotes || [];
          customerNotes.push({
            text: customerNote.trim(),
            timestamp: new Date().toISOString()
          });
          updateData.customerNotes = customerNotes;

          // Also update the main customerNote field for backwards compatibility
          updateData.customerNote = `${currentTicket.customerNote || ''}\n\nAdditional note (${new Date().toLocaleString()}):\n${customerNote.trim()}`;
        }

        // If a new issue type was selected, update it
        if (selectedIssue && (!currentTicket.issueType || currentTicket.issueType !== selectedIssue.title)) {
          updateData.issueType = selectedIssue.title;
        }

        // Update the ticket in Firebase
        await set(ticketRef, {
          ...currentTicket,
          ...updateData
        });

        // Update the helpTickets state to reflect changes
        setHelpTickets(prev => ({
          ...prev,
          [activeHelpOrder.id]: {
            ...prev[activeHelpOrder.id],
            status: 'open',
            lastUpdated: new Date().toISOString(),
            customerNotes: updateData.customerNotes || currentTicket.customerNotes,
            issueType: updateData.issueType || currentTicket.issueType
          }
        }));

        setSubmitSuccess(true);
        setTimeout(() => {
          closeHelpCenter();
        }, 2000);

      } else {
        // Create a new help request
        const helpRef = ref(db, 'help');
        const newHelpRef = push(helpRef);

        // Get customer information if available (from order)
        const customerInfo = activeHelpOrder.customer || {};

        // Prepare data to save
        const helpData = {
          orderId: activeHelpOrder.id,
          orderDate: activeHelpOrder.orderDate,
          issueType: selectedIssue ? selectedIssue.title : 'General Inquiry',
          customerNote: customerNote.trim(),
          submittedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          status: 'open', // open, in-progress, resolved
          items: activeHelpOrder.items || [],
          customer: {
            userId: currentUser ? currentUser.uid : null,
            fullName: customerInfo.fullName || 'Anonymous Customer',
            email: customerInfo.email || (currentUser ? currentUser.email : ''),
            phone: customerInfo.phone || '',
            address: customerInfo.address || ''
          },
          adminResponses: [], // Initialize empty array for admin responses
          customerNotes: [{
            text: customerNote.trim(),
            timestamp: new Date().toISOString()
          }]
        };

        // Save to Firebase
        await set(newHelpRef, helpData);

        // Update helpTickets state to include the new ticket
        setHelpTickets(prev => ({
          ...prev,
          [activeHelpOrder.id]: {
            id: newHelpRef.key,
            status: 'open',
            lastUpdated: new Date().toISOString(),
            adminResponses: [],
            issueType: selectedIssue ? selectedIssue.title : 'General Inquiry'
          }
        }));

        // Show success message
        setSubmitSuccess(true);

        // Reset form after a short delay
        setTimeout(() => {
          closeHelpCenter();
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting help request:', error);
      alert('Failed to submit your request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // View ticket details
  const viewTicketDetails = (orderId) => {
    // Find the order
    const order = previousOrders.find(o => o.id === orderId);
    if (order) {
      openHelpCenter(order);
    }
  };

  // Check if refund is available for this order
  // Check if refund is available for this order
  const isRefundAvailable = (order) => {
    const refundableStatuses = ['delivered', 'payment-completed'];
    const nonRefundableStatuses = ['refunded', 'refund-pending', 'partial-refund', 'cancelled', 'payment-failed'];

    // Check if order status is refundable
    const statusOk = refundableStatuses.includes(order.status?.toLowerCase());

    // Check if order is not already refunded or pending refund
    const notAlreadyRefunded = !nonRefundableStatuses.includes(order.status?.toLowerCase());

    // Check if payment was online (not COD)
    const isOnlinePayment = order.paymentMethod === 'easebuzz' ||
      (order.paymentDetails && order.paymentDetails.paymentId);

    // Check if there's already a pending refund ticket
    const hasRefundTicket = order.ticket && order.ticket.issueType === 'Refund Request';

    // Check if order is within the 5-minute refund window
    const currentTime = new Date().getTime();
    const orderTime = order.paymentTimestamp ? new Date(order.paymentTimestamp).getTime() :
      order.orderDate ? new Date(order.orderDate).getTime() : null;

    // Allow refund only if less than 5 minutes (300,000 ms) have passed since order/payment
    const isWithinRefundWindow = orderTime && (currentTime - orderTime <= 300000);

    return statusOk && notAlreadyRefunded && isOnlinePayment && !hasRefundTicket && isWithinRefundWindow;
  };
  // Render Refund Request Modal
  const renderRefundRequest = () => {
    if (!activeRefundOrder) return null;

    return (
      <div className="refund-overlay">
        <div className="refund-container">
          <div className="refund-header">
            <h3>Request a Refund</h3>
            <button className="close-refund-button" onClick={closeRefundRequest}>
              <FaTimes />
            </button>
          </div>

          <RefundOrder
            order={activeRefundOrder}
            onRefundComplete={handleRefundComplete}
          />
        </div>
      </div>
    );
  };

  // Render Help Center
  const renderHelpCenter = () => {
    if (!activeHelpOrder) return null;

    // Check if there's an existing ticket for this order
    const existingTicket = activeHelpOrder.ticket;

    return (
      <div className="help-center-overlay">
        <div className="help-center-container">
          <div className="help-center-header">
            <h3>Help Center</h3>
            <button className="close-help-button" onClick={closeHelpCenter}>
              <FaTimes />
            </button>
          </div>

          <div className="help-center-order-info">
            <p>Order #{activeHelpOrder.id}</p>
            <p>Ordered on: {formatDate(activeHelpOrder.orderDate)}</p>
            <div className="order-status-badge" style={{ backgroundColor: getStatusColor(activeHelpOrder.status) }}>
              {getStatusIcon(activeHelpOrder.status)} {activeHelpOrder.status || 'Processing'}
            </div>

            {/* Show ticket status if there's an existing ticket */}
            {existingTicket && (
              <div className="existing-ticket-info">
                <p>Support ticket: {getTicketStatusBadge(existingTicket.status, existingTicket.issueType)}</p>
                {existingTicket.hasNewResponses && (
                  <p className="new-responses-alert">
                    {existingTicket.responseCount} {existingTicket.responseCount === 1 ? 'response' : 'responses'} from support
                  </p>
                )}
              </div>
            )}
          </div>

          {submitSuccess ? (
            <div className="help-success-message">
              <h4>Thank you for reaching out!</h4>
              <p>Your request has been {existingTicket ? 'updated' : 'submitted'} successfully. Our team will get back to you within 24 hours.</p>
              <button className="close-help-button-success" onClick={closeHelpCenter}>
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Display admin responses when ticket details are loaded */}
              {loadingTicket ? (
                <div className="ticket-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading ticket details...</p>
                </div>
              ) : ticketDetails && ticketDetails.adminResponses && ticketDetails.adminResponses.length > 0 ? (
                <div className="admin-responses-section">
                  <h4>Responses from Support Team</h4>
                  <div className="admin-responses-list">
                    {ticketDetails.adminResponses.map((response, index) => (
                      <div key={index} className="admin-response-item">
                        <div className="response-header">
                          <span className="admin-name">{response.adminName || 'Support Team'}</span>
                          <span className="response-time">{formatResponseDate(response.timestamp)}</span>
                        </div>
                        <div className="response-content">
                          <p>{response.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="ticket-status-info">
                    <p>Current status: <strong>{ticketDetails.status === 'open' ? 'Open' :
                      ticketDetails.status === 'in-progress' ? 'In Progress' : 'Resolved'}</strong></p>
                    <p>Last updated: {formatDate(ticketDetails.lastUpdated)}</p>
                  </div>
                </div>
              ) : null}

              <div className="help-center-question">
                <h4>{ticketDetails && ticketDetails.adminResponses && ticketDetails.adminResponses.length > 0 ?
                  'Need more help with this order?' : 'What issue are you facing?'}</h4>

                <div className="help-issues-list">
                  {helpIssues.map(issue => (
                    <div
                      key={issue.id}
                      className={`help-issue-item ${selectedIssue && selectedIssue.id === issue.id ? 'selected' : ''}`}
                      onClick={() => selectIssue(issue)}
                    >
                      {issue.title}
                    </div>
                  ))}
                </div>

                {selectedIssue && (
                  <div className="help-solution">
                    <h5>{selectedIssue.title}</h5>
                    <p>{selectedIssue.solution}</p>
                  </div>
                )}

                <div className="help-note-section">
                  <h4>
                    {ticketDetails && ticketDetails.adminResponses && ticketDetails.adminResponses.length > 0 ?
                      'Add a reply to support team' :
                      `Add a note ${existingTicket ? '(update your ticket)' : '(optional)'}`}
                  </h4>
                  <textarea
                    className="help-note-input"
                    placeholder={ticketDetails && ticketDetails.adminResponses && ticketDetails.adminResponses.length > 0 ?
                      "Reply to the support team with additional information..." :
                      "Describe your issue in detail or add any specific information..."}
                    value={customerNote}
                    onChange={handleNoteChange}
                    rows={4}
                  ></textarea>

                  <button
                    className="submit-help-button"
                    onClick={submitHelpRequest}
                    disabled={isSubmitting || (!selectedIssue && !customerNote.trim() && !existingTicket)}
                  >
                    {isSubmitting ? 'Submitting...' :
                      ticketDetails && ticketDetails.adminResponses && ticketDetails.adminResponses.length > 0 ?
                        'Send Reply' : existingTicket ? 'Update Request' : 'Submit Request'} <FaPaperPlane />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Render previous orders section
  const renderPreviousOrders = () => {
    if (isLoadingOrders) {
      return <div className="loading-orders">Loading your previous orders...</div>;
    }

    if (!currentUser) {
      return <div className="no-previous-orders">Please sign in to view your order history.</div>;
    }

    if (previousOrders.length === 0) {
      return <div className="no-previous-orders">You don't have any previous orders.</div>;
    }

    return (
      <div className="previous-orders-list">
        {previousOrders.map((order) => (
          <div key={order.id} className="previous-order-item">
            <div className="previous-order-header">
              <div className="previous-order-info">
                <h4>Order #{order.id}</h4>
                <span className="previous-order-date">{formatDate(order.orderDate)}</span>
              </div>
              <div className="previous-order-total">
                ₹{order.totalAmount || 0}
              </div>
            </div>

            {/* Order Status Badge */}
            <div className="order-status-container">
              {order.status && (
                <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                  {(() => {
                    const { icon, displayText } = getStatusDisplay(order.status);
                    return (
                      <>
                        {icon} {displayText}
                      </>
                    );
                  })()}
                </div>
              )}
              {order.paymentMethod && (
                <div className="payment-method">
                  Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' :
                    order.paymentMethod === 'easebuzz' ? 'Online Payment' :
                      order.paymentMethod}
                </div>
              )}
              {order.paymentDetails && (
                <div className="payment-details">
                  {order.paymentDetails.paymentId && (
                    <small>Payment ID: {order.paymentDetails.paymentId}</small>
                  )}
                  {order.paymentTimestamp && (
                    <small>Paid on: {formatDate(order.paymentTimestamp)}</small>
                  )}
                </div>
              )}
            </div>

            {/* Show refund details if available */}
            {order.refundDetails && (
              <div className="order-refund-details">
                <div className="refund-info">
                  <span className="refund-label">Refund:</span>
                  {getRefundStatusBadge(order.status)}
                </div>
                <div className="refund-amount">
                  <span>Amount: ₹{order.refundDetails.amount}</span>
                  {order.refundDetails.requestedAt && (
                    <span className="refund-date">Requested: {formatDate(order.refundDetails.requestedAt)}</span>
                  )}
                </div>
                {order.refundDetails.reason && (
                  <div className="refund-reason">
                    <small>Reason: {order.refundDetails.reason}</small>
                  </div>
                )}
              </div>
            )}

            {/* Show ticket status if exists */}
            {order.ticket && (
              <div className="order-ticket-status">
                <div className="ticket-info">
                  <span className="ticket-label">
                    {order.ticket.issueType === 'Refund Request' ? 'Refund Request:' : 'Support Ticket:'}
                  </span>
                  {getTicketStatusBadge(order.ticket.status, order.ticket.issueType)}
                </div>
                {order.ticket.hasNewResponses && (
                  <div className="ticket-responses">
                    <span className="new-response-indicator">
                      {order.ticket.responseCount} {order.ticket.responseCount === 1 ? 'response' : 'responses'} from support
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="previous-order-items">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="previous-order-item-detail">
                  <span className="previous-item-name">{item.name || 'Unknown Item'} × {item.quantity || 1}</span>
                  <span className="previous-item-price">₹{(item.price || 0) * (item.quantity || 1)}</span>
                </div>
              ))}
            </div>

            <div className="order-action-buttons">
              <button
                className={`help-center-button ${order.ticket ? 'has-ticket' : ''}`}
                onClick={() => openHelpCenter(order)}
              >
                <FaHeadset /> {order.ticket ? 'View Support Ticket' : 'Help Center'}
              </button>

              {/* Add Refund Request button */}
              {/* {isRefundAvailable(order) && (
                <button
                  className="refund-request-button"
                  onClick={() => openRefundRequest(order)}
                >
                  <FaUndo /> Request Refund
                </button>
              )} */}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-container">
          <div className="empty-cart-icon">
            <FaShoppingCart />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="continue-shopping-button">
            Start Shopping
          </Link>

          {/* Display previous orders even when cart is empty */}
          <div className="previous-orders-section">
            <button
              className="toggle-previous-orders-button"
              onClick={togglePreviousOrders}
            >
              <FaHistory /> {showPreviousOrders ? 'Hide Previous Orders' : 'View Previous Orders'}
            </button>

            {showPreviousOrders && renderPreviousOrders()}
          </div>
        </div>

        {/* Render Help Center if active */}
        {renderHelpCenter()}

        {/* Render Refund Request if active */}
        {renderRefundRequest()}
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <Link to="/" className="back-to-shopping">
            <FaArrowLeft /> Continue Shopping
          </Link>
          <h1>Your Cart ({cart.length} items)</h1>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} onError={(e) => (e.target.src = 'https://via.placeholder.com/100?text=No+Image')} />
                </div>

                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>

                  <div className="cart-item-specs">
                    {item.weight && <span>{item.weight}</span>}
                    {item.pieces && <span>{item.pieces}</span>}
                  </div>

                  <div className="cart-item-price">
                    <span className="current-price">₹{item.price}</span>
                    {item.originalPrice > item.price && (
                      <>
                        <span className="original-price">₹{item.originalPrice}</span>
                        <span className="discount">{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="cart-item-quantity">
                  <div className="quantity-controls">
                    <button
                      className="quantity-button"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-button"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <div className="cart-item-subtotal">
                  ₹{item.price * item.quantity}
                </div>

                <button
                  className="remove-item-button"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}

            <button className="clear-cart-button" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            {/* <div className="coupon-code">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
              />
              <button
                className="apply-coupon-button"
                onClick={handleCouponApply}
                disabled={couponApplied || !couponCode}
              >
                Apply
              </button>
            </div> */}

            {couponApplied && (
              <div className="applied-coupon">
                <span className="coupon-badge">FRESH20</span>
                <span className="coupon-info">20% discount applied</span>
              </div>
            )}

            <div className="summary-item">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>

            {discount > 0 && (
              <div className="summary-item discount">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="summary-item total">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <div className="delivery-note">
              <p>Delivery within 30-40 minutes</p>
            </div>
          </div>
        </div>

        {/* Previous Orders Section */}
        <div className="previous-orders-section">
          <button
            className="toggle-previous-orders-button"
            onClick={togglePreviousOrders}
          >
            <FaHistory /> {showPreviousOrders ? 'Hide Previous Orders' : 'View Previous Orders'}
          </button>

          {showPreviousOrders && renderPreviousOrders()}
        </div>
      </div>

      {/* Render Help Center if active */}
      {renderHelpCenter()}

      {/* Render Refund Request if active */}
      {renderRefundRequest()}
    </div>
  );
};

export default Cart;