
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createSlug } from "../utils/urlUtils";

interface Category {
  catagory_id: number;
  catagory_name: string;
  image: string;
  type_name: string;
  type_id: number;
}

const CategoryCards: React.FC<{ typeId: number }> = ({ typeId }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(`https://jewelskart-backend.onrender.com/categories/type/${typeId}`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error loading categories:", err));
  }, [typeId]);

  return (
    <div style={{ width: "100%", padding: "40px 0", background: 'var(--bg-secondary)' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          width: "100%",
          padding: "0 32px",
          boxSizing: "border-box",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
        className="category-grid"
      >
        {categories.map((cat) => (
          <Link
            key={cat.catagory_id}
            to={`/products/category/${createSlug(cat.catagory_name)}`}
            className="zoom-card"
            style={{
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <div
              style={{
                position: "relative",
                height: "320px",
                borderRadius: "16px",
                overflow: "hidden",
                background: "var(--neutral-white)",
                boxShadow: "0 8px 32px var(--shadow-light)",
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
                src={`https://jewelskart-backend.onrender.com/images/${cat.image}`}
                alt={cat.catagory_name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.6s ease",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "20px",
                  right: "20px",
                  height: "2px",
                  background: "var(--primary-sage)",
                  borderRadius: "1px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "24px",
                  right: "24px",
                  color: "var(--neutral-white)",
                }}
              >
                <div style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  marginBottom: '8px',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                }}>
                  {cat.catagory_name}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: '#590330',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Explore Collection
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;
