// import React, { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ref, update, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/components/PaymentResult.css';

// const PaymentFailure = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
  
//   useEffect(() => {
//     // Extract order ID from the query params
//     const txnid = queryParams.get('txnid');
    
//     if (txnid) {
//       // Update order status in Firebase
//       updateOrderStatus(txnid, 'payment-failed');
//     }
//   }, [queryParams]);
  
//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       // Find the order in Firebase by the transaction ID
//       const orderRef = ref(db, `orders/${orderId}`);
      
//       // Get the current order data
//       const orderSnapshot = await get(orderRef);
      
//       if (orderSnapshot.exists()) {
//         // Update the order status
//         await update(orderRef, { status: status });
//         console.log('Order status updated successfully');
//       } else {
//         console.error('Order not found with ID:', orderId);
//       }
//     } catch (error) {
//       console.error('Error updating order status:', error);
//     }
//   };
  
//   const handleTryAgain = () => {
//     navigate('/checkout');
//   };
  
//   return (
//     <div className="payment-result-page failure">
//       <div className="result-container">
//         <div className="result-icon">✗</div>
//         <h1>Payment Failed</h1>
        
//         <div className="transaction-details">
//           <p><strong>Transaction ID:</strong> {queryParams.get('txnid') || 'N/A'}</p>
//           <p><strong>Error:</strong> {queryParams.get('error_Message') || 'Transaction failed'}</p>
//         </div>
        
//         <p className="result-message">
//           Your payment was unsuccessful. Please try again or choose a different payment method.
//         </p>
        
//         <button 
//           className="try-again-button"
//           onClick={handleTryAgain}
//         >
//           Try Again
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentFailure;


import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ref, update, get } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/components/PaymentResult.css';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [updateStatus, setUpdateStatus] = useState({loading: true, success: false, message: ''});
  
  useEffect(() => {
    const processFailedPayment = async () => {
      try {
        // Extract order ID from the query params
        const txnid = queryParams.get('txnid');
        
        if (!txnid) {
          console.error('No transaction ID found in redirect URL');
          setUpdateStatus({
            loading: false, 
            success: false, 
            message: 'Transaction ID missing from payment response'
          });
          return;
        }
        
        console.log('Payment failed - received transaction ID:', txnid);
        console.log('Payment failure parameters:', Object.fromEntries(queryParams));
        
        // Try to update the order
        const updated = await updateOrderStatus(txnid, 'payment-failed');
        
        setUpdateStatus({
          loading: false,
          success: updated,
          message: updated ? 'Order updated successfully' : 'Order found but update failed'
        });
      } catch (error) {
        console.error('Error processing payment failure:', error);
        setUpdateStatus({
          loading: false,
          success: false,
          message: `Error: ${error.message}`
        });
      }
    };
    
    processFailedPayment();
  }, [queryParams]);
  
  const updateOrderStatus = async (orderId, status) => {
    try {
      console.log(`Attempting to update order ${orderId} to ${status}`);
      
      // APPROACH 1: Direct lookup with the transaction ID
      const directOrderRef = ref(db, `orders/${orderId}`);
      const directSnapshot = await get(directOrderRef);
      
      if (directSnapshot.exists()) {
        console.log('Found order with direct lookup');
        
        // Update the order status
        await update(directOrderRef, { 
          status: status,
          paymentTimestamp: new Date().toISOString(),
          paymentDetails: {
            errorMessage: queryParams.get('error_Message') || '',
            status: 'failed'
          }
        });
        console.log('Order status updated successfully (direct match)');
        return true;
      }
      // Add this after the order status update
      localStorage.setItem('forceRefreshCart', 'true');
      // APPROACH 2: Search all orders to find a matching one
      console.log('Direct lookup failed, trying to search all orders...');
      const ordersRef = ref(db, 'orders');
      const snapshot = await get(ordersRef);
      
      if (snapshot.exists()) {
        let updated = false;
        
        // List all order IDs for debugging
        console.log('Available orders:', Object.keys(snapshot.val()));
        
        // Check each order
        snapshot.forEach((childSnapshot) => {
          const orderKey = childSnapshot.key;
          const orderData = childSnapshot.val();
          
          // Check if any field might match our transaction ID
          if (
            orderKey === orderId || 
            orderData.txnid === orderId ||
            (orderData.paymentDetails && orderData.paymentDetails.txnid === orderId)
          ) {
            console.log(`Found matching order: ${orderKey}`);
            
            // Update this order
            const matchRef = ref(db, `orders/${orderKey}`);
            update(matchRef, { 
              status: status,
              paymentTimestamp: new Date().toISOString(),
              paymentDetails: {
                errorMessage: queryParams.get('error_Message') || '',
                status: 'failed'
              }
            });
            
            console.log('Order updated successfully (search match)');
            updated = true;
          }
        });
        
        return updated;
      } else {
        console.error('No orders found in database');
        return false;
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };
  
  const handleTryAgain = () => {
    navigate('/checkout');
  };
  
  const handleViewCart = () => {
    navigate('/cart');
  };
  
  // Show loading state while updating
  if (updateStatus.loading) {
    return (
      <div className="payment-result-page loading">
        <div className="result-container">
          <div className="loading-spinner"></div>
          <h2>Processing your payment result...</h2>
          <p>Please wait while we update your order.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="payment-result-page failure">
      <div className="result-container">
        <div className="result-icon">✗</div>
        <h1>Payment Failed</h1>
        
        <div className="transaction-details">
          <p><strong>Transaction ID:</strong> {queryParams.get('txnid') || 'N/A'}</p>
          <p><strong>Error:</strong> {queryParams.get('error_Message') || 'Transaction failed'}</p>
          {!updateStatus.success && (
            <p className="update-status-warning">
              <strong>Note:</strong> {updateStatus.message}
            </p>
          )}
        </div>
        
        <p className="result-message">
          Your payment was unsuccessful. Please try again or choose a different payment method.
        </p>
        
        <div className="button-container">
          <button 
            className="view-cart-button"
            onClick={handleViewCart}
          >
            View Cart
          </button>
          
          <button 
            className="try-again-button"
            onClick={handleTryAgain}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;