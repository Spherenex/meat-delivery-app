// import express from 'express';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import crypto from 'crypto';
// import { fileURLToPath } from 'url';
// import path from 'path';
// import dotenv from 'dotenv';

// // ES Modules equivalent of __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load environment variables
// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Debug route to check environment variables
// app.get('/api/check-env', (req, res) => {
//   const keyPreview = process.env.EASEBUZZ_KEY ? 
//     `${process.env.EASEBUZZ_KEY.substring(0, 3)}...` : 'Not set';
//   const saltPreview = process.env.EASEBUZZ_SALT ? 
//     `${process.env.EASEBUZZ_SALT.substring(0, 3)}...` : 'Not set';

//   res.json({
//     key_status: process.env.EASEBUZZ_KEY ? 'Set' : 'Not set',
//     salt_status: process.env.EASEBUZZ_SALT ? 'Set' : 'Not set',
//     key_preview: keyPreview,
//     salt_preview: saltPreview
//   });
// });

// // Replace the payment initiation endpoint in your server.js file
// app.post('/api/initiate-payment', async (req, res) => {
//   try {
//     console.log('Received payment request:', req.body);

//     // Extract the fields from request body
//     const { amount, name, email, phone, orderId, productinfo } = req.body;

//     // Validate required fields
//     if (!amount || !name || !email || !phone) {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Missing required fields: amount, name, email, or phone'
//       });
//     }

//     // Format values correctly - Easebuzz is strict about formats
//     const formattedAmount = parseFloat(amount).toFixed(2);

//     // Ensure productinfo is a simple, safe string without special characters
//     // Limit to 100 characters and replace any problematic characters
//     const safeProductInfo = (productinfo || 'Food Order')
//       .replace(/[^\w\s]/gi, '') // Remove special characters
//       .trim()
//       .substring(0, 100); // Limit length

//     // Use the provided orderId or generate a unique transaction ID
//     const txnid = orderId || `ORDER${Date.now()}`;

//     // Get Easebuzz credentials
//     const key = process.env.EASEBUZZ_KEY || '2PBP7IABZ2';
//     const salt = process.env.EASEBUZZ_SALT || 'DAH88E3UWQ';

//     if (!key || !salt) {
//       console.error('Missing Easebuzz credentials');
//       return res.status(500).json({ 
//         status: 0, 
//         msg: 'Missing payment gateway credentials'
//       });
//     }

//     // Create payment data with EXACT field names required by Easebuzz
//     const paymentData = {
//       key,
//       txnid,
//       amount: formattedAmount,
//       firstname: name,
//       email,
//       phone,
//       productinfo: safeProductInfo, // Using the sanitized product info
//       surl: 'http://localhost:3001/payment-success',
//       furl: 'http://localhost:3001/payment-failure',
//       udf1: '',
//       udf2: '',
//       udf3: '',
//       udf4: '',
//       udf5: '',
//     };

//     // Generate hash according to Easebuzz's specification
//     const hashString = key + '|' + txnid + '|' + formattedAmount + '|' + safeProductInfo + 
//                       '|' + name + '|' + email + '|' + '' + '|' + '' + '|' + '' + 
//                       '|' + '' + '|' + '' + '|' + '' + '|' + '' + '|' + '' + '|' + 
//                       '' + '|' + '' + '|' + salt;

//     console.log('Hash string:', hashString);

//     // Generate SHA512 hash
//     const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
//     console.log('Generated hash:', hash);

//     // Add hash to payment data
//     paymentData.hash = hash;

//     // Log full payment data for debugging
//     console.log('Full payment data:', paymentData);

//     res.json({
//       status: 1,
//       data: paymentData,
//       msg: 'Payment data generated successfully'
//     });
//   } catch (error) {
//     console.error('Payment initiation error:', error);
//     res.status(500).json({ 
//       status: 0, 
//       msg: 'Payment initiation failed: ' + error.message
//     });
//   }
// });

