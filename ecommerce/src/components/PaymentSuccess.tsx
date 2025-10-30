import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const trackingId = searchParams.get('trackingId');

  useEffect(() => {
    // Clear any cart data from localStorage
    localStorage.removeItem('cart');
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '60px 40px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #4CAF50, #45a049)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          animation: 'checkmark 0.6s ease-in-out'
        }}>
          <span style={{ color: 'white', fontSize: '40px' }}>✓</span>
        </div>

        <h1 style={{
          color: '#4CAF50',
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '20px'
        }}>
          Payment Successful!
        </h1>

        <p style={{
          color: '#666',
          fontSize: '1.1rem',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          Thank you for your purchase. Your order has been confirmed and you will receive an email confirmation shortly.
        </p>

        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#333' }}>Order ID:</strong>
            <span style={{ color: '#666', marginLeft: '10px' }}>{orderId}</span>
          </div>
          {trackingId && (
            <div>
              <strong style={{ color: '#333' }}>Transaction ID:</strong>
              <span style={{ color: '#666', marginLeft: '10px' }}>{trackingId}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/orders"
            style={{
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            View Orders
          </Link>
          
          <Link
            to="/"
            style={{
              background: 'transparent',
              color: '#4CAF50',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              border: '2px solid #4CAF50',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4CAF50';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#4CAF50';
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes checkmark {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;