// Quick test script for CCAvenue integration
import axios from 'axios';

const API_BASE = 'http://localhost:5000';
const API_KEY = 'your_super_secret_api_key_123';

async function testCCAvenue() {
  console.log('🧪 Testing CCAvenue Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Create Payment
    console.log('2️⃣ Testing Payment Creation...');
    const paymentData = {
      orderId: `TEST_${Date.now()}`,
      amount: 100.00,
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      customerPhone: '9999999999',
      billingAddress: 'Test Address'
    };

    const paymentResponse = await axios.post(`${API_BASE}/api/create-payment`, paymentData, {
      headers: { 'x-api-key': API_KEY }
    });

    if (paymentResponse.data.success) {
      console.log('✅ Payment Created Successfully!');
      console.log('📋 Payment Data:', {
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        encRequest: paymentResponse.data.paymentData.encRequest.substring(0, 50) + '...',
        accessCode: paymentResponse.data.paymentData.accessCode
      });
    } else {
      console.log('❌ Payment Creation Failed:', paymentResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

// Run tests
testCCAvenue();