// // In production, serve the static Vite build
// if (process.env.NODE_ENV === 'production') {
//   // Serve static files
//   app.use(express.static(path.join(__dirname, 'dist')));

//   // For any request that doesn't match an API route, serve the Vite app
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
//   });
// }

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log('Environment variables status:');
//   console.log(`- EASEBUZZ_KEY: ${process.env.EASEBUZZ_KEY ? 'Set' : 'NOT SET'}`);
//   console.log(`- EASEBUZZ_SALT: ${process.env.EASEBUZZ_SALT ? 'Set' : 'NOT SET'}`);
// });



// Required dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Initialize Firebase Admin SDK with better error handling
const admin = require('firebase-admin');

// Find Firebase service account file
let serviceAccountPath = '';
const possiblePaths = [
  // Try different relative paths
  './zappcart-control-panel-firebase-adminsdk-fbsvc-2c4f4c341b.json',
  '../zappcart-control-panel-firebase-adminsdk-fbsvc-2c4f4c341b.json',
  '../../zappcart-control-panel-firebase-adminsdk-fbsvc-2c4f4c341b.json',
  // Try absolute path from project root
  path.join(process.cwd(), 'zappcart-control-panel-firebase-adminsdk-fbsvc-2c4f4c341b.json'),
  // Try finding any file matching the pattern
  ...findServiceAccountFiles()
];

function findServiceAccountFiles() {
  const foundPaths = [];
  try {
    // Look in current directory
    const files = fs.readdirSync('.');
    files.forEach(file => {
      if (file.includes('firebase-adminsdk') && file.endsWith('.json')) {
        foundPaths.push(`./${file}`);
      }
    });

    // Look in parent directory
    const parentFiles = fs.readdirSync('..');
    parentFiles.forEach(file => {
      if (file.includes('firebase-adminsdk') && file.endsWith('.json')) {
        foundPaths.push(`../${file}`);
      }
    });
  } catch (err) {
    console.error('Error searching for service account file:', err);
  }
  return foundPaths;
}

// Try each path until we find the file
for (const testPath of possiblePaths) {
  try {
    if (fs.existsSync(testPath)) {
      serviceAccountPath = testPath;
      console.log(`Found Firebase service account at: ${testPath}`);
      break;
    }
  } catch (err) {
    // Continue to next path
  }
}

// Initialize Firebase Admin if we found the service account
let firebaseInitialized = false;
try {
  if (serviceAccountPath) {
    const serviceAccount = require(serviceAccountPath);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://zappcart-control-panel-default-rtdb.firebaseio.com/"
      });
      console.log("Firebase Admin SDK initialized successfully");
      firebaseInitialized = true;
    }
  } else {
    console.error("Could not find Firebase service account file. Please place it in the same directory as Server.js");
  }
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
}

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    firebase: firebaseInitialized ? 'connected' : 'not connected'
  });
});

// Debug route to check environment variables
app.get('/api/check-env', (req, res) => {
  const keyPreview = process.env.EASEBUZZ_KEY ?
    `${process.env.EASEBUZZ_KEY.substring(0, 3)}...` : 'Not set';
  const saltPreview = process.env.EASEBUZZ_SALT ?
    `${process.env.EASEBUZZ_SALT.substring(0, 3)}...` : 'Not set';

  res.json({
    key_status: process.env.EASEBUZZ_KEY ? 'Set' : 'Not set',
    salt_status: process.env.EASEBUZZ_SALT ? 'Set' : 'Not set',
    key_preview: keyPreview,
    salt_preview: saltPreview,
    firebase: firebaseInitialized ? 'connected' : 'not connected',
    serviceAccountPath: serviceAccountPath || 'Not found'
  });
});

