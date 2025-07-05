import React, { useState } from 'react';
import { db } from '../firebase/config';
import { ref, update, push, set, query, orderByChild, equalTo, get } from 'firebase/database';
import '../styles/components/RefundOrder.css';

const RefundOrder = ({ order, onRefundComplete }) => {
  // Hooks must be called unconditionally at the top level
  const [reason, setReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(order?.totalAmount || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Early return if no order is provided to prevent the error
  if (!order || !order.totalAmount) {
    return null;
  }

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleAmountChange = (e) => {
    const amount = parseFloat(e.target.value);
    // Ensure amount doesn't exceed the order total
    if (amount > order.totalAmount) {
      setRefundAmount(order.totalAmount);
    } else {
      setRefundAmount(amount);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!reason) {
      setError('Please provide a reason for the refund request.');
      return;
    }

    if (refundAmount <= 0) {
      setError('Refund amount must be greater than zero.');
      return;
    }

    setIsSubmitting(true);

    try {
      // First check if there's already a refund ticket for this order
      const helpRef = ref(db, 'help');
      const orderTicketQuery = query(helpRef, orderByChild('orderId'), equalTo(order.id));
      const existingTicketSnapshot = await get(orderTicketQuery);
      
      let existingRefundTicket = null;
      
      // Look for an existing refund ticket
      if (existingTicketSnapshot.exists()) {
        existingTicketSnapshot.forEach((childSnapshot) => {
          const ticketData = childSnapshot.val();
          if (ticketData.issueType === 'Refund Request') {
            existingRefundTicket = {
              id: childSnapshot.key,
              ...ticketData
            };
          }
        });
      }

      // Create refund details object
      const refundDetails = {
        amount: refundAmount,
        reason: reason,
        requestedBy: order.customer?.email || 'Customer',
        requestedAt: new Date().toISOString()
      };

      // Update the order status to refund-pending
      const orderRef = ref(db, `orders/${order.id}`);
      await update(orderRef, {
        status: 'refund-pending',
        refundDetails: refundDetails,
        refundTimestamp: new Date().toISOString()
      });

      // If there's an existing refund ticket, update it instead of creating a new one
      if (existingRefundTicket) {
        const ticketRef = ref(db, `help/${existingRefundTicket.id}`);
        
        // Update the existing ticket
        await update(ticketRef, {
          lastUpdated: new Date().toISOString(),
          status: 'open', // Reopen if it was closed
          customerNote: `Updated refund request for ₹${refundAmount} - Reason: ${reason}`,
          customerNotes: [
            ...(existingRefundTicket.customerNotes || []),
            {
              text: `Updated refund request for ₹${refundAmount} - Reason: ${reason}`,
              timestamp: new Date().toISOString()
            }
          ],
          refundDetails: refundDetails
        });
        
        console.log('Existing refund ticket updated:', existingRefundTicket.id);
      } else {
        // Create a new support ticket for this refund request
        const newHelpRef = push(helpRef);
        
        // Get customer information from the order
        const customerInfo = order.customer || {};
        
        // Prepare ticket data with refund details
        const helpData = {
          orderId: order.id,
          orderDate: order.orderDate,
          issueType: 'Refund Request',  // This will appear in the admin panel
          customerNote: `Refund request for ₹${refundAmount} - Reason: ${reason}`,
          submittedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          status: 'open',
          items: order.items || [],
          customer: {
            userId: customerInfo.userId || null,
            fullName: customerInfo.fullName || 'Anonymous Customer',
            email: customerInfo.email || '',
            phone: customerInfo.phone || '',
            address: customerInfo.address || ''
          },
          adminResponses: [],
          customerNotes: [{
            text: `Refund requested for ₹${refundAmount}. Reason: ${reason}`,
            timestamp: new Date().toISOString()
          }],
          refundDetails: {
            amount: refundAmount,
            reason: reason,
            status: 'pending',
            requestedAt: new Date().toISOString()
          }
        };
        
        // Save to Firebase
        await set(newHelpRef, helpData);
        console.log('New refund support ticket created:', newHelpRef.key);
      }

      setSuccess(true);
      
      // Notify parent component about the successful refund request
      setTimeout(() => {
        if (onRefundComplete) {
          onRefundComplete({
            amount: refundAmount,
            reason: reason
          });
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error requesting refund:', error);
      setError('Failed to submit refund request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="refund-order-container">
      <h3>Request Refund</h3>
      
      {success ? (
        <div className="refund-success">
          <p>Your refund request has been submitted successfully!</p>
          <p>Our team will review your request and process it within 3-5 business days.</p>
          <p>You can track the status of your request in your order history.</p>
        </div>
      ) : (
        <form className="refund-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="refundReason">Reason for Refund:</label>
            <select 
              id="refundReason" 
              value={reason} 
              onChange={handleReasonChange}
              required
            >
              <option value="">Select a reason</option>
              <option value="Quality Issues">Quality Issues</option>
              <option value="Late Delivery">Late Delivery</option>
              <option value="Wrong Items">Wrong Items Delivered</option>
              <option value="Missing Items">Missing Items</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="refundAmount">Refund Amount (₹):</label>
            <input 
              type="number" 
              id="refundAmount" 
              value={refundAmount} 
              onChange={handleAmountChange}
              min="1" 
              max={order.totalAmount} 
              step="1"
              required
            />
            <small>Maximum refund amount: ₹{order.totalAmount}</small>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-refund-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Request Refund'}
            </button>
            <button 
              type="button" 
              className="cancel-refund-button"
              onClick={onRefundComplete}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RefundOrder;