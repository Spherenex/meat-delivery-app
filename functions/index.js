// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const crypto = require('crypto');

// // Initialize Firebase Admin
// admin.initializeApp();

// // Create Express app
// const app = express();

// // Middleware
// app.use(cors({ origin: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     message: 'Server is running',
//     firebase: 'connected'
//   });
// });

// // Debug route to check environment variables
// app.get('/api/check-env', (req, res) => {
//   const key = functions.config().easebuzz?.key || '2PBP7IABZ2';
//   const salt = functions.config().easebuzz?.salt || 'DAH88E3UWQ';
  
//   const keyPreview = key ?
//     `${key.substring(0, 3)}...` : 'Not set';
//   const saltPreview = salt ?
//     `${salt.substring(0, 3)}...` : 'Not set';

//   res.json({
//     key_status: key ? 'Set' : 'Not set',
//     salt_status: salt ? 'Set' : 'Not set',
//     key_preview: keyPreview,
//     salt_preview: saltPreview,
//     firebase: 'connected'
//   });
// });

// // Payment success handler
// app.post('/payment-success', async (req, res) => {
//   console.log('Payment success POST received:', req.body);
  
//   // Extract the transaction ID
//   const txnid = req.body.txnid;
  
//   if (txnid) {
//     try {
//       const db = admin.database();
//       const orderRef = db.ref(`orders/${txnid}`);
      
//       // Check if order exists
//       const snapshot = await orderRef.once('value');
      
//       if (snapshot.exists()) {
//         // Update the order status
//         await orderRef.update({
//           status: 'payment-completed',
//           paymentTimestamp: new Date().toISOString(),
//           paymentDetails: {
//             amount: req.body.amount || '',
//             paymentId: req.body.easepayid || '',
//             mode: req.body.mode || '',
//             status: 'success'
//           }
//         });
        
//         console.log(`Order ${txnid} updated to payment-completed`);
//       } else {
//         console.error(`Order ${txnid} not found`);
//       }
      
//       // Redirect to the frontend with the data as query params
//       const queryParams = new URLSearchParams();
//       Object.entries(req.body).forEach(([key, value]) => {
//         queryParams.append(key, value);
//       });
      
//       // IMPORTANT: For production, change to your actual app URL
//       const appUrl = 'https://zappcart-control-panel.web.app';
//       res.redirect(`${appUrl}/payment-success?${queryParams.toString()}`);
//     } catch (error) {
//       console.error('Firebase operation error:', error);
//       // IMPORTANT: For production, change to your actual app URL
//       const appUrl = 'https://zappcart-control-panel.web.app';
//       res.redirect(`${appUrl}/payment-success?txnid=${txnid}&error=firebase_error`);
//     }
//   } else {
//     console.error('No transaction ID in payment response');
//     // IMPORTANT: For production, change to your actual app URL
//     const appUrl = 'https://zappcart-control-panel.web.app';
//     res.redirect(`${appUrl}/payment-success?error=no_txnid`);
//   }
// });

// // Payment failure handler
// app.post('/payment-failure', async (req, res) => {
//   console.log('Payment failure POST received:', req.body);
  
//   const txnid = req.body.txnid;
  
//   if (txnid) {
//     try {
//       const db = admin.database();
//       const orderRef = db.ref(`orders/${txnid}`);
      
//       // Check if order exists
//       const snapshot = await orderRef.once('value');
      
//       if (snapshot.exists()) {
//         // Update the order status
//         await orderRef.update({
//           status: 'payment-failed',
//           paymentTimestamp: new Date().toISOString(),
//           paymentDetails: {
//             errorMessage: req.body.error_Message || '',
//             status: 'failed'
//           }
//         });
        
//         console.log(`Order ${txnid} updated to payment-failed`);
//       } else {
//         console.error(`Order ${txnid} not found`);
//       }
      
//       // Redirect to the frontend with the data as query params
//       const queryParams = new URLSearchParams();
//       Object.entries(req.body).forEach(([key, value]) => {
//         queryParams.append(key, value);
//       });
      
//       // IMPORTANT: For production, change to your actual app URL
//       const appUrl = 'https://zappcart-control-panel.web.app';
//       res.redirect(`${appUrl}/payment-failure?${queryParams.toString()}`);
//     } catch (error) {
//       console.error('Firebase operation error:', error);
//       // IMPORTANT: For production, change to your actual app URL
//       const appUrl = 'https://zappcart-control-panel.web.app';
//       res.redirect(`${appUrl}/payment-failure?txnid=${txnid}&error=firebase_error`);
//     }
//   } else {
//     console.error('No transaction ID in payment response');
//     // IMPORTANT: For production, change to your actual app URL
//     const appUrl = 'https://zappcart-control-panel.web.app';
//     res.redirect(`${appUrl}/payment-failure?error=no_txnid`);
//   }
// });

// // Payment initiation endpoint
// app.post('/api/initiate-payment', async (req, res) => {
//   try {
//     console.log('Received payment request:', req.body);

//     // Extract and validate required fields
//     let { amount, name, email, phone, productInfo, orderId } = req.body;

//     if (!amount || !name || !email || !phone) {
//       console.error('Missing required fields:', { amount, name, email, phone });
//       return res.status(400).json({
//         status: 0,
//         msg: 'Missing required fields: amount, name, email, or phone'
//       });
//     }

//     // FORMAT FIX: Ensure all values exactly match required format

//     // 1. Amount - must be string with exactly 2 decimal places
//     const formattedAmount = parseFloat(amount).toFixed(2);

//     // 2. Name - must be plain text without special characters
//     const formattedName = name.trim().replace(/[^\w\s]/g, '');