// Payment success handler
app.post('/payment-success', (req, res) => {
  console.log('Payment success POST received:', req.body);

  // Extract the transaction ID
  const txnid = req.body.txnid;

  if (txnid) {
    // Check if Firebase is initialized
    if (firebaseInitialized) {
      try {
        const db = admin.database();
        const orderRef = db.ref(`orders/${txnid}`);

        orderRef.once('value', snapshot => {
          if (snapshot.exists()) {
            // Update the order status
            orderRef.update({
              status: 'payment-completed',
              paymentTimestamp: new Date().toISOString(),
              paymentDetails: {
                amount: req.body.amount || '',
                paymentId: req.body.easepayid || '',
                mode: req.body.mode || '',
                status: 'success'
              }
            }).then(() => {
              console.log(`Order ${txnid} updated to payment-completed`);

              // Redirect to the frontend with the data as query params
              const queryParams = new URLSearchParams();
              Object.entries(req.body).forEach(([key, value]) => {
                queryParams.append(key, value);
              });

              // res.redirect(`http://localhost:5001/payment-success?${queryParams.toString()}`);
              res.redirect(`${baseUrl}/payment-success?${queryParams.toString()}`);
            }).catch(error => {
              console.error('Error updating order:', error);
              res.redirect(`http://localhost:5001/payment-success?txnid=${txnid}&error=update_failed`);
            });
          } else {
            console.error(`Order ${txnid} not found`);
            res.redirect(`http://localhost:5001/payment-success?txnid=${txnid}&error=order_not_found`);
          }
        }, error => {
          console.error('Error fetching order:', error);
          res.redirect(`http://localhost:5001/payment-success?txnid=${txnid}&error=fetch_failed`);
        });
      } catch (error) {
        console.error('Firebase operation error:', error);
        res.redirect(`http://localhost:5001/payment-success?txnid=${txnid}&error=firebase_error`);
      }
    } else {
      // Firebase not initialized, just redirect
      console.log('Firebase not initialized, skipping database update');
      const queryParams = new URLSearchParams();
      Object.entries(req.body).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      res.redirect(`http://localhost:5001/payment-success?${queryParams.toString()}&warning=firebase_not_connected`);
    }
  } else {
    console.error('No transaction ID in payment response');
    res.redirect('http://localhost:5001/payment-success?error=no_txnid');
  }
});

// Payment failure handler
app.post('/payment-failure', (req, res) => {
  console.log('Payment failure POST received:', req.body);

  const txnid = req.body.txnid;

  if (txnid) {
    // Check if Firebase is initialized
    if (firebaseInitialized) {
      try {
        const db = admin.database();
        const orderRef = db.ref(`orders/${txnid}`);

        orderRef.once('value', snapshot => {
          if (snapshot.exists()) {
            orderRef.update({
              status: 'payment-failed',
              paymentTimestamp: new Date().toISOString(),
              paymentDetails: {
                errorMessage: req.body.error_Message || '',
                status: 'failed'
              }
            }).then(() => {
              console.log(`Order ${txnid} updated to payment-failed`);

              const queryParams = new URLSearchParams();
              Object.entries(req.body).forEach(([key, value]) => {
                queryParams.append(key, value);
              });

              // res.redirect(`http://localhost:5001/payment-failure?${queryParams.toString()}`);
              res.redirect(`${baseUrl}/payment-failure?${queryParams.toString()}`);
            }).catch(error => {
              console.error('Error updating order:', error);
              res.redirect(`http://localhost:5001/payment-failure?txnid=${txnid}&error=update_failed`);
            });
          } else {
            console.error(`Order ${txnid} not found`);
            res.redirect(`http://localhost:5001/payment-failure?txnid=${txnid}&error=order_not_found`);
          }
        }, error => {
          console.error('Error fetching order:', error);
          res.redirect(`http://localhost:5001/payment-failure?txnid=${txnid}&error=fetch_failed`);
        });
      } catch (error) {
        console.error('Firebase operation error:', error);
        res.redirect(`http://localhost:5001/payment-failure?txnid=${txnid}&error=firebase_error`);
      }
    } else {
      // Firebase not initialized, just redirect
      console.log('Firebase not initialized, skipping database update');
      const queryParams = new URLSearchParams();
      Object.entries(req.body).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      res.redirect(`http://localhost:5001/payment-failure?${queryParams.toString()}&warning=firebase_not_connected`);
    }
  } else {
    console.error('No transaction ID in payment response');
    res.redirect('http://localhost:5001/payment-failure?error=no_txnid');
  }
});

