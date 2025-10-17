import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createSlug } from '../utils/urlUtils';

const SEOTest: React.FC = () => {
  const [types, setTypes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Fetch types
    fetch('http://localhost:5000/api/types')
      .then(res => res.json())
      .then(data => setTypes(data))
      .catch(err => console.error('Error fetching types:', err));

    // Fetch categories
    fetch('http://localhost:5000/categories')
      .then(res => res.json())
      .then(data => setCategories(data.slice(0, 5))) // Just first 5
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>SEO URL Test Page</h2>
      
      <h3>Type Links (SEO URLs)</h3>
      <ul>
        {types.map(type => (
          <li key={type.type_id} style={{ marginBottom: '10px' }}>
            <Link 
              to={`/type/${createSlug(type.type_name)}`}
              style={{ color: 'blue', textDecoration: 'underline' }}
            >
              {type.type_name} → /type/{createSlug(type.type_name)}
            </Link>
          </li>
        ))}
      </ul>

      <h3>Category Links (SEO URLs)</h3>
      <ul>
        {categories.map(cat => (
          <li key={cat.catagory_id} style={{ marginBottom: '10px' }}>
            <Link 
              to={`/products/category/${createSlug(cat.catagory_name)}`}
              style={{ color: 'green', textDecoration: 'underline' }}
            >
              {cat.catagory_name} → /products/category/{createSlug(cat.catagory_name)}
            </Link>
          </li>
        ))}
      </ul>

      <h3>Backend API Tests</h3>
      <p>Test these URLs directly in browser:</p>
      <ul>
        {types.map(type => (
          <li key={`api-${type.type_id}`}>
            <a 
              href={`http://localhost:5000/api/type-id/${createSlug(type.type_name)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              API: /api/type-id/{createSlug(type.type_name)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SEOTest;