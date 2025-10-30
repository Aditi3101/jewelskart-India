import React, { useState } from 'react';
import axios from 'axios';

const ProductTest: React.FC = () => {
  const [result, setResult] = useState<string>('');

  const testConnection = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:5000/admin/test', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(`Connection test: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setResult(`Connection error: ${error.message}`);
    }
  };

  const testProductAdd = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      
      formData.append('p_name', 'Test Product');
      formData.append('p_code', `TEST_${Date.now()}`);
      formData.append('p_price', '100');
      formData.append('catagory_name', 'Test Category');
      formData.append('type_name', 'Test Type');
      formData.append('status', 'y');
      
      const response = await axios.post('http://localhost:5000/admin/products', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(`Product add test: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setResult(`Product add error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Product Management Test</h2>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testConnection} style={{ marginRight: '10px' }}>
          Test Connection
        </button>
        <button onClick={testProductAdd}>
          Test Product Add
        </button>
      </div>
      <div style={{ 
        background: '#f5f5f5', 
        padding: '10px', 
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace'
      }}>
        {result || 'No test run yet'}
      </div>
    </div>
  );
};

export default ProductTest;