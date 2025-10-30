# 🚀 CCAvenue Payment Gateway - Complete Setup Guide

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **MySQL** database
3. **ngrok** account (free)
4. **CCAvenue test account** (sandbox)

## 🛠️ Step 1: Install Dependencies

### Backend Dependencies
```bash
cd backend
npm install express mysql2 dotenv cors crypto body-parser nodemailer bcrypt jsonwebtoken multer pdfkit
```

### Frontend Dependencies
```bash
cd ecommerce
npm install axios
```

## 🗄️ Step 2: Database Setup

1. **Create Database:**
```sql
CREATE DATABASE jewelskart;
USE jewelskart;
```

2. **Run SQL Script:**
```bash
mysql -u root -p jewelskart < database-setup.sql
```

## 🔧 Step 3: Environment Configuration

Update `backend/.env`:
```env
# API & Database
API_KEY=your_super_secret_api_key_123
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=jewelskart
JWT_SECRET=my_very_secret_key_2025

# CCAvenue Test Credentials
CCAVENUE_MERCHANT_ID=2553023
CCAVENUE_ACCESS_CODE=AVXK75KI17CA37KXCA
CCAVENUE_WORKING_KEY=A4476C2062138C4BADC1B2B9D52691A8
CCAVENUE_URL=https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction

# ngrok URL (update after starting ngrok)
NGROK_URL=https://your-ngrok-id.ngrok.io
```

## 🌐 Step 4: Setup ngrok for HTTPS

1. **Install ngrok:**
   - Download from: https://ngrok.com/download
   - Extract and add to PATH

2. **Start ngrok:**
```bash
ngrok http 5000
```

3. **Copy HTTPS URL:**
   - Example: `https://abc123.ngrok.io`
   - Update `NGROK_URL` in `.env`

## 🚀 Step 5: Start Applications

### Terminal 1 - Backend
```bash
cd backend
npm start
```

### Terminal 2 - Frontend
```bash
cd ecommerce
npm run dev
```

### Terminal 3 - ngrok
```bash
ngrok http 5000
```

## 🧪 Step 6: Test Payment Flow

1. **Open Frontend:** http://localhost:3000
2. **Navigate to Checkout Demo**
3. **Fill Payment Details:**
   - Name: John Doe
   - Email: john@example.com
   - Amount: 100.00
4. **Click "PAY NOW"**
5. **Use Test Card:**
   - Card: `5123456789012346`
   - CVV: `123`
   - Expiry: Any future date

## 📊 Step 7: Verify Results

### Check Database:
```sql
SELECT * FROM transactions ORDER BY created_at DESC;
```

### Check Backend Logs:
- Payment creation logs
- CCAvenue response logs

### Check Frontend:
- Payment success/failure popup
- Order confirmation

## 🔍 API Endpoints

### Create Payment
```bash
POST http://localhost:5000/api/create-payment
Headers: x-api-key: your_super_secret_api_key_123
Body: {
  "orderId": "ORDER_123",
  "amount": 100.00,
  "customerName": "John Doe",
  "customerEmail": "john@example.com"
}
```

### Payment Response (CCAvenue calls this)
```bash
POST https://your-ngrok-id.ngrok.io/api/payment-response
```

## 🔐 How CCAvenue Encryption Works

### 1. **Payment Request Encryption:**
```javascript
// Data to encrypt
const merchantData = "merchant_id=123&order_id=ORDER_123&amount=100.00";

// Encrypt using AES-128-CBC
const encrypted = crypto.createCipher('aes-128-cbc', WORKING_KEY)
  .update(merchantData, 'utf8', 'hex') + 
  crypto.createCipher('aes-128-cbc', WORKING_KEY).final('hex');
```

### 2. **Payment Response Decryption:**
```javascript
// Decrypt CCAvenue response
const decrypted = crypto.createDecipher('aes-128-cbc', WORKING_KEY)
  .update(encryptedResponse, 'hex', 'utf8') + 
  crypto.createDecipher('aes-128-cbc', WORKING_KEY).final('utf8');
```

## 🚀 Production Deployment

### 1. **Update Environment:**
```env
# Production CCAvenue
CCAVENUE_MERCHANT_ID=your_live_merchant_id
CCAVENUE_ACCESS_CODE=your_live_access_code
CCAVENUE_WORKING_KEY=your_live_working_key
CCAVENUE_URL=https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction

# Production URLs
NGROK_URL=https://yourdomain.com
```

### 2. **cPanel Deployment:**
1. Upload files to `public_html`
2. Update database credentials
3. Set environment variables in cPanel
4. Update callback URLs in CCAvenue dashboard

## 🐛 Troubleshooting

### Common Issues:

1. **"Invalid API Key"**
   - Check `x-api-key` header
   - Verify `.env` API_KEY value

2. **"Database Connection Failed"**
   - Check MySQL credentials
   - Ensure database exists

3. **"CCAvenue Module Not Found"**
   - Check `ccavenue.js` file exists
   - Verify import statements

4. **"Payment Response Not Received"**
   - Check ngrok is running
   - Verify NGROK_URL in `.env`
   - Check CCAvenue callback URL

### Debug Commands:

```bash
# Check backend health
curl http://localhost:5000/health

# Test database connection
node -e "import('./db.js').then(db => db.query('SELECT 1', console.log))"

# Check ngrok status
curl https://your-ngrok-id.ngrok.io/health
```

## 📱 Testing Scenarios

### Successful Payment:
- Use test card: `5123456789012346`
- Should redirect to success page
- Database status: `success`

### Failed Payment:
- Use invalid card: `4111111111111111`
- Should show failure message
- Database status: `failed`

### Cancelled Payment:
- Click "Cancel" on CCAvenue page
- Should redirect to cancel page
- Database status: `cancelled`

## 🔒 Security Best Practices

1. **Never expose Working Key in frontend**
2. **Always validate API keys**
3. **Use HTTPS in production**
4. **Sanitize all inputs**
5. **Log all transactions**
6. **Implement rate limiting**

## 📞 Support

- **CCAvenue Support:** support@ccavenue.com
- **Documentation:** https://www.ccavenue.com/developers
- **Test Cards:** Available in CCAvenue dashboard

---

✅ **Your CCAvenue integration is now ready for testing!**