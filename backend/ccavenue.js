import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// CCAvenue Credentials from environment
const MERCHANT_ID = process.env.CCAVENUE_MERCHANT_ID;
const ACCESS_CODE = process.env.CCAVENUE_ACCESS_CODE;
const WORKING_KEY = process.env.CCAVENUE_WORKING_KEY;

// Encryption function (Updated for Node.js compatibility)
export function encrypt(plainText, key) {
  const algorithm = 'aes-128-cbc';
  const keyBuffer = crypto.createHash('md5').update(key).digest();
  const iv = Buffer.alloc(16, 0); // CCAvenue uses zero IV
  
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Decryption function (Updated for Node.js compatibility)
export function decrypt(encText, key) {
  const algorithm = 'aes-128-cbc';
  const keyBuffer = crypto.createHash('md5').update(key).digest();
  const iv = Buffer.alloc(16, 0); // CCAvenue uses zero IV
  
  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
  let decrypted = decipher.update(encText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Generate payment form data
export function generatePaymentData(orderData) {
  const {
    orderId,
    amount,
    customerName,
    customerEmail,
    customerPhone,
    billingAddress,
    redirectUrl,
    cancelUrl
  } = orderData;

  const merchantData = [
    `merchant_id=${MERCHANT_ID}`,
    `order_id=${orderId}`,
    `amount=${amount}`,
    `currency=INR`,
    `redirect_url=${redirectUrl}`,
    `cancel_url=${cancelUrl}`,
    `language=EN`,
    `billing_name=${customerName}`,
    `billing_email=${customerEmail}`,
    `billing_tel=${customerPhone}`,
    `billing_address=${billingAddress}`,
    `delivery_name=${customerName}`,
    `delivery_address=${billingAddress}`,
    `merchant_param1=${orderId}`,
    `merchant_param2=jewelskart`
  ].join('&');

  const encryptedData = encrypt(merchantData, WORKING_KEY);

  return {
    encRequest: encryptedData,
    accessCode: ACCESS_CODE,
    merchantId: MERCHANT_ID
  };
}

// Parse response data
export function parseResponse(encResponse) {
  try {
    const decryptedData = decrypt(encResponse, WORKING_KEY);
    const params = new URLSearchParams(decryptedData);
    
    return {
      orderId: params.get('order_id'),
      orderStatus: params.get('order_status'),
      amount: params.get('amount'),
      trackingId: params.get('tracking_id'),
      bankRefNo: params.get('bank_ref_no'),
      failureMessage: params.get('failure_message'),
      paymentMode: params.get('payment_mode'),
      cardName: params.get('card_name'),
      statusCode: params.get('status_code'),
      statusMessage: params.get('status_message')
    };
  } catch (error) {
    console.error('Error parsing CCAvenue response:', error);
    return null;
  }
}