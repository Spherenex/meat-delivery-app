




// // src/pages/OrderConfirmation.js
// import React, { useEffect, useState } from 'react';
// import { useLocation, Link, useNavigate } from 'react-router-dom';
// import '../styles/pages/OrderConfirmation.css';
// import { FaCheckCircle, FaHome, FaFileAlt } from 'react-icons/fa';
// import { db } from '../firebase/config'; // Using your existing db reference
// import { ref, set } from 'firebase/database';

// const OrderConfirmation = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { orderId, orderData } = location.state || {};
//   const [saveStatus, setSaveStatus] = useState({ done: false, error: null });
  
//   // Save order to Firebase on component mount
//   useEffect(() => {
//     if (orderId && orderData) {
//       const saveOrderToFirebase = async () => {
//         try {
//           // Create a reference to the orders collection with the orderId as the key
//           const orderRef = ref(db, `orders/${orderId}`);
          
//           // Save the order data to Firebase
//           await set(orderRef, {
//             ...orderData,
//             orderDate: orderData.orderDate || new Date().toISOString()
//           });
          
//           setSaveStatus({ done: true, error: null });
//         } catch (error) {
//           console.error('Error saving order to Firebase:', error);
//           setSaveStatus({ done: true, error: error.message });
//         }
//       };
      
//       saveOrderToFirebase();
//     }
//   }, [orderId, orderData]);
  
//   // If no order data, redirect to home
//   if (!orderId || !orderData) {
//     return (
//       <div className="no-order-data">
//         <h2>No order information found</h2>
//         <p>Please return to the homepage and try again.</p>
//         <Link to="/" className="home-button">
//           Back to Home
//         </Link>
//       </div>
//     );
//   }
  
//   // Format date
//   const orderDate = new Date(orderData.orderDate);
//   const formattedDate = orderDate.toLocaleDateString('en-IN', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });
  
//   // Estimated delivery time (30-40 minutes from order time)
//   const deliveryTime = new Date(orderDate.getTime() + 40 * 60000);
//   const formattedDeliveryTime = deliveryTime.toLocaleTimeString('en-IN', {
//     hour: '2-digit',
//     minute: '2-digit'
//   });
  
//   return (
//     <div className="order-confirmation-page">
//       <div className="confirmation-container">
//         <div className="confirmation-header">
//           <div className="success-icon">
//             <FaCheckCircle />
//           </div>
          
//           <h1>Order Confirmed!</h1>
//           <p className="confirmation-message">
//             Thank you for your order. Your order has been received and is being processed.
//           </p>
          
//           {saveStatus.error && (
//             <p className="error-message">
//               Note: There was an issue saving your order details, but your order is still being processed.
//             </p>
//           )}
//         </div>
        
//         <div className="order-details">
//           <div className="order-detail-item">
//             <span className="detail-label">Order ID:</span>
//             <span className="detail-value">{orderId}</span>
//           </div>
          
//           <div className="order-detail-item">
//             <span className="detail-label">Order Date:</span>
//             <span className="detail-value">{formattedDate}</span>
//           </div>
          
//           <div className="order-detail-item">
//             <span className="detail-label">Expected Delivery:</span>
//             <span className="detail-value">Today by {formattedDeliveryTime}</span>
//           </div>
          
//           <div className="order-detail-item">
//             <span className="detail-label">Delivery Address:</span>
//             <span className="detail-value address">
//               {orderData.customer.fullName}<br />
//               {orderData.customer.address}<br />
//               {orderData.customer.city}, {orderData.customer.pincode}
//             </span>
//           </div>
          
//           <div className="order-detail-item">
//             <span className="detail-label">Payment Method:</span>
//             <span className="detail-value">
//               {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
//             </span>
//           </div>
//         </div>
        
//         <div className="order-summary-box">
//           <h2>Order Summary</h2>
          
//           <div className="summary-items">
//             {orderData.items.map(item => (
//               <div key={item.id} className="summary-item">
//                 <div className="item-details">
//                   <span className="item-name">{item.name}</span>
//                   <span className="item-quantity">x{item.quantity}</span>
//                 </div>
//                 <span className="item-price">₹{item.price * item.quantity}</span>
//               </div>
//             ))}
//           </div>
          
