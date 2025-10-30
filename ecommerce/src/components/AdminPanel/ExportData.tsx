import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ExportData: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (type: 'products' | 'orders' | 'users') => {
    setLoading(type);
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`https://jewelskart-backend.onrender.com/admin/export/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Export Data</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        
        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#007bff', marginBottom: '10px' }}>📦 Products</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>Export all products data</p>
          <button
            onClick={() => handleExport('products')}
            disabled={loading === 'products'}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: loading === 'products' ? 'not-allowed' : 'pointer',
              opacity: loading === 'products' ? 0.6 : 1
            }}
          >
            {loading === 'products' ? 'Exporting...' : 'Export Products'}
          </button>
        </div>

        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#28a745', marginBottom: '10px' }}>🛒 Orders</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>Export all orders data</p>
          <button
            onClick={() => handleExport('orders')}
            disabled={loading === 'orders'}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: loading === 'orders' ? 'not-allowed' : 'pointer',
              opacity: loading === 'orders' ? 0.6 : 1
            }}
          >
            {loading === 'orders' ? 'Exporting...' : 'Export Orders'}
          </button>
        </div>

        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#ffc107', marginBottom: '10px' }}>👥 Users</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>Export all users data</p>
          <button
            onClick={() => handleExport('users')}
            disabled={loading === 'users'}
            style={{
              background: '#ffc107',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: loading === 'users' ? 'not-allowed' : 'pointer',
              opacity: loading === 'users' ? 0.6 : 1
            }}
          >
            {loading === 'users' ? 'Exporting...' : 'Export Users'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExportData;