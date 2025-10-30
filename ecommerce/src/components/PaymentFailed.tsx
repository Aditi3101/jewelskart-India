import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const PaymentFailed: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const reason = searchParams.get('reason');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
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
          background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px'
        }}>
          <span style={{ color: 'white', fontSize: '40px' }}>✗</span>
        </div>

        <h1 style={{
          color: '#ff6b6b',
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '20px'
        }}>
          Payment Failed
        </h1>

        <p style={{
          color: '#666',
          fontSize: '1.1rem',
          marginBottom: '20px',
          lineHeight: '1.6'
        }}>
          We're sorry, but your payment could not be processed at this time.
        </p>

        {reason && (
          <div style={{
            background: '#fff5f5',
            border: '1px solid #fed7d7',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '30px'
          }}>
            <p style={{ color: '#c53030', margin: 0, fontSize: '14px' }}>
              <strong>Reason:</strong> {reason}
            </p>
          </div>
        )}

        {orderId && (
          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px'
          }}>
            <div>
              <strong style={{ color: '#333' }}>Order ID:</strong>
              <span style={{ color: '#666', marginLeft: '10px' }}>{orderId}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/cart"
            style={{
              background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
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
            Try Again
          </Link>
          
          <Link
            to="/"
            style={{
              background: 'transparent',
              color: '#ff6b6b',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              border: '2px solid #ff6b6b',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ff6b6b';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#ff6b6b';
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;