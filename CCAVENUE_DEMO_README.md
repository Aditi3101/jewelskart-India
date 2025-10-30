# 🚀 CCAvenue Payment Gateway - Complete Demo Project

## 📁 Project Structure
```
Ecommerce/
├── backend/
│   ├── ccavenue.js           # Encryption/Decryption utilities
│   ├── payment-routes.js     # Payment API endpoints
│   ├── server.js            # Main server with payment integration
│   ├── database-setup.sql   # Transaction table schema
│   └── .env                 # CCAvenue credentials
├── ecommerce/
│   └── src/components/
│       └── CheckoutDemo.tsx # React payment component
├── CCAVENUE_SETUP_GUIDE.md  # Detailed setup instructions
└── setup-ccavenue.bat       # Automated setup script
```

## ⚡ Quick Start (5 Minutes)

### 1. Run Setup Script
```bash
setup-ccavenue.bat
```

### 2. Start ngrok
```bash
ngrok http 5000
# Copy URL: https://abc123.ngrok.io
```

### 3. Update .env
```env
NGROK_URL=https://abc123.ngrok.io
```

### 4. Start Applications
```bash
# Terminal 1
cd backend && npm start

# Terminal 2  
cd ecommerce && npm run dev
```

### 5. Test Payment
- Open: http://localhost:3000/checkout-demo
- Click "PAY NOW"
- Use test card: `5123456789012346`

## 🔧 Core Files Explained

### `ccavenue.js` - Encryption Engine
```javascript
// Encrypts payment data for CCAvenue
export function encrypt(plainText, key) {
  const cipher = crypto.createCipher('aes-128-cbc', key);
  return cipher.update(plainText, 'utf8', 'hex') + cipher.final('hex');
}

// Decrypts CCAvenue response
export function decrypt(encText, key) {
  const decipher = crypto.createDecipher('aes-128-cbc', key);
  return decipher.update(encText, 'hex', 'utf8') + decipher.final('utf8');
}
```

### `payment-routes.js` - API Endpoints
```javascript
// Create encrypted payment request
POST /api/create-payment
{
  "orderId": "ORDER_123",
  "amount": 100.00,
  "customerName": "John Doe",
  "customerEmail": "john@example.com"
}

// Handle CCAvenue response
POST /api/payment-response
```

### `CheckoutDemo.tsx` - React Component
```jsx
const handlePayment = async () => {
  // 1. Call backend to create payment
  const response = await axios.post('/api/create-payment', orderData);
  
  // 2. Redirect to CCAvenue with encrypted data
  const form = document.createElement('form');
  form.action = ccavenueUrl;
  form.method = 'POST';
  // Add encrypted fields and submit
};
```

## 🔄 Payment Flow

```
Customer → React App → Node.js Backend → CCAvenue → Bank → Response
    ↓           ↓            ↓             ↓        ↓        ↓
 Click Pay → API Call → Encrypt Data → Payment → Success → Update DB
```

## 🧪 Test Scenarios

### ✅ Successful Payment
- **Card:** `5123456789012346`
- **CVV:** `123`
- **Result:** Success page + DB status = 'success'

### ❌ Failed Payment  
- **Card:** `4111111111111111`
- **Result:** Failure page + DB status = 'failed'

### ⚠️ Cancelled Payment
- **Action:** Click Cancel on CCAvenue
- **Result:** Cancel page + DB status = 'cancelled'

## 📊 Database Schema
```sql
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    status ENUM('pending', 'success', 'failed', 'cancelled'),
    tracking_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Environment Variables
```env
# CCAvenue Test Credentials
CCAVENUE_MERCHANT_ID=2553023
CCAVENUE_ACCESS_CODE=AVXK75KI17CA37KXCA  
CCAVENUE_WORKING_KEY=A4476C2062138C4BADC1B2B9D52691A8
CCAVENUE_URL=https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction

# ngrok URL (update after starting ngrok)
NGROK_URL=https://your-ngrok-id.ngrok.io
```

## 🚀 Production Deployment

### 1. Get Live Credentials
- Login to CCAvenue merchant dashboard
- Get live Merchant ID, Access Code, Working Key

### 2. Update Environment
```env
CCAVENUE_MERCHANT_ID=your_live_merchant_id
CCAVENUE_ACCESS_CODE=your_live_access_code
CCAVENUE_WORKING_KEY=your_live_working_key
CCAVENUE_URL=https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction
NGROK_URL=https://yourdomain.com
```

### 3. Deploy to cPanel
- Upload files to `public_html`
- Update database credentials
- Set environment variables
- Update callback URLs in CCAvenue dashboard

## 🐛 Common Issues & Solutions

### "Invalid API Key"
```bash
# Check header in requests
x-api-key: your_super_secret_api_key_123
```

### "CCAvenue Module Not Found"
```bash
# Verify file exists
ls backend/ccavenue.js
```

### "Payment Response Not Received"
```bash
# Check ngrok is running
curl https://your-ngrok-id.ngrok.io/health
```

### "Database Connection Failed"
```bash
# Test MySQL connection
mysql -u root -p jewelskart
```

## 📞 Support Resources

- **CCAvenue Docs:** https://www.ccavenue.com/developers
- **Test Cards:** Available in CCAvenue dashboard  
- **Support:** support@ccavenue.com

## ✅ Verification Checklist

- [ ] Backend starts on port 5000
- [ ] Frontend starts on port 3000  
- [ ] ngrok tunnel active
- [ ] Database table created
- [ ] .env file updated with ngrok URL
- [ ] Test payment completes successfully
- [ ] Transaction saved in database

---

🎉 **Your CCAvenue integration is ready for testing!**

Visit: http://localhost:3000/checkout-demo