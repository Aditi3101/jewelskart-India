import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { isNumeric } from '../utils/urlUtils';
import ProductDetailPage from './ProductDetailPage';

const SEOProductWrapper: React.FC = () => {
  const { nameOrId } = useParams<{ nameOrId: string }>();
  const [productId, setProductId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!nameOrId) {
      setError(true);
      setLoading(false);
      return;
    }

    // Check if it's a pure numeric ID
    if (isNumeric(nameOrId)) {
      setProductId(parseInt(nameOrId));
      setLoading(false);
      return;
    }

    // Check if it's ID-name format (e.g., "123-product-name")
    const idMatch = nameOrId.match(/^(\d+)-/);
    if (idMatch) {
      console.log('✅ Found ID in URL:', idMatch[1]);
      setProductId(parseInt(idMatch[1]));
      setLoading(false);
      return;
    }

    // Fallback to name lookup
    {
      console.log('🔍 Looking up product:', nameOrId);
      fetch(`http://localhost:5000/api/product-id/${nameOrId}`)
        .then(res => {
          console.log('📡 Product API Response status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('📦 Product API Response data:', data);
          if (data.p_id) {
            console.log('✅ Found product ID:', data.p_id);
            setProductId(data.p_id);
          } else {
            console.log('❌ No product ID in response');
            setError(true);
          }
        })
        .catch(err => {
          console.log('💥 Product API Error:', err);
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [nameOrId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  if (error || !productId) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Product Not Found</h2>
        <p>Could not find product: "{nameOrId}"</p>
        <p>Please check the console for debugging info.</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  return <ProductDetailPage productId={productId} />;
};

export default SEOProductWrapper;