//     // 3. Email - must be standard email format
//     const formattedEmail = email.trim();
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formattedEmail)) {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Invalid email format'
//       });
//     }

//     // 4. Phone - must be exactly 10 digits
//     const formattedPhone = phone.trim();
//     if (!/^\d{10}$/.test(formattedPhone)) {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Phone must be exactly 10 digits'
//       });
//     }

//     // 5. Use exact same productinfo as working demo
//     const formattedProductInfo = "Test Product";

//     // 6. Generate a unique transaction ID with prefix
//     const txnid = orderId || `TXN${Date.now()}`;
//     console.log('Using transaction ID:', txnid);

//     // 7. Get Easebuzz credentials - use hardcoded test values if not in env
//     const key = functions.config().easebuzz?.key || '2PBP7IABZ2';
//     const salt = functions.config().easebuzz?.salt || 'DAH88E3UWQ';

//     if (!key || !salt) {
//       console.error('Missing Easebuzz credentials');
//       return res.status(500).json({
//         status: 0,
//         msg: 'Missing payment gateway credentials'
//       });
//     }

//     // Get the function URLs for success/failure callbacks
//     const functionBaseUrl = `https://${process.env.FUNCTION_REGION || 'us-central1'}-${process.env.GCLOUD_PROJECT || 'zappcart-control-panel'}.cloudfunctions.net/paymentApi`;

//     // 8. Create payment data with exact field names required by Easebuzz
//     const paymentData = {
//       key,
//       txnid,
//       amount: formattedAmount,
//       firstname: formattedName,
//       email: formattedEmail,
//       phone: formattedPhone,
//       productinfo: formattedProductInfo,
//       // URLs point to the function endpoints
//       surl: `${functionBaseUrl}/payment-success`,
//       furl: `${functionBaseUrl}/payment-failure`,
//       udf1: '',
//       udf2: '',
//       udf3: '',
//       udf4: '',
//       udf5: '',
//     };

//     // 9. Log formatted values for debugging
//     console.log('Formatted values for hash calculation:');
//     console.log('- Amount:', formattedAmount);
//     console.log('- Name:', formattedName);
//     console.log('- Email:', formattedEmail);
//     console.log('- Phone:', formattedPhone);
//     console.log('- Product Info:', formattedProductInfo);
//     console.log('- Transaction ID:', txnid);

//     // 10. Generate hash string - EXACT format as working demo
//     const hashString =
//       key + '|' +
//       txnid + '|' +
//       formattedAmount + '|' +
//       formattedProductInfo + '|' +
//       formattedName + '|' +
//       formattedEmail + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       salt;

//     console.log('Hash string (first 50 chars):', hashString.substring(0, 50) + '...');

//     // 11. Generate SHA512 hash
//     const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
//     console.log('Generated hash (first 10 chars):', hash.substring(0, 10) + '...');

//     // 12. Add hash to payment data
//     paymentData.hash = hash;

//     // Success response
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

// // Refund API endpoint
// app.post('/api/refund', async (req, res) => {
//   try {
//     const { txnid, refundAmount, reason } = req.body;
    
//     if (!txnid || !refundAmount) {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Missing required fields: txnid or refundAmount'
//       });
//     }
    
//     console.log(`Initiating refund for transaction: ${txnid}, amount: ${refundAmount}`);
    
//     // Format the amount to 2 decimal places
//     const formattedAmount = parseFloat(refundAmount).toFixed(2);
    
//     // Get Easebuzz credentials
//     const key = functions.config().easebuzz?.key || '2PBP7IABZ2';
//     const salt = functions.config().easebuzz?.salt || 'DAH88E3UWQ';
    
//     // Prepare refund data
//     const refundData = {
//       key: key,
//       txnid: txnid,
//       refund_amount: formattedAmount,
//       phone: '',  // Can be empty for refund
//       email: '',  // Can be empty for refund
//       amount: '0.00', // Original amount, use 0.00 for refund API
//       merchant_email: '', // Optional
//       refund_reason: reason || 'Customer requested refund'
//     };
    
//     // Generate hash for refund
//     const hashString = 
//       key + '|' + 
//       txnid + '|' + 
//       formattedAmount + '|' + 
//       '' + '|' + 
//       '' + '|' + 
//       salt;
    
//     const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
//     refundData.hash = hash;
    
//     // In Firebase Functions, we need to use fetch from node-fetch or axios
//     const fetch = require('node-fetch');
    
//     // Call Easebuzz refund API
//     const response = await fetch('https://testpay.easebuzz.in/transaction/v1/refund', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(refundData)
//     });
    
//     if (!response.ok) {
//       throw new Error(`Refund API responded with status: ${response.status}`);
//     }
    
//     const refundResponse = await response.json();
//     console.log('Refund response:', refundResponse);
    
//     // Update order status in Firebase if refund is successful
//     if (refundResponse.status === 1) {
//       try {
//         const db = admin.database();
//         const orderRef = db.ref(`orders/${txnid}`);
        
//         await orderRef.update({
//           status: 'refunded',
//           refundTimestamp: new Date().toISOString(),
//           refundDetails: {
//             amount: formattedAmount,
//             reason: reason || 'Customer requested refund',
//             refundId: refundResponse.data?.refund_id || '',
//             status: 'completed'
//           }
//         });
        
//         console.log(`Order ${txnid} updated to refunded status`);
//       } catch (error) {
//         console.error('Error updating order refund status in Firebase:', error);
//       }
//     }
    
//     // Return the refund response
//     res.json(refundResponse);
    
//   } catch (error) {
//     console.error('Refund error:', error);
//     res.status(500).json({
//       status: 0,
//       msg: 'Refund failed: ' + error.message
//     });
//   }
// });

// // Export the Express app as a Firebase Function
// exports.paymentApi = functions.https.onRequest(app);


// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const crypto = require('crypto');

// // Detect environment
// const isLocalEnvironment = process.env.NODE_ENV === 'development';
// console.log(`Starting server in ${isLocalEnvironment ? 'local' : 'cloud'} environment...`);

// // Initialize Firebase Admin
// let admin;
// try {
//   admin = require('firebase-admin');
  
//   if (!admin.apps.length) {
//     console.log('Initializing Firebase Admin...');
//     try {
//       const serviceAccount = require('./service-account-key.json');
//       admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount),
//         databaseURL: `https://${process.env.GCLOUD_PROJECT || 'zappcart-control-panel'}.firebaseio.com`
//       });
//       console.log('Firebase initialized with service account');
//     } catch (e) {
//       console.log('Service account not found, using default initialization');
//       admin.initializeApp();
//       console.log('Firebase initialized with default credentials');
//     }
//   }
// } catch (error) {
//   console.error('Firebase Admin initialization error:', error.message);
//   console.log('Continuing with limited functionality...');
// }

// // Setup functions object (real or mock)
// let functions;
// try {
//   functions = require('firebase-functions');
//   console.log('Firebase Functions module loaded');
// } catch (error) {
//   console.log('Firebase Functions module not available, using mock');
//   functions = {
//     config: () => {
//       console.log('Getting mock functions config');
//       return {
//         easebuzz: {
//           key: process.env.EASEBUZZ_KEY || '2PBP7IABZ2',
//           salt: process.env.EASEBUZZ_SALT || 'DAH88E3UWQ'
//         }
//       };
//     },
//     https: {
//       onRequest: (app) => app
//     }
//   };
// }

// // Create Express app
// const app = express();

// // Configure CORS to allow requests from your frontend
// const allowedOrigins = [
//   'http://localhost:5002',
//   'http://localhost:3000', 
//   'http://localhost:5173',
//   'http://localhost:5003', // Add port 5003 based on the screenshot
//   'https://zappcart-control-panel.web.app'
// ];

// // Enhanced CORS middleware
// app.use(cors({
//   origin: function(origin, callback) {
//     // Allow requests with no origin (like mobile apps, curl, etc.)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       console.log('CORS blocked origin:', origin);
//       // Still allow but log it
//       callback(null, true);
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Add a specific CORS pre-flight handler
// app.options('*', cors());

// // Add a middleware to manually set CORS headers as a fallback
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Credentials', 'true');
  
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
  
//   next();
// });

// // Regular middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Dynamic base URL based on environment
// const getBaseUrl = () => {
//   if (isLocalEnvironment) {
//     // Match the port that your frontend is trying to connect to
//     return process.env.LOCAL_BASE_URL || 'http://localhost:5002';
//   } else {
//     return `https://${process.env.FUNCTION_REGION || 'us-central1'}-${process.env.GCLOUD_PROJECT || 'zappcart-control-panel'}.cloudfunctions.net/paymentApi`;
//   }
// };

// // Dynamic frontend URL based on environment
// const getFrontendUrl = () => {
//   if (isLocalEnvironment) {
//     return process.env.LOCAL_FRONTEND_URL || 'http://localhost:5003'; // Updated to 5003 based on your screenshot
//   } else {
//     return 'https://zappcart-control-panel.web.app';
//   }
// };

// // Health check endpoint
// app.get('/', (req, res) => {
//   console.log('Root endpoint accessed');
//   res.send('Server is running');
// });

// app.get('/api/health', (req, res) => {
//   console.log('Health check endpoint accessed');
//   res.json({ 
//     status: 'ok', 
//     message: 'Server is running',
//     firebase: admin ? 'connected' : 'not initialized',
//     environment: isLocalEnvironment ? 'development' : 'production',
//     cors: 'enabled'
//   });
// });

// // Debug route to check environment variables
// app.get('/api/check-env', (req, res) => {
//   console.log('Environment check endpoint accessed');
  
//   const key = functions.config().easebuzz?.key || '2PBP7IABZ2';
//   const salt = functions.config().easebuzz?.salt || 'DAH88E3UWQ';
  
//   const keyPreview = key ?
//     `${key.substring(0, 3)}...` : 'Not set';
//   const saltPreview = salt ?
//     `${salt.substring(0, 3)}...` : 'Not set';

//   res.json({
//     key_status: key ? 'Set' : 'Not set',
//     salt_status: salt ? 'Set' : 'Not set',
//     key_preview: keyPreview,
//     salt_preview: saltPreview,
//     firebase: admin ? 'connected' : 'not initialized',
//     environment: isLocalEnvironment ? 'development' : 'production',
//     base_url: getBaseUrl(),
//     frontend_url: getFrontendUrl(),
//     cors: 'enabled'
//   });
// });

// // Payment success handler
// app.post('/payment-success', async (req, res) => {
//   console.log('Payment success POST received:', req.body);
  
//   // Extract the transaction ID
//   const txnid = req.body.txnid;
  
//   if (txnid) {
//     try {
//       if (!admin) {
//         throw new Error('Firebase admin not initialized');
//       }
      
//       const db = admin.database();
//       const orderRef = db.ref(`orders/${txnid}`);
      
//       // Check if order exists
//       const snapshot = await orderRef.once('value');
      
//       if (snapshot.exists()) {
//         // Update the order status
//         await orderRef.update({
//           status: 'payment-completed',
//           paymentTimestamp: new Date().toISOString(),
//           paymentDetails: {
//             amount: req.body.amount || '',
//             paymentId: req.body.easepayid || '',
//             mode: req.body.mode || '',
//             status: 'success'
//           }
//         });
        
//         console.log(`Order ${txnid} updated to payment-completed`);
//       } else {
//         console.error(`Order ${txnid} not found`);
//       }
      
//       // Redirect to the frontend with the data as query params
//       const queryParams = new URLSearchParams();
//       Object.entries(req.body).forEach(([key, value]) => {
//         queryParams.append(key, value);
//       });
      
//       // Use dynamic frontend URL
//       const appUrl = getFrontendUrl();
//       res.redirect(`${appUrl}/payment-success?${queryParams.toString()}`);
//     } catch (error) {
//       console.error('Firebase operation error:', error);
//       // Use dynamic frontend URL
//       const appUrl = getFrontendUrl();
//       res.redirect(`${appUrl}/payment-success?txnid=${txnid}&error=firebase_error&message=${encodeURIComponent(error.message)}`);
//     }
//   } else {
//     console.error('No transaction ID in payment response');
//     // Use dynamic frontend URL
//     const appUrl = getFrontendUrl();
//     res.redirect(`${appUrl}/payment-success?error=no_txnid`);
//   }
// });

// // Payment failure handler
// app.post('/payment-failure', async (req, res) => {
//   console.log('Payment failure POST received:', req.body);
  
//   const txnid = req.body.txnid;
  
//   if (txnid) {
//     try {
//       if (!admin) {
//         throw new Error('Firebase admin not initialized');
//       }
      
//       const db = admin.database();
//       const orderRef = db.ref(`orders/${txnid}`);
      
//       // Check if order exists
//       const snapshot = await orderRef.once('value');
      
//       if (snapshot.exists()) {
//         // Update the order status
//         await orderRef.update({
//           status: 'payment-failed',
//           paymentTimestamp: new Date().toISOString(),
//           paymentDetails: {
//             errorMessage: req.body.error_Message || '',
//             status: 'failed'
//           }
//         });
        
//         console.log(`Order ${txnid} updated to payment-failed`);
//       } else {
//         console.error(`Order ${txnid} not found`);
//       }
      
//       // Redirect to the frontend with the data as query params
//       const queryParams = new URLSearchParams();
//       Object.entries(req.body).forEach(([key, value]) => {
//         queryParams.append(key, value);
//       });
      
//       // Use dynamic frontend URL
//       const appUrl = getFrontendUrl();
//       res.redirect(`${appUrl}/payment-failure?${queryParams.toString()}`);
//     } catch (error) {
//       console.error('Firebase operation error:', error);
//       // Use dynamic frontend URL
//       const appUrl = getFrontendUrl();
//       res.redirect(`${appUrl}/payment-failure?txnid=${txnid}&error=firebase_error&message=${encodeURIComponent(error.message)}`);
//     }
//   } else {
//     console.error('No transaction ID in payment response');
//     // Use dynamic frontend URL
//     const appUrl = getFrontendUrl();
//     res.redirect(`${appUrl}/payment-failure?error=no_txnid`);
//   }
// });

// // Payment initiation endpoint - FULL IMPLEMENTATION
// app.post('/api/initiate-payment', async (req, res) => {
//   try {
//     console.log('Received payment request:', req.body);

//     // Extract and validate required fields
//     let { amount, name, email, phone, productInfo, orderId } = req.body;

//     if (!amount || !name || !email || !phone) {
//       console.error('Missing required fields:', { amount, name, email, phone });
//       return res.status(400).json({
//         status: 0,
//         msg: 'Missing required fields: amount, name, email, or phone'
//       });
//     }

//     // FORMAT FIX: Ensure all values exactly match required format

//     // 1. Amount - must be string with exactly 2 decimal places
//     const formattedAmount = parseFloat(amount).toFixed(2);

//     // 2. Name - must be plain text without special characters
//     const formattedName = name.trim().replace(/[^\w\s]/g, '');

//     // 3. Email - must be standard email format
//     const formattedEmail = email.trim();
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formattedEmail)) {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Invalid email format'
//       });
//     }

//     // 4. Phone - must be exactly 10 digits
//     const formattedPhone = phone.trim();
//     if (!/^\d{10}$/.test(formattedPhone)) {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Phone must be exactly 10 digits'
//       });
//     }

//     // 5. Use exact same productinfo as working demo
//     const formattedProductInfo = productInfo || "Test Product";

//     // 6. Generate a unique transaction ID with prefix
//     const txnid = orderId || `TXN${Date.now()}`;
//     console.log('Using transaction ID:', txnid);

//     // 7. Get Easebuzz credentials - use env vars for local, functions.config for prod
//     const key = isLocalEnvironment ? 
//       (process.env.EASEBUZZ_KEY || '2PBP7IABZ2') :
//       (functions.config().easebuzz?.key || '2PBP7IABZ2');
      
//     const salt = isLocalEnvironment ?
//       (process.env.EASEBUZZ_SALT || 'DAH88E3UWQ') :
//       (functions.config().easebuzz?.salt || 'DAH88E3UWQ');

//     if (!key || !salt) {
//       console.error('Missing Easebuzz credentials');
//       return res.status(500).json({
//         status: 0,
//         msg: 'Missing payment gateway credentials'
//       });
//     }

//     // Get the function URLs for success/failure callbacks - use dynamic base URL
//     const functionBaseUrl = getBaseUrl();

//     // 8. Create payment data with exact field names required by Easebuzz
//     const paymentData = {
//       key,
//       txnid,
//       amount: formattedAmount,
//       firstname: formattedName,
//       email: formattedEmail,
//       phone: formattedPhone,
//       productinfo: formattedProductInfo,
//       // URLs point to the function endpoints
//       surl: `${functionBaseUrl}/payment-success`,
//       furl: `${functionBaseUrl}/payment-failure`,
//       udf1: '',
//       udf2: '',
//       udf3: '',
//       udf4: '',
//       udf5: '',
//     };

//     // 9. Log formatted values for debugging
//     console.log('Formatted values for hash calculation:');
//     console.log('- Amount:', formattedAmount);
//     console.log('- Name:', formattedName);
//     console.log('- Email:', formattedEmail);
//     console.log('- Phone:', formattedPhone);
//     console.log('- Product Info:', formattedProductInfo);
//     console.log('- Transaction ID:', txnid);
//     console.log('- Success URL:', paymentData.surl);
//     console.log('- Failure URL:', paymentData.furl);

//     // 10. Generate hash string - EXACT format as working demo
//     const hashString =
//       key + '|' +
//       txnid + '|' +
//       formattedAmount + '|' +
//       formattedProductInfo + '|' +
//       formattedName + '|' +
//       formattedEmail + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       salt;

//     console.log('Hash string (first 50 chars):', hashString.substring(0, 50) + '...');

//     // 11. Generate SHA512 hash
//     const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
//     console.log('Generated hash (first 10 chars):', hash.substring(0, 10) + '...');

//     // 12. Add hash to payment data
//     paymentData.hash = hash;

//     // Success response
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

// // Refund API endpoint
// app.post('/api/refund', async (req, res) => {
//   try {
//     const { txnid, refundAmount, reason } = req.body;
    
//     if (!txnid || !refundAmount) {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Missing required fields: txnid or refundAmount'
//       });
//     }
    
//     console.log(`Initiating refund for transaction: ${txnid}, amount: ${refundAmount}`);
    
//     // Format the amount to 2 decimal places
//     const formattedAmount = parseFloat(refundAmount).toFixed(2);
    
//     // Get Easebuzz credentials - use env vars for local, functions.config for prod
//     const key = isLocalEnvironment ? 
//       (process.env.EASEBUZZ_KEY || '2PBP7IABZ2') :
//       (functions.config().easebuzz?.key || '2PBP7IABZ2');
      
//     const salt = isLocalEnvironment ?
//       (process.env.EASEBUZZ_SALT || 'DAH88E3UWQ') :
//       (functions.config().easebuzz?.salt || 'DAH88E3UWQ');
    
//     // Prepare refund data
//     const refundData = {
//       key: key,
//       txnid: txnid,
//       refund_amount: formattedAmount,
//       phone: '',  // Can be empty for refund
//       email: '',  // Can be empty for refund
//       amount: '0.00', // Original amount, use 0.00 for refund API
//       merchant_email: '', // Optional
//       refund_reason: reason || 'Customer requested refund'
//     };
    
//     // Generate hash for refund
//     const hashString = 
//       key + '|' + 
//       txnid + '|' + 
//       formattedAmount + '|' + 
//       '' + '|' + 
//       '' + '|' + 
//       salt;
    
//     const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
//     refundData.hash = hash;
    
//     // Use node-fetch for API calls
//     let fetch;
//     try {
//       fetch = require('node-fetch');
//     } catch (error) {
//       console.error('node-fetch not available, installing it...');
//       return res.status(500).json({
//         status: 0,
//         msg: 'node-fetch module not found. Please run: npm install node-fetch@2'
//       });
//     }
    
//     // Call Easebuzz refund API
//     const response = await fetch('https://testpay.easebuzz.in/transaction/v1/refund', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(refundData)
//     });
    
//     if (!response.ok) {
//       throw new Error(`Refund API responded with status: ${response.status}`);
//     }
    
//     const refundResponse = await response.json();
//     console.log('Refund response:', refundResponse);
    
//     // Update order status in Firebase if refund is successful
//     if (refundResponse.status === 1) {
//       try {
//         if (!admin) {
//           throw new Error('Firebase admin not initialized');
//         }
        
//         const db = admin.database();
//         const orderRef = db.ref(`orders/${txnid}`);
        
//         await orderRef.update({
//           status: 'refunded',
//           refundTimestamp: new Date().toISOString(),
//           refundDetails: {
//             amount: formattedAmount,
//             reason: reason || 'Customer requested refund',
//             refundId: refundResponse.data?.refund_id || '',
//             status: 'completed'
//           }
//         });
        
//         console.log(`Order ${txnid} updated to refunded status`);
//       } catch (error) {
//         console.error('Error updating order refund status in Firebase:', error);
//       }
//     }
    
//     // Return the refund response
//     res.json(refundResponse);
    
//   } catch (error) {
//     console.error('Refund error:', error);
//     res.status(500).json({
//       status: 0,
//       msg: 'Refund failed: ' + error.message
//     });
//   }
// });

// // Set the port for local server - MATCH THE PORT YOUR FRONTEND IS TRYING TO ACCESS
// const PORT = process.env.PORT || 5002;

// // Only start local server when running in local environment
// if (isLocalEnvironment) {
//   const server = app.listen(PORT, () => {
//     console.log(`✅ Server running on port ${PORT}`);
//     console.log(`📡 Base URL: ${getBaseUrl()}`);
//     console.log(`🌐 Frontend URL: ${getFrontendUrl()}`);
//     console.log(`🔧 Environment: ${isLocalEnvironment ? 'development' : 'production'}`);
//     console.log(`👉 Try accessing: http://localhost:${PORT}/api/health`);
//   });

//   // Handle server errors
//   server.on('error', (error) => {
//     console.error('Server error:', error);
//     if (error.code === 'EADDRINUSE') {
//       console.error(`Port ${PORT} is already in use. Try a different port.`);
//     }
//   });
// }

// // Export for Firebase Functions
// try {
//   exports.paymentApi = functions.https.onRequest(app);
//   console.log('Exported paymentApi for Firebase Functions');
// } catch (error) {
//   console.error('Error exporting Firebase function:', error);
// }

// console.log('Server initialization completed');






// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const crypto = require('crypto');

// // Detect environment
// const isLocalEnvironment = process.env.NODE_ENV === 'development';
// console.log(`Starting server in ${isLocalEnvironment ? 'local' : 'cloud'} environment...`);

// // Initialize Firebase Admin
// let admin;
// try {
//   admin = require('firebase-admin');
  
//   if (!admin.apps.length) {
//     console.log('Initializing Firebase Admin...');
//     try {
//       const serviceAccount = require('./service-account-key.json');
//       admin.initializeApp({
//         credential: admin.credential.cert(serviceAccount),
//         databaseURL: `https://${process.env.GCLOUD_PROJECT || 'zappcart-control-panel'}.firebaseio.com`
//       });
//       console.log('Firebase initialized with service account');
//     } catch (e) {
//       console.log('Service account not found, using default initialization');
//       admin.initializeApp();
//       console.log('Firebase initialized with default credentials');
//     }
//   }
// } catch (error) {
//   console.error('Firebase Admin initialization error:', error.message);
//   console.log('Continuing with limited functionality...');
// }

// // Setup functions object (real or mock)
// let functions;
// try {
//   functions = require('firebase-functions');
//   console.log('Firebase Functions module loaded');
// } catch (error) {
//   console.log('Firebase Functions module not available, using mock');
//   functions = {
//     config: () => {
//       console.log('Getting mock functions config');
//       return {
//         easebuzz: {
//           key: process.env.EASEBUZZ_KEY || '2PBP7IABZ2',
//           salt: process.env.EASEBUZZ_SALT || 'DAH88E3UWQ'
//         }
//       };
//     },
//     https: {
//       onRequest: (app) => app
//     }
//   };
// }

// // Create Express app
// const app = express();

// // Configure CORS to allow requests from your frontend
// const allowedOrigins = [
//   'http://localhost:5002',
//   'http://localhost:3000', 
//   'http://localhost:5173',
//   'http://localhost:5003', // Add port 5003 based on the screenshot
//   'https://zappcart-control-panel.web.app'
// ];

// // Enhanced CORS middleware
// app.use(cors({
//   origin: function(origin, callback) {
//     // Allow requests with no origin (like mobile apps, curl, etc.)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       console.log('CORS blocked origin:', origin);
//       // Still allow but log it
//       callback(null, true);
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Add a specific CORS pre-flight handler
// app.options('*', cors());

// // Add a middleware to manually set CORS headers as a fallback
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Credentials', 'true');
  
//   if (req.method === 'OPTIONS') {
//     return res.status(200).end();
//   }
  
//   next();
// });

// // Regular middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Dynamic base URL based on environment
// const getBaseUrl = () => {
//   if (isLocalEnvironment) {
//     // Match the port that your frontend is trying to connect to
//     return process.env.LOCAL_BASE_URL || 'http://localhost:5002';
//   } else {
//     return `https://${process.env.FUNCTION_REGION || 'us-central1'}-${process.env.GCLOUD_PROJECT || 'zappcart-control-panel'}.cloudfunctions.net/paymentApi`;
//   }
// };

// // Dynamic frontend URL based on environment
// const getFrontendUrl = () => {
//   if (isLocalEnvironment) {
//     return process.env.LOCAL_FRONTEND_URL || 'http://localhost:5003'; // Updated to 5003 based on your screenshot
//   } else {
//     return 'https://zappcart-control-panel.web.app';
//   }
// };

// // Health check endpoint
// app.get('/', (req, res) => {
//   console.log('Root endpoint accessed');
//   res.send('Server is running');
// });

// app.get('/api/health', (req, res) => {
//   console.log('Health check endpoint accessed');
//   res.json({ 
//     status: 'ok', 
//     message: 'Server is running',
//     firebase: admin ? 'connected' : 'not initialized',
//     environment: isLocalEnvironment ? 'development' : 'production',
//     cors: 'enabled'
//   });
// });

// // Debug route to check environment variables
// app.get('/api/check-env', (req, res) => {
//   console.log('Environment check endpoint accessed');
  
//   const key = functions.config().easebuzz?.key || '2PBP7IABZ2';
//   const salt = functions.config().easebuzz?.salt || 'DAH88E3UWQ';
  
//   const keyPreview = key ?
//     `${key.substring(0, 3)}...` : 'Not set';
//   const saltPreview = salt ?
//     `${salt.substring(0, 3)}...` : 'Not set';

//   res.json({
//     key_status: key ? 'Set' : 'Not set',
//     salt_status: salt ? 'Set' : 'Not set',
//     key_preview: keyPreview,
//     salt_preview: saltPreview,
//     firebase: admin ? 'connected' : 'not initialized',
//     environment: isLocalEnvironment ? 'development' : 'production',
//     base_url: getBaseUrl(),
//     frontend_url: getFrontendUrl(),
//     cors: 'enabled'
//   });
// });

// // Payment success handler
// app.post('/payment-success', async (req, res) => {
//   console.log('Payment success POST received:', req.body);
  
//   // Extract the transaction ID
//   const txnid = req.body.txnid;
  
//   if (txnid) {
//     try {
//       if (!admin) {
//         throw new Error('Firebase admin not initialized');
//       }
      
//       const db = admin.database();
//       const orderRef = db.ref(`orders/${txnid}`);
      
//       // Check if order exists
//       const snapshot = await orderRef.once('value');
      
//       if (snapshot.exists()) {
//         // Update the order status
//         await orderRef.update({
//           status: 'payment-completed',
//           paymentTimestamp: new Date().toISOString(),
//           paymentDetails: {
//             amount: req.body.amount || '',
//             paymentId: req.body.easepayid || '',
//             mode: req.body.mode || '',
//             status: 'success'
//           }
//         });
        
//         console.log(`Order ${txnid} updated to payment-completed`);
//       } else {
//         console.error(`Order ${txnid} not found`);
//       }
      
//       // Redirect to the frontend with the data as query params
//       const queryParams = new URLSearchParams();
//       Object.entries(req.body).forEach(([key, value]) => {
//         queryParams.append(key, value);
//       });
      
//       // Use dynamic frontend URL
//       const appUrl = getFrontendUrl();
//       res.redirect(`${appUrl}/payment-success?${queryParams.toString()}`);
//     } catch (error) {
//       console.error('Firebase operation error:', error);
//       // Use dynamic frontend URL
//       const appUrl = getFrontendUrl();
//       res.redirect(`${appUrl}/payment-success?txnid=${txnid}&error=firebase_error&message=${encodeURIComponent(error.message)}`);
//     }
//   } else {
//     console.error('No transaction ID in payment response');
//     // Use dynamic frontend URL
//     const appUrl = getFrontendUrl();
//     res.redirect(`${appUrl}/payment-success?error=no_txnid`);
//   }
// });

// // Payment failure handler
// app.post('/payment-failure', async (req, res) => {
//   console.log('Payment failure POST received:', req.body);
  
//   const txnid = req.body.txnid;
  
//   if (txnid) {
//     try {
//       if (!admin) {
//         throw new Error('Firebase admin not initialized');
//       }
      
//       const db = admin.database();
//       const orderRef = db.ref(`orders/${txnid}`);
      
//       // Check if order exists
//       const snapshot = await orderRef.once('value');
      
//       if (snapshot.exists()) {
//         // Update the order status
//         await orderRef.update({
//           status: 'payment-failed',
//           paymentTimestamp: new Date().toISOString(),
//           paymentDetails: {
//             errorMessage: req.body.error_Message || '',
//             status: 'failed'
//           }
//         });
        
//         console.log(`Order ${txnid} updated to payment-failed`);
//       } else {
//         console.error(`Order ${txnid} not found`);
//       }
      
//       // Redirect to the frontend with the data as query params
//       const queryParams = new URLSearchParams();
//       Object.entries(req.body).forEach(([key, value]) => {
//         queryParams.append(key, value);
//       });
      
//       // Use dynamic frontend URL
//       const appUrl = getFrontendUrl();
//       res.redirect(`${appUrl}/payment-failure?${queryParams.toString()}`);
//     } catch (error) {
//       console.error('Firebase operation error:', error);
//       // Use dynamic frontend URL
//       const appUrl = getFrontendUrl();
//       res.redirect(`${appUrl}/payment-failure?txnid=${txnid}&error=firebase_error&message=${encodeURIComponent(error.message)}`);
//     }
//   } else {
//     console.error('No transaction ID in payment response');
//     // Use dynamic frontend URL
//     const appUrl = getFrontendUrl();
//     res.redirect(`${appUrl}/payment-failure?error=no_txnid`);
//   }
// });

// // Payment initiation endpoint - FULL IMPLEMENTATION
// app.post('/api/initiate-payment', async (req, res) => {
//   try {
//     console.log('Received payment request:', req.body);

//     // Extract and validate required fields
//     let { amount, name, email, phone, productInfo, orderId } = req.body;

//     if (!amount || !name || !email || !phone) {
//       console.error('Missing required fields:', { amount, name, email, phone });
//       return res.status(400).json({
//         status: 0,
//         msg: 'Missing required fields: amount, name, email, or phone'
//       });
//     }

//     // FORMAT FIX: Ensure all values exactly match required format

//     // 1. Amount - must be string with exactly 2 decimal places
//     const formattedAmount = parseFloat(amount).toFixed(2);

//     // 2. Name - must be plain text without special characters
//     const formattedName = name.trim().replace(/[^\w\s]/g, '');

//     // 3. Email - must be standard email format
//     const formattedEmail = email.trim();
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formattedEmail)) {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Invalid email format'
//       });
//     }

//     // 4. Phone - must be exactly 10 digits
//     const formattedPhone = phone.trim();
//     if (!/^\d{10}$/.test(formattedPhone)) {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Phone must be exactly 10 digits'
//       });
//     }

//     // 5. Use exact same productinfo as working demo
//     const formattedProductInfo = productInfo || "Test Product";

//     // 6. Generate a unique transaction ID with prefix
//     const txnid = orderId || `TXN${Date.now()}`;
//     console.log('Using transaction ID:', txnid);

//     // 7. Get Easebuzz credentials - use env vars for local, functions.config for prod
//     const key = isLocalEnvironment ? 
//       (process.env.EASEBUZZ_KEY || '2PBP7IABZ2') :
//       (functions.config().easebuzz?.key || '2PBP7IABZ2');
      
//     const salt = isLocalEnvironment ?
//       (process.env.EASEBUZZ_SALT || 'DAH88E3UWQ') :
//       (functions.config().easebuzz?.salt || 'DAH88E3UWQ');

//     if (!key || !salt) {
//       console.error('Missing Easebuzz credentials');
//       return res.status(500).json({
//         status: 0,
//         msg: 'Missing payment gateway credentials'
//       });
//     }

//     // Get the function URLs for success/failure callbacks - use dynamic base URL
//     const functionBaseUrl = getBaseUrl();

//     // 8. Create payment data with exact field names required by Easebuzz
//     const paymentData = {
//       key,
//       txnid,
//       amount: formattedAmount,
//       firstname: formattedName,
//       email: formattedEmail,
//       phone: formattedPhone,
//       productinfo: formattedProductInfo,
//       // URLs point to the function endpoints
//       surl: `${functionBaseUrl}/payment-success`,
//       furl: `${functionBaseUrl}/payment-failure`,
//       udf1: '',
//       udf2: '',
//       udf3: '',
//       udf4: '',
//       udf5: '',
//     };

//     // 9. Log formatted values for debugging
//     console.log('Formatted values for hash calculation:');
//     console.log('- Amount:', formattedAmount);
//     console.log('- Name:', formattedName);
//     console.log('- Email:', formattedEmail);
//     console.log('- Phone:', formattedPhone);
//     console.log('- Product Info:', formattedProductInfo);
//     console.log('- Transaction ID:', txnid);
//     console.log('- Success URL:', paymentData.surl);
//     console.log('- Failure URL:', paymentData.furl);

//     // 10. Generate hash string - EXACT format as working demo
//     const hashString =
//       key + '|' +
//       txnid + '|' +
//       formattedAmount + '|' +
//       formattedProductInfo + '|' +
//       formattedName + '|' +
//       formattedEmail + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       '' + '|' +
//       salt;

//     console.log('Hash string (first 50 chars):', hashString.substring(0, 50) + '...');

//     // 11. Generate SHA512 hash
//     const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
//     console.log('Generated hash (first 10 chars):', hash.substring(0, 10) + '...');

//     // 12. Add hash to payment data
//     paymentData.hash = hash;

//     // Success response
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

// // Refund API endpoint
// app.post('/api/refund', async (req, res) => {
//   try {
//     const { txnid, refundAmount, reason } = req.body;
    
//     if (!txnid || !refundAmount) {
//       return res.status(400).json({
//         status: 0,
//         msg: 'Missing required fields: txnid or refundAmount'
//       });
//     }
    
//     console.log(`Initiating refund for transaction: ${txnid}, amount: ${refundAmount}`);
    
//     // Format the amount to 2 decimal places
//     const formattedAmount = parseFloat(refundAmount).toFixed(2);
    
//     // Get Easebuzz credentials - use env vars for local, functions.config for prod
//     const key = isLocalEnvironment ? 
//       (process.env.EASEBUZZ_KEY || '2PBP7IABZ2') :
//       (functions.config().easebuzz?.key || '2PBP7IABZ2');
      
//     const salt = isLocalEnvironment ?
//       (process.env.EASEBUZZ_SALT || 'DAH88E3UWQ') :
//       (functions.config().easebuzz?.salt || 'DAH88E3UWQ');
    
//     // Prepare refund data
//     const refundData = {
//       key: key,
//       txnid: txnid,
//       refund_amount: formattedAmount,
//       phone: '',  // Can be empty for refund
//       email: '',  // Can be empty for refund
//       amount: '0.00', // Original amount, use 0.00 for refund API
//       merchant_email: '', // Optional
//       refund_reason: reason || 'Customer requested refund'
//     };
    
//     // Generate hash for refund
//     const hashString = 
//       key + '|' + 
//       txnid + '|' + 
//       formattedAmount + '|' + 
//       '' + '|' + 
//       '' + '|' + 
//       salt;
    
//     const hash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
//     refundData.hash = hash;
    
//     // Use node-fetch for API calls
//     let fetch;
//     try {
//       fetch = require('node-fetch');
//     } catch (error) {
//       console.error('node-fetch not available, installing it...');
//       return res.status(500).json({
//         status: 0,
//         msg: 'node-fetch module not found. Please run: npm install node-fetch@2'
//       });
//     }
    
//     // Call Easebuzz refund API
//     const response = await fetch('https://testpay.easebuzz.in/transaction/v1/refund', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(refundData)
//     });
    
//     if (!response.ok) {
//       throw new Error(`Refund API responded with status: ${response.status}`);
//     }
    
//     const refundResponse = await response.json();
//     console.log('Refund response:', refundResponse);
    
//     // Update order status in Firebase if refund is successful
//     if (refundResponse.status === 1) {
//       try {
//         if (!admin) {
//           throw new Error('Firebase admin not initialized');
//         }
        
//         const db = admin.database();
//         const orderRef = db.ref(`orders/${txnid}`);
        
//         await orderRef.update({
//           status: 'refunded',
//           refundTimestamp: new Date().toISOString(),
//           refundDetails: {
//             amount: formattedAmount,
//             reason: reason || 'Customer requested refund',
//             refundId: refundResponse.data?.refund_id || '',
//             status: 'completed'
//           }
//         });
        
//         console.log(`Order ${txnid} updated to refunded status`);
//       } catch (error) {
//         console.error('Error updating order refund status in Firebase:', error);
//       }
//     }
    
//     // Return the refund response
//     res.json(refundResponse);
    
//   } catch (error) {
//     console.error('Refund error:', error);
//     res.status(500).json({
//       status: 0,
//       msg: 'Refund failed: ' + error.message
//     });
//   }
// });

// // Set the port for local server - MATCH THE PORT YOUR FRONTEND IS TRYING TO ACCESS
// const PORT = process.env.PORT || 5002;

// // Only start local server when running in local environment
// if (isLocalEnvironment) {
//   const server = app.listen(PORT, () => {
//     console.log(`✅ Server running on port ${PORT}`);
//     console.log(`📡 Base URL: ${getBaseUrl()}`);
//     console.log(`🌐 Frontend URL: ${getFrontendUrl()}`);
//     console.log(`🔧 Environment: ${isLocalEnvironment ? 'development' : 'production'}`);
//     console.log(`👉 Try accessing: http://localhost:${PORT}/api/health`);
//   });

//   // Handle server errors
//   server.on('error', (error) => {
//     console.error('Server error:', error);
//     if (error.code === 'EADDRINUSE') {
//       console.error(`Port ${PORT} is already in use. Try a different port.`);
//     }
//   });
// }

// // Export for Firebase Functions
// try {
//   exports.paymentApi = functions.https.onRequest(app);
//   console.log('Exported paymentApi for Firebase Functions');
// } catch (error) {
//   console.error('Error exporting Firebase function:', error);
// }

// console.log('Server initialization completed');





const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

// Initialize Firebase Admin
if (!admin.apps.length) {
  console.log('Initializing Firebase Admin...');
  admin.initializeApp();
  console.log('Firebase initialized with default credentials');
}

// Create Express app
const app = express();

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:5002',
  'http://localhost:3000', 
  'http://localhost:5173',
  'http://localhost:5003',
  'https://zappcart-control-panel.web.app'
];