// Payment initiation endpoint
app.post('/api/initiate-payment', async (req, res) => {
  try {
    console.log('Received payment request:', req.body);

    // Extract and validate required fields
    let { amount, name, email, phone, productInfo, orderId } = req.body;

    if (!amount || !name || !email || !phone) {
      console.error('Missing required fields:', { amount, name, email, phone });
      return res.status(400).json({
        status: 0,
        msg: 'Missing required fields: amount, name, email, or phone'
      });
    }

    // FORMAT FIX: Ensure all values exactly match required format

    // 1. Amount - must be string with exactly 2 decimal places
    const formattedAmount = parseFloat(amount).toFixed(2);

    // 2. Name - must be plain text without special characters
    const formattedName = name.trim().replace(/[^\w\s]/g, '');

    // 3. Email - must be standard email format
    const formattedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formattedEmail)) {
      return res.status(400).json({
        status: 0,
        msg: 'Invalid email format'
      });
    }

    // 4. Phone - must be exactly 10 digits
    const formattedPhone = phone.trim();
    if (!/^\d{10}$/.test(formattedPhone)) {
      return res.status(400).json({
        status: 0,
        msg: 'Phone must be exactly 10 digits'
      });
    }

    // 5. Use exact same productinfo as working demo
    const formattedProductInfo = "Test Product";

    // 6. Generate a unique transaction ID with prefix
    const txnid = orderId || `TXN${Date.now()}`;
    console.log('Using transaction ID:', txnid);

    // 7. Get Easebuzz credentials - use hardcoded test values if not in env
    const key = process.env.EASEBUZZ_KEY || '2PBP7IABZ2';
    const salt = process.env.EASEBUZZ_SALT || 'DAH88E3UWQ';

    if (!key || !salt) {
      console.error('Missing Easebuzz credentials');
      return res.status(500).json({
        status: 0,
        msg: 'Missing payment gateway credentials'
      });
    }

    // 8. Create payment data with exact field names required by Easebuzz
    const paymentData = {
      key,
      txnid,
      amount: formattedAmount,
      firstname: formattedName,
      email: formattedEmail,
      phone: formattedPhone,
      productinfo: formattedProductInfo,
      // Update these URLs to use the baseUrl variable
      surl: isProduction
        ? `${apiUrl}/payment-success`
        : 'http://localhost:5000/payment-success',
      furl: isProduction
        ? `${apiUrl}/payment-failure`
        : 'http://localhost:5000/payment-failure',
      udf1: '',
      udf2: '',
      udf3: '',
      udf4: '',
      udf5: '',
    };

    // 9. Log formatted values for debugging
    console.log('Formatted values for hash calculation:');
    console.log('- Amount:', formattedAmount);
    console.log('- Name:', formattedName);
    console.log('- Email:', formattedEmail);
    console.log('- Phone:', formattedPhone);
    console.log('- Product Info:', formattedProductInfo);
    console.log('- Transaction ID:', txnid);

    // 10. Generate hash string - EXACT format as working demo
    const hashString =
      key + '|' +
      txnid + '|' +
      formattedAmount + '|' +
      formattedProductInfo + '|' +
      formattedName + '|' +
      formattedEmail + '|' +
      '' + '|' +
      '' + '|' +
      '' + '|' +
      '' + '|' +
      '' + '|' +
      '' + '|' +
      '' + '|' +
      '' + '|' +
      '' + '|' +
      '' + '|' +
      salt;

    console.log('Hash string (first 50 chars):', hashString.substring(0, 50) + '...');

    // 11. Generate SHA512 hash
    const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
    console.log('Generated hash (first 10 chars):', hash.substring(0, 10) + '...');

    // 12. Add hash to payment data
    paymentData.hash = hash;

    // Success response
    res.json({
      status: 1,
      data: paymentData,
      msg: 'Payment data generated successfully'
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      status: 0,
      msg: 'Payment initiation failed: ' + error.message
    });
  }
});