//           <div className="summary-totals">
//             <div className="total-row">
//               <span>Subtotal</span>
//               <span>₹{orderData.subtotal}</span>
//             </div>
//             <div className="total-row">
//               <span>Delivery Fee</span>
//               <span>{orderData.deliveryCharge === 0 ? 'FREE' : `₹${orderData.deliveryCharge}`}</span>
//             </div>
//             <div className="total-row">
//               <span>Tax</span>
//               <span>₹{orderData.tax}</span>
//             </div>
//             <div className="total-row grand-total">
//               <span>Total</span>
//               <span>₹{orderData.totalAmount}</span>
//             </div>
//           </div>
//         </div>
        
//         <div className="confirmation-actions">
//           <Link to="/" className="action-button home-button">
//             <FaHome /> Continue Shopping
//           </Link>
//           <Link to={`/orders/${orderId}`} className="action-button track-button">
//             <FaFileAlt /> Track Order
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmation;




// src/pages/OrderConfirmation.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../styles/pages/OrderConfirmation.css';
import { FaCheckCircle, FaHome, FaFileAlt } from 'react-icons/fa';
import { db } from '../firebase/config'; // Using your existing db reference
import { ref, set } from 'firebase/database';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, orderData } = location.state || {};
  const [saveStatus, setSaveStatus] = useState({ done: false, error: null });
  
  // Save order to Firebase on component mount
  useEffect(() => {
    if (orderId && orderData) {
      const saveOrderToFirebase = async () => {
        try {
          // Create a reference to the orders collection with the orderId as the key
          const orderRef = ref(db, `orders/${orderId}`);
          
          // Save the order data to Firebase
          await set(orderRef, {
            ...orderData,
            orderDate: orderData.orderDate || new Date().toISOString()
          });
          
          setSaveStatus({ done: true, error: null });
        } catch (error) {
          console.error('Error saving order to Firebase:', error);
          setSaveStatus({ done: true, error: error.message });
        }
      };
      
      saveOrderToFirebase();
    }
  }, [orderId, orderData]);
  
  // If no order data, redirect to home
  if (!orderId || !orderData) {
    return (
      <div className="no-order-data">
        <h2>No order information found</h2>
        <p>Please return to the homepage and try again.</p>
        <Link to="/" className="home-button">
          Back to Home
        </Link>
      </div>
    );
  }
  
  // Format date
  const orderDate = new Date(orderData.orderDate);
  const formattedDate = orderDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Estimated delivery time (30-40 minutes from order time)
  const deliveryTime = new Date(orderDate.getTime() + 40 * 60000);
  const formattedDeliveryTime = deliveryTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          
          <h1>Order Confirmed!</h1>
          <p className="confirmation-message">
            Thank you for your order. Your order has been received and is being processed.
          </p>
          
          {saveStatus.error && (
            <p className="error-message">
              Note: There was an issue saving your order details, but your order is still being processed.
            </p>
          )}
        </div>
        
        <div className="order-details">
          <div className="order-detail-item">
            <span className="detail-label">Order ID:</span>
            <span className="detail-value">{orderId}</span>
          </div>
          
          <div className="order-detail-item">
            <span className="detail-label">Order Date:</span>
            <span className="detail-value">{formattedDate}</span>
          </div>
          
          <div className="order-detail-item">
            <span className="detail-label">Expected Delivery:</span>
            <span className="detail-value">Today by {formattedDeliveryTime}</span>
          </div>
          
          <div className="order-detail-item">
            <span className="detail-label">Delivery Address:</span>
            <span className="detail-value address">
              {orderData.customer.fullName}<br />
              {orderData.customer.address}<br />
              {orderData.customer.city}, {orderData.customer.pincode}
            </span>
          </div>
          
          <div className="order-detail-item">
            <span className="detail-label">Payment Method:</span>
            <span className="detail-value">
              {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}
            </span>
          </div>
        </div>
        
        <div className="order-summary-box">
          <h2>Order Summary</h2>
          
          <div className="summary-items">
            {orderData.items.map(item => (
              <div key={item.id} className="summary-item">
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>₹{orderData.subtotal}</span>
            </div>
            <div className="total-row">
              <span>Delivery Fee</span>
              <span>{orderData.deliveryCharge === 0 ? 'FREE' : `₹${orderData.deliveryCharge}`}</span>
            </div>
            <div className="total-row">
              <span>Tax</span>
              <span>₹{orderData.tax}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>₹{orderData.totalAmount}</span>
            </div>
          </div>
        </div>
        
        <div className="confirmation-actions">
          <Link to="/" className="action-button home-button">
            <FaHome /> Continue Shopping
          </Link>
          <Link to={`/orders/${orderId}`} className="action-button track-button">
            <FaFileAlt /> Track Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;