// Comprehensive CORS setup
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      // Still allow but log it for debugging
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// Additional CORS headers for problematic clients
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Regular middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to determine if we're in a local environment
const isLocalEnvironment = () => {
  return process.env.NODE_ENV === 'development' || !process.env.FUNCTION_NAME;
};

// Dynamic base URL based on environment
const getBaseUrl = () => {
  if (isLocalEnvironment()) {
    return process.env.LOCAL_BASE_URL || 'http://localhost:5002';
  } else {
    return `https://${process.env.FUNCTION_REGION || 'us-central1'}-${process.env.GCLOUD_PROJECT || 'zappcart-control-panel'}.cloudfunctions.net/paymentApi`;
  }
};

// Dynamic frontend URL based on environment
const getFrontendUrl = () => {
  if (isLocalEnvironment()) {
    return process.env.LOCAL_FRONTEND_URL || 'http://localhost:5003';
  } else {
    return 'https://zappcart-control-panel.web.app';
  }
};

// Root endpoint
app.get('/', (req, res) => {
  console.log('Root endpoint accessed');
  res.send('Payment API Server is running');
});

// Health check endpoint - Note: we're adding BOTH /api/health and /api/health1
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint accessed');
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    firebase: admin ? 'connected' : 'not initialized',
    environment: isLocalEnvironment() ? 'development' : 'production',
    region: process.env.FUNCTION_REGION || 'us-central1',
    project: process.env.GCLOUD_PROJECT || 'zappcart-control-panel'
  });
});

