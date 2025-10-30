
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Category {
  catagory_id: number;
  catagory_name: string;
  image: string;
  type_name: string;
  type_id: number;
}

interface BagCategoryCardsProps {
  typeId: number;
  title?: string;
}

const BagCategoryCards: React.FC<BagCategoryCardsProps> = ({ typeId, title = "Featured Collections" }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(`https://jewelskart-backend.onrender.com/categories/type/${typeId}`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error loading categories:", err));
  }, [typeId]);

  return (
    <div style={{ width: "100%", background: 'var(--bg-accent)', padding: '60px 0' }}>
      <div className="text-center" style={{ marginBottom: '48px' }}>
        <h2 
          style={{ 
            color: 'var(--primary-teal)',
            fontFamily: 'serif',
            fontSize: '2.5rem',
            fontWeight: '700',
            letterSpacing: '1px',
            marginBottom: '16px',
            textTransform: 'uppercase'
          }}
        >
          {title}
        </h2>
        <div
          style={{
            width: '100px',
            height: '3px',
            background: 'var(--primary-sage)',
            margin: '0 auto',
            borderRadius: '2px'
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "center",
          gap: "30px",
          padding: "0 40px",
          maxWidth: "1500px",
          margin: "0 auto",
          overflowX: "hidden",
        }}
      >
        {categories
          .slice(0, 4)
          .map((cat) => (
            <Link
              key={cat.catagory_id}
              to={`/products/category/${cat.catagory_id}`}
              className="zoom-card"
              style={{
                flex: "0 0 320px",
                minWidth: "320px",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: "400px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "var(--neutral-white)",
                  boxShadow: "0 8px 32px var(--shadow-light)",
                  border: "1px solid var(--border-light)",
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
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(to top, rgba(15, 118, 110, 0.7) 0%, rgba(15, 118, 110, 0.2) 50%, rgba(132, 204, 22, 0.1) 100%)",
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
                    bottom: "32px",
                    left: "24px",
                    right: "24px",
                    color: "var(--neutral-white)",
                    zIndex: 2,
                  }}
                >
                  <div style={{ 
                    fontSize: "1.4rem", 
                    fontWeight: "700",
                    fontFamily: "serif",
                    marginBottom: "6px",
                    textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                  }}>
                    {cat.catagory_name}
                  </div>
                  <div style={{ 
                    fontSize: "0.95rem", 
                    fontWeight: "500",
                    color: "var(--primary-sage)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textShadow: "0 1px 4px rgba(0,0,0,0.3)"
                  }}>
                    Discover Now
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default BagCategoryCards;
