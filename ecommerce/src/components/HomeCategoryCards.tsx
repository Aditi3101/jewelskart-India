import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createSlug } from '../utils/urlUtils';

interface Category {
  catagory_id: number;
  catagory_name: string;
  image: string;
  type_name: string;
}

const HomeCategoryCards: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
          className="category-grid"
        >
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category.catagory_id}
              to={`/products/category/${createSlug(category.catagory_name)}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  position: 'relative',
                  height: '320px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: 'var(--neutral-white)',
                  boxShadow: '0 8px 32px var(--shadow-light)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 16px 48px var(--shadow-medium)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px var(--shadow-light)';
                }}
              >
                <img
                  src={`http://localhost:5000/images/${category.image}`}
                  alt={category.catagory_name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '24px',
                    right: '24px',
                    color: 'var(--neutral-white)',
                  }}
                >
                  <div style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    marginBottom: '8px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                  }}>
                    {category.catagory_name}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#F8C471',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {category.type_name}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeCategoryCards;

// Add mobile responsive styles
const styles = `
  <style>
    @media (max-width: 768px) {
      .category-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
        gap: 20px !important;
        padding: 0 10px;
      }
    }
    
    @media (max-width: 480px) {
      .category-grid {
        grid-template-columns: 1fr !important;
        gap: 16px !important;
        padding: 0 5px;
      }
    }
  </style>
`;

// Inject styles
if (typeof document !== 'undefined' && !document.getElementById('category-mobile-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'category-mobile-styles';
  styleElement.innerHTML = styles.replace(/<\/?style>/g, '');
  document.head.appendChild(styleElement);
}