// Add the health1 endpoint to match what your frontend is requesting
app.get('/api/health1', (req, res) => {
  console.log('Health1 check endpoint accessed');
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    firebase: admin ? 'connected' : 'not initialized',
    environment: isLocalEnvironment() ? 'development' : 'production',
    cors: 'enabled'
  });
});

// Debug route to check environment variables
app.get('/api/check-env', (req, res) => {
  console.log('Environment check endpoint accessed');
  
  const key = functions.config().easebuzz?.key || '2PBP7IABZ2';
  const salt = functions.config().easebuzz?.salt || 'DAH88E3UWQ';
  
  const keyPreview = key ?
    `${key.substring(0, 3)}...` : 'Not set';
  const saltPreview = salt ?
    `${salt.substring(0, 3)}...` : 'Not set';

  res.json({
    key_status: key ? 'Set' : 'Not set',
    salt_status: salt ? 'Set' : 'Not set',
    key_preview: keyPreview,
    salt_preview: saltPreview,
    firebase: admin ? 'connected' : 'not initialized',
    environment: isLocalEnvironment() ? 'development' : 'production',
    base_url: getBaseUrl(),
    frontend_url: getFrontendUrl(),
    function_name: process.env.FUNCTION_NAME || 'Not running as a function',
    function_region: process.env.FUNCTION_REGION || 'us-central1',
    gcloud_project: process.env.GCLOUD_PROJECT || 'zappcart-control-panel'
  });
});

