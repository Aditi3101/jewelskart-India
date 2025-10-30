import React, { useState } from 'react';
import axios from 'axios';

const CheckoutDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '9999999999',
    amount: '100.00',
    billingAddress: 'Test Address, Mumbai'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Generate unique order ID
      const orderId = `ORDER_${Date.now()}`;
      
      // Call backend to create payment
      const response = await axios.post('http://localhost:5000/api/create-payment', {
        orderId,
        amount: parseFloat(formData.amount),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        billingAddress: formData.billingAddress
      }, {
        headers: {
          'x-api-key': 'your_super_secret_api_key_123'
        }
      });

      if (response.data.success) {
        const { paymentData, ccavenueUrl } = response.data;
        
        // Create form and submit to CCAvenue
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = ccavenueUrl;
        form.target = '_blank'; // Open in new window
        
        // Add encrypted request
        const encRequestInput = document.createElement('input');
        encRequestInput.type = 'hidden';
        encRequestInput.name = 'encRequest';
        encRequestInput.value = paymentData.encRequest;
        form.appendChild(encRequestInput);
        
        // Add access code
        const accessCodeInput = document.createElement('input');
        accessCodeInput.type = 'hidden';
        accessCodeInput.name = 'access_code';
        accessCodeInput.value = paymentData.accessCode;
        form.appendChild(accessCodeInput);
        
        // Submit form
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
        alert(`Payment initiated! Order ID: ${orderId}`);
      } else {
        alert('Payment initiation failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>🛒 CCAvenue Payment Demo</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Customer Name:</label>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Email:</label>
        <input
          type="email"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Phone:</label>
        <input
          type="tel"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Amount (₹):</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          min="1"
          step="0.01"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Billing Address:</label>
        <input
          type="text"
          name="billingAddress"
          value={formData.billingAddress}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '⏳ Processing...' : '💳 PAY NOW'}
      </button>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>📋 Test Instructions:</h4>
        <ul style={{ fontSize: '14px' }}>
          <li>Use test card: <strong>5123456789012346</strong></li>
          <li>CVV: <strong>123</strong></li>
          <li>Expiry: Any future date</li>
          <li>Payment will open in new window</li>
        </ul>
      </div>
    </div>
  );
};

export default CheckoutDemo;