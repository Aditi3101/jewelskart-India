import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import TopNavBar from "./TopNavBar";
import Footer from "./Footer";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";
import { createSlug } from "../utils/urlUtils";

interface ProductsByCategoryProps {
  categoryId?: number;
}

const ProductsByCategory: React.FC<ProductsByCategoryProps> = ({ categoryId: propCategoryId }) => {
  const { categoryId: paramCategoryId } = useParams();
  const categoryId = propCategoryId || paramCategoryId;
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);

  useEffect(() => {
    if (categoryId) {
      // Fetch category info
      fetch(`http://localhost:5000/categories/${categoryId}`)
        .then((res) => res.json())
        .then((data) => setCategory(data))
        .catch((err) => console.error("Error fetching category:", err));

      // Fetch products
      axios
        .get<any[]>(`http://localhost:5000/api/products/category/${categoryId}`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Error fetching products:", err));
    }
  }, [categoryId]);

  return (
    <div>
      <TopNavBar />
      <ResponsiveNavBarWrapper />

      <div style={{ width: "100%", padding: "20px 0" }}>
        <h3 className="text-center">{category?.catagory_name || `Category ${categoryId}`}</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            padding: "0 32px",
            boxSizing: "border-box",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
          className="category-grid"
        >
          {products.length > 0 ? (
            products.map((p) => (
              <Link
                to={`/product/${p.p_id}-${createSlug(p.p_name)}`}
                key={p.p_id}
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
                    src={`http://localhost:5000/uploads/${p.fileToUpload}`}
                    alt={p.p_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
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
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      color: '#590330'
                    }}>
                      {p.p_name}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: '#590330',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      ₹ {p.p_price} — {p.p_code}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-muted text-center">No Records Found</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsByCategory;