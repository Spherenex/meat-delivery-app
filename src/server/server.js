// server.js - Easebuzz Integration for Node.js

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Easebuzz Configuration
const config = {
  key: 'YOUR_MERCHANT_KEY',
  salt: 'YOUR_MERCHANT_SALT',
  env: 'test', // Use 'prod' for production
  baseUrl: {
    test: 'https://testpay.easebuzz.in',
    prod: 'https://pay.easebuzz.in'
  }
};

// Helper function to generate hash
const generateHash = (data, salt) => {
  const hashString = Object.keys(data)
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join('&');
  
  return crypto
    .createHmac('sha512', salt)
    .update(hashString)
    .digest('hex');
};

// 1. Initiate Payment API
app.post('/api/payment/initiate', async (req, res) => {
  try {
    const {
      txnid,
      amount,
      firstname,
      email,
      phone,
      productinfo,
      surl,
      furl
    } = req.body;

    // Required parameters
    const paymentData = {
      key: config.key,
      txnid,
      amount,
      firstname,
      email,
      phone,
      productinfo,
      surl: surl || `http://${req.headers.host}/payment/success`,
      furl: furl || `http://${req.headers.host}/payment/failure`
    };

    // Generate hash
    paymentData.hash = generateHash(paymentData, config.salt);

    // Make API request to Easebuzz
    const baseUrl = config.baseUrl[config.env];
    const response = await axios.post(`${baseUrl}/payment/initiateLink`, paymentData);

    res.json(response.data);
  } catch (error) {
    console.error('Initiate Payment Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Transaction API - Check status of a transaction
app.post('/api/payment/transaction/status', async (req, res) => {
  try {
    const { txnid } = req.body;

    const data = {
      key: config.key,
      txnid,
      merchant_email: 'YOUR_MERCHANT_EMAIL'
    };

    // Generate hash
    data.hash = generateHash(data, config.salt);

    // Make API request to Easebuzz
    const baseUrl = config.baseUrl[config.env];
    const response = await axios.post(`${baseUrl}/transaction/v1/status`, data);

    res.json(response.data);
  } catch (error) {
    console.error('Transaction Status Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Transaction Date API - Get transactions by date range
app.post('/api/payment/transaction/date', async (req, res) => {
  try {
    const { merchant_email, from_date, to_date } = req.body;

    const data = {
      key: config.key,
      merchant_email: merchant_email || 'YOUR_MERCHANT_EMAIL',
      from_date,
      to_date
    };

    // Generate hash
    data.hash = generateHash(data, config.salt);

    // Make API request to Easebuzz
    const baseUrl = config.baseUrl[config.env];
    const response = await axios.post(`${baseUrl}/transaction/v1/retrieve/date`, data);

    res.json(response.data);
  } catch (error) {
    console.error('Transaction Date Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Refund API
app.post('/api/payment/refund', async (req, res) => {
  try {
    const { txnid, refund_amount, phone, email, amount } = req.body;

    const data = {
      key: config.key,
      txnid,
      refund_amount,
      phone,
      email,
      amount
    };

    // Generate hash
    data.hash = generateHash(data, config.salt);

    // Make API request to Easebuzz
    const baseUrl = config.baseUrl[config.env];
    const response = await axios.post(`${baseUrl}/transaction/v1/refund`, data);

    res.json(response.data);
  } catch (error) {
    console.error('Refund Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. Payout API
app.post('/api/payment/payout', async (req, res) => {
  try {
    const {
      merchant_email,
      payout_date,
      amount,
      beneficiary_name,
      beneficiary_account_number,
      beneficiary_ifsc,
      beneficiary_address1,
      beneficiary_address2,
      beneficiary_city,
      beneficiary_state,
      beneficiary_pincode,
      merchant_payout_ref
    } = req.body;

    const data = {
      key: config.key,
      merchant_email: merchant_email || 'YOUR_MERCHANT_EMAIL',
      payout_date,
      amount,
      beneficiary_name,
      beneficiary_account_number,
      beneficiary_ifsc,
      beneficiary_address1,
      beneficiary_address2,
      beneficiary_city,
      beneficiary_state,
      beneficiary_pincode,
      merchant_payout_ref
    };

    // Generate hash
    data.hash = generateHash(data, config.salt);

    // Make API request to Easebuzz
    const baseUrl = config.baseUrl[config.env];
    const response = await axios.post(`${baseUrl}/payout/v1/create`, data);

    res.json(response.data);
  } catch (error) {
    console.error('Payout Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Payment success and failure callback routes
app.post('/payment/success', (req, res) => {
  // Verify the hash to ensure the response is from Easebuzz
  // Process the successful payment
  console.log('Payment Success:', req.body);
  res.send('Payment successful! You can redirect to your success page.');
});

app.post('/payment/failure', (req, res) => {
  console.log('Payment Failed:', req.body);
  res.send('Payment failed! You can redirect to your failure page.');
});

// Start the server
app.listen(port, () => {
  console.log(`Easebuzz integration server running on port ${port}`);
});