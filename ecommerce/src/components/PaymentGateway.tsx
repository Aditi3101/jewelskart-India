import React, { useEffect } from 'react';

interface PaymentData {
  encRequest: string;
  accessCode: string;
  merchantId: string;
}

interface PaymentGatewayProps {
  paymentData: PaymentData;
  ccavenueUrl: string;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ paymentData, ccavenueUrl }) => {
  useEffect(() => {
    // Auto-submit the form when component mounts
    const form = document.getElementById('ccavenue-form') as HTMLFormElement;
    if (form) {
      form.submit();
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            animation: 'spin 2s linear infinite'
          }}>
            <span style={{ color: 'white', fontSize: '24px' }}>💳</span>
          </div>
          <h2 style={{ color: '#333', marginBottom: '10px' }}>Redirecting to Payment Gateway</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Please wait while we redirect you to CCAvenue...</p>
        </div>

        <form 
          id="ccavenue-form" 
          method="post" 
          action={ccavenueUrl}
          style={{ display: 'none' }}
        >
          <input type="hidden" name="encRequest" value={paymentData.encRequest} />
          <input type="hidden" name="access_code" value={paymentData.accessCode} />
        </form>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '8px',
          color: '#666',
          fontSize: '12px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: '#4CAF50',
            borderRadius: '50%',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}></div>
          <span>Secure Payment Processing</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default PaymentGateway;