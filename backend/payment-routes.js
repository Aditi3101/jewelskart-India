import express from 'express';
import { generatePaymentData, parseResponse } from './ccavenue.js';
import db from './db.js';

const router = express.Router();

// Create payment endpoint
router.post('/create-payment', async (req, res) => {
  try {
    const {
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      billingAddress
    } = req.body;

    // Validate required fields
    if (!orderId || !amount || !customerName || !customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Save order to payments table
    const insertQuery = `
      INSERT INTO payments (order_id, amount, name, email, order_status, currency, date)
      VALUES (?, ?, ?, ?, 'pending', 'INR', NOW())
    `;
    
    await db.promise().query(insertQuery, [orderId, amount, customerName, customerEmail]);

    // Generate CCAvenue payment data
    const paymentData = generatePaymentData({
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '9999999999',
      billingAddress: billingAddress || 'Test Address',
      redirectUrl: `${process.env.NGROK_URL || 'http://localhost:5000'}/api/payment-response`,
      cancelUrl: `${process.env.NGROK_URL || 'http://localhost:5000'}/api/payment-cancel`
    });

    res.json({
      success: true,
      paymentData,
      ccavenueUrl: process.env.CCAVENUE_URL
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment creation failed'
    });
  }
});

// Payment response handler
router.post('/payment-response', async (req, res) => {
  try {
    const { encResp } = req.body;
    
    if (!encResp) {
      return res.status(400).send(`
        <html>
          <body>
            <h2>❌ Payment Failed</h2>
            <p>No response data received</p>
            <button onclick="window.close()">Close</button>
          </body>
        </html>
      `);
    }

    // Decrypt CCAvenue response
    const responseData = parseResponse(encResp);
    
    if (!responseData) {
      return res.status(400).send(`
        <html>
          <body>
            <h2>❌ Payment Failed</h2>
            <p>Invalid response data</p>
            <button onclick="window.close()">Close</button>
          </body>
        </html>
      `);
    }

    // Update payment status in database
    const updateQuery = `
      UPDATE payments 
      SET order_status = ?, tracking_id = ?, bank_ref_no = ?, payment_mode = ?, 
          card_name = ?, status_code = ?, status_message = ?, failure_message = ?
      WHERE order_id = ?
    `;
    
    await db.promise().query(updateQuery, [
      responseData.orderStatus,
      responseData.trackingId,
      responseData.bankRefNo,
      responseData.paymentMode,
      responseData.cardName,
      responseData.statusCode,
      responseData.statusMessage,
      responseData.failureMessage,
      responseData.orderId
    ]);

    // Send response HTML
    if (responseData.orderStatus === 'Success') {
      res.send(`
        <html>
          <head>
            <title>Payment Success</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .success { color: green; }
              .details { background: #f5f5f5; padding: 20px; margin: 20px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h2 class="success">✅ Payment Successful!</h2>
            <div class="details">
              <p><strong>Order ID:</strong> ${responseData.orderId}</p>
              <p><strong>Amount:</strong> ₹${responseData.amount}</p>
              <p><strong>Tracking ID:</strong> ${responseData.trackingId}</p>
              <p><strong>Payment Mode:</strong> ${responseData.paymentMode}</p>
            </div>
            <button onclick="window.close()">Close Window</button>
            <script>
              // Auto-close after 5 seconds
              setTimeout(() => window.close(), 5000);
            </script>
          </body>
        </html>
      `);
    } else {
      res.send(`
        <html>
          <head>
            <title>Payment Failed</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .error { color: red; }
              .details { background: #f5f5f5; padding: 20px; margin: 20px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h2 class="error">❌ Payment Failed</h2>
            <div class="details">
              <p><strong>Order ID:</strong> ${responseData.orderId}</p>
              <p><strong>Reason:</strong> ${responseData.failureMessage || 'Payment was not completed'}</p>
            </div>
            <button onclick="window.close()">Close Window</button>
            <script>
              setTimeout(() => window.close(), 5000);
            </script>
          </body>
        </html>
      `);
    }

  } catch (error) {
    console.error('Payment response error:', error);
    res.status(500).send(`
      <html>
        <body>
          <h2>❌ Error Processing Payment</h2>
          <p>Please contact support</p>
          <button onclick="window.close()">Close</button>
        </body>
      </html>
    `);
  }
});

// Payment cancel handler
router.get('/payment-cancel', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Payment Cancelled</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .warning { color: orange; }
        </style>
      </head>
      <body>
        <h2 class="warning">⚠️ Payment Cancelled</h2>
        <p>You cancelled the payment process</p>
        <button onclick="window.close()">Close Window</button>
      </body>
    </html>
  `);
});

export default router;