// Refund API endpoint
app.post('/api/refund', async (req, res) => {
  try {
    const { txnid, refundAmount, reason } = req.body;

    if (!txnid || !refundAmount) {
      return res.status(400).json({
        status: 0,
        msg: 'Missing required fields: txnid or refundAmount'
      });
    }

    console.log(`Initiating refund for transaction: ${txnid}, amount: ${refundAmount}`);

    // Format the amount to 2 decimal places
    const formattedAmount = parseFloat(refundAmount).toFixed(2);

    // Get Easebuzz credentials
    const key = process.env.EASEBUZZ_KEY || '2PBP7IABZ2';
    const salt = process.env.EASEBUZZ_SALT || 'DAH88E3UWQ';

    // Prepare refund data
    const refundData = {
      key: key,
      txnid: txnid,
      refund_amount: formattedAmount,
      phone: '',  // Can be empty for refund
      email: '',  // Can be empty for refund
      amount: '0.00', // Original amount, use 0.00 for refund API
      merchant_email: '', // Optional
      refund_reason: reason || 'Customer requested refund'
    };

    // Generate hash for refund
    const hashString =
      key + '|' +
      txnid + '|' +
      formattedAmount + '|' +
      '' + '|' +
      '' + '|' +
      salt;

    const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
    refundData.hash = hash;

    // Call Easebuzz refund API
    const response = await fetch('https://testpay.easebuzz.in/transaction/v1/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(refundData)
    });

    if (!response.ok) {
      throw new Error(`Refund API responded with status: ${response.status}`);
    }

    const refundResponse = await response.json();
    console.log('Refund response:', refundResponse);

    // Update order status in Firebase if refund is successful
    if (refundResponse.status === 1 && firebaseInitialized) {
      try {
        const db = admin.database();
        const orderRef = db.ref(`orders/${txnid}`);

        await orderRef.update({
          status: 'refunded',
          refundTimestamp: new Date().toISOString(),
          refundDetails: {
            amount: formattedAmount,
            reason: reason || 'Customer requested refund',
            refundId: refundResponse.data?.refund_id || '',
            status: 'completed'
          }
        });

        console.log(`Order ${txnid} updated to refunded status`);
      } catch (error) {
        console.error('Error updating order refund status in Firebase:', error);
      }
    }

    // Return the refund response
    res.json(refundResponse);

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      status: 0,
      msg: 'Refund failed: ' + error.message
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables status:');
  console.log(`- EASEBUZZ_KEY: ${process.env.EASEBUZZ_KEY ? 'Set' : 'NOT SET'}`);
  console.log(`- EASEBUZZ_SALT: ${process.env.EASEBUZZ_SALT ? 'Set' : 'NOT SET'}`);
  console.log(`- Firebase Admin: ${firebaseInitialized ? 'Initialized' : 'NOT Initialized'}`);

  if (!firebaseInitialized) {
    console.log('\n===== FIREBASE ADMIN SETUP INSTRUCTIONS =====');
    console.log('To enable Firebase updates, place your service account JSON file in one of these locations:');
    for (const path of possiblePaths.slice(0, 3)) {
      console.log(`- ${path}`);
    }
    console.log('\nFile should be named: zappcart-control-panel-firebase-adminsdk-fbsvc-2c4f4c341b.json');
    console.log('You can download this file from the Firebase Console -> Project Settings -> Service Accounts');
    console.log('==========================================\n');
  }
});