// Payment success handler
app.post('/payment-success', async (req, res) => {
  console.log('Payment success POST received:', req.body);
  
  // Extract the transaction ID
  const txnid = req.body.txnid;
  
  if (txnid) {
    try {
      if (!admin) {
        throw new Error('Firebase admin not initialized');
      }
      
      const db = admin.database();
      const orderRef = db.ref(`orders/${txnid}`);
      
      // Check if order exists
      const snapshot = await orderRef.once('value');
      
      if (snapshot.exists()) {
        // Update the order status
        await orderRef.update({
          status: 'payment-completed',
          paymentTimestamp: new Date().toISOString(),
          paymentDetails: {
            amount: req.body.amount || '',
            paymentId: req.body.easepayid || '',
            mode: req.body.mode || '',
            status: 'success'
          }
        });
        
        console.log(`Order ${txnid} updated to payment-completed`);
      } else {
        console.error(`Order ${txnid} not found`);
      }
      
      // Redirect to the frontend with the data as query params
      const queryParams = new URLSearchParams();
      Object.entries(req.body).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      
      // Use dynamic frontend URL
      const appUrl = getFrontendUrl();
      console.log(`Redirecting to: ${appUrl}/payment-success`);
      res.redirect(`${appUrl}/payment-success?${queryParams.toString()}`);
    } catch (error) {
      console.error('Firebase operation error:', error);
      // Use dynamic frontend URL
      const appUrl = getFrontendUrl();
      res.redirect(`${appUrl}/payment-success?txnid=${txnid}&error=firebase_error&message=${encodeURIComponent(error.message)}`);
    }
  } else {
    console.error('No transaction ID in payment response');
    // Use dynamic frontend URL
    const appUrl = getFrontendUrl();
    res.redirect(`${appUrl}/payment-success?error=no_txnid`);
  }
});

