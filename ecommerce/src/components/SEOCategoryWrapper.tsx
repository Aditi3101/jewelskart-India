import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { isNumeric } from '../utils/urlUtils';
import ProductsByCategory from './ProductsByCategory';

const SEOCategoryWrapper: React.FC = () => {
  const { nameOrId } = useParams<{ nameOrId: string }>();
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!nameOrId) {
      setError(true);
      setLoading(false);
      return;
    }

    if (isNumeric(nameOrId)) {
      setCategoryId(parseInt(nameOrId));
      setLoading(false);
    } else {
      console.log('🔍 Looking up category:', nameOrId);
      fetch(`https://jewelskart-backend.onrender.com/api/category-id/${nameOrId}`)
        .then(res => {
          console.log('📡 API Response status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('📦 API Response data:', data);
          if (data.catagory_id) {
            console.log('✅ Found category ID:', data.catagory_id);
            setCategoryId(data.catagory_id);
          } else {
            console.log('❌ No category ID in response');
            setError(true);
          }
        })
        .catch(err => {
          console.log('💥 API Error:', err);
          setError(true);
        })
        .finally(() => setLoading(false));
    }
  }, [nameOrId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  if (error || !categoryId) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Category Not Found</h2>
        <p>Could not find category: "{nameOrId}"</p>
        <p>Please check the console for debugging info.</p>
        <button onClick={() => window.location.href = '/'}>Go Home</button>
      </div>
    );
  }

  return <ProductsByCategory categoryId={categoryId} />;
};

export default SEOCategoryWrapper;