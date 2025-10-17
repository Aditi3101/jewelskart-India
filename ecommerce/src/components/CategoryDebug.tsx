import React, { useEffect, useState } from 'react';
import { createSlug } from '../utils/urlUtils';

const CategoryDebug: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/categories')
      .then(res => res.json())
      .then(data => {
        console.log('All categories:', data);
        setCategories(data);
      })
      .catch(err => console.error('Error:', err));
  }, []);

  const testCategoryAPI = async (categoryName: string) => {
    const slug = createSlug(categoryName);
    console.log(`Testing: ${categoryName} → ${slug}`);
    
    try {
      const response = await fetch(`http://localhost:5000/api/category-id/${slug}`);
      const data = await response.json();
      console.log(`Result for ${slug}:`, data);
    } catch (err) {
      console.error(`Error for ${slug}:`, err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Category Debug</h2>
      
      <h3>All Categories in Database:</h3>
      <ul>
        {categories.map(cat => (
          <li key={cat.catagory_id} style={{ marginBottom: '10px' }}>
            <strong>ID:</strong> {cat.catagory_id} | 
            <strong> Name:</strong> "{cat.catagory_name}" | 
            <strong> Type:</strong> {cat.type_name} | 
            <strong> Slug:</strong> {createSlug(cat.catagory_name)}
            <br />
            <button 
              onClick={() => testCategoryAPI(cat.catagory_name)}
              style={{ marginTop: '5px', padding: '5px 10px' }}
            >
              Test API for "{cat.catagory_name}"
            </button>
          </li>
        ))}
      </ul>

      <h3>Bag Categories Only:</h3>
      <ul>
        {categories
          .filter(cat => cat.type_name === "Bags")
          .map(cat => (
            <li key={cat.catagory_id}>
              {cat.catagory_name} → {createSlug(cat.catagory_name)}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CategoryDebug;