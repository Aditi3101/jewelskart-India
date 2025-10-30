import React, { useEffect, useState } from 'react';
import { createSlug } from '../utils/urlUtils';

const ProductDebug: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Get products from clutches category
    fetch('https://jewelskart-backend.onrender.com/api/category-id/clutches')
      .then(res => res.json())
      .then(data => {
        if (data.catagory_id) {
          return fetch(`https://jewelskart-backend.onrender.com/api/products/category/${data.catagory_id}`);
        }
      })
      .then(res => res?.json())
      .then(data => {
        console.log('Clutches products:', data);
        setProducts(data || []);
      })
      .catch(err => console.error('Error:', err));
  }, []);

  const testProductAPI = async (productName: string) => {
    const slug = createSlug(productName);
    console.log(`Testing: ${productName} → ${slug}`);
    
    try {
      const response = await fetch(`https://jewelskart-backend.onrender.com/api/product-id/${slug}`);
      const data = await response.json();
      console.log(`Result for ${slug}:`, data);
    } catch (err) {
      console.error(`Error for ${slug}:`, err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Product Debug - Clutches Category</h2>
      
      <h3>Products in Clutches Category:</h3>
      <ul>
        {products.map(product => (
          <li key={product.p_id} style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '10px' }}>
            <strong>ID:</strong> {product.p_id}<br />
            <strong>Name:</strong> "{product.p_name}"<br />
            <strong>Code:</strong> {product.p_code}<br />
            <strong>Price:</strong> ₹{product.p_price}<br />
            <strong>Slug:</strong> {createSlug(product.p_name)}<br />
            <strong>Generated URL:</strong> /product/{createSlug(product.p_name)}
            <br />
            <button 
              onClick={() => testProductAPI(product.p_name)}
              style={{ marginTop: '5px', padding: '5px 10px' }}
            >
              Test API for "{product.p_name}"
            </button>
            <br />
            <a 
              href={`/product/${createSlug(product.p_name)}`}
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              Visit Product Page
            </a>
          </li>
        ))}
      </ul>

      {products.length === 0 && (
        <p>No products found in clutches category. Check console for errors.</p>
      )}
    </div>
  );
};

export default ProductDebug;