// Payment failure handler
app.post('/payment-failure', async (req, res) => {
  console.log('Payment failure POST received:', req.body);
  
  const txnid = req.body.txnid;
  
  if (txnid) {
    try {
      if (!admin) {
        throw new Error('Firebase admin not initialized');
      }
      
      const db = admin.database();
      const orderRef = db.ref(`orders/${txnid}`);
      
      // Check if order exists
      const snapshot = await orderRef.once('value');
      
      if (snapshot.exists()) {
        // Update the order status
        await orderRef.update({
          status: 'payment-failed',
          paymentTimestamp: new Date().toISOString(),
          paymentDetails: {
            errorMessage: req.body.error_Message || '',
            status: 'failed'
          }
        });
        
        console.log(`Order ${txnid} updated to payment-failed`);
      } else {
        console.error(`Order ${txnid} not found`);
      }
      
      // Redirect to the frontend with the data as query params
      const queryParams = new URLSearchParams();
      Object.entries(req.body).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      
      // Use dynamic frontend URL
      const appUrl = getFrontendUrl();
      console.log(`Redirecting to: ${appUrl}/payment-failure`);
      res.redirect(`${appUrl}/payment-failure?${queryParams.toString()}`);
    } catch (error) {
      console.error('Firebase operation error:', error);
      // Use dynamic frontend URL
      const appUrl = getFrontendUrl();
      res.redirect(`${appUrl}/payment-failure?txnid=${txnid}&error=firebase_error&message=${encodeURIComponent(error.message)}`);
    }
  } else {
    console.error('No transaction ID in payment response');
    // Use dynamic frontend URL
    const appUrl = getFrontendUrl();
    res.redirect(`${appUrl}/payment-failure?error=no_txnid`);
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
    const formattedProductInfo = productInfo || "Test Product";

    // 6. Generate a unique transaction ID with prefix
    const txnid = orderId || `TXN${Date.now()}`;
    console.log('Using transaction ID:', txnid);

    // 7. Get Easebuzz credentials
    const key = functions.config().easebuzz?.key || '2PBP7IABZ2';
    const salt = functions.config().easebuzz?.salt || 'DAH88E3UWQ';

    if (!key || !salt) {
      console.error('Missing Easebuzz credentials');
      return res.status(500).json({
        status: 0,
        msg: 'Missing payment gateway credentials'
      });
    }

    // Get the function URLs for success/failure callbacks - use dynamic base URL
    const functionBaseUrl = getBaseUrl();
    console.log('Using base URL for callbacks:', functionBaseUrl);

    // 8. Create payment data with exact field names required by Easebuzz
    const paymentData = {
      key,
      txnid,
      amount: formattedAmount,
      firstname: formattedName,
      email: formattedEmail,
      phone: formattedPhone,
      productinfo: formattedProductInfo,
      // URLs point to the function endpoints
      surl: `${functionBaseUrl}/payment-success`,
      furl: `${functionBaseUrl}/payment-failure`,
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
    console.log('- Success URL:', paymentData.surl);
    console.log('- Failure URL:', paymentData.furl);

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
    const key = functions.config().easebuzz?.key || '2PBP7IABZ2';
    const salt = functions.config().easebuzz?.salt || 'DAH88E3UWQ';
    
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
    
    // Use node-fetch for API calls
    const fetch = require('node-fetch');
    
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
    if (refundResponse.status === 1) {
      try {
        if (!admin) {
          throw new Error('Firebase admin not initialized');
        }
        
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

// Set up local server only when running locally
if (isLocalEnvironment()) {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📡 Base URL: ${getBaseUrl()}`);
    console.log(`🌐 Frontend URL: ${getFrontendUrl()}`);
    console.log(`👉 Try accessing: http://localhost:${PORT}/api/health`);
  });
}

// Export for Firebase Functions
exports.paymentApi = functions.https.onRequest(app);