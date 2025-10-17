import React, { useEffect, useState } from "react";
import TopNavBar from "./TopNavBar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";
import ReviewSection from "./ReviewSection";

interface Category {
  catagory_id: number;
  catagory_name: string;
  type_name: string;
  image: string;
  type_id: number;
}

interface BannerData {
  image_path: string;
  banner_text: string;
}

const ByCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [banner, setBanner] = useState<BannerData | null>(null);

  useEffect(() => {
    // Fetch categories
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("❌ Error fetching categories:", err));

    // Fetch banner using placement = 'ByCategory'
    axios
      .get<any[]>("http://localhost:5000/api/banners/ByCategory")
      .then((res) => {
        if (res.data.length > 0) {
          setBanner({
            image_path: res.data[0].image_url, // backend already returns /uploads/banner/...
            banner_text: res.data[0].title,
          });
        }
      })
      .catch((err) => console.error("❌ Error fetching banner:", err));
  }, []);

  return (
    <>
      <TopNavBar />
      <ResponsiveNavBarWrapper />

      {banner ? (
        <div style={{ position: "relative" }}>
          <img
            src={`http://localhost:5000${banner.image_path}`}
            alt="Banner"
            style={{ height: "60vh", width: "100%", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "2rem",
              fontWeight: "bold",
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            {banner.banner_text}
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: 50 }}>Loading banner...</p>
      )}

      <div
        style={{ display: "flex", justifyContent: "center", margin: "24px 0" }}
      >
        <button
          style={{
            padding: "14px 40px",
            fontSize: "1.1rem",
            background: "var(--gradient-primary)",
            color: "var(--text-light)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px var(--shadow-light)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 20px var(--shadow-medium)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px var(--shadow-light)";
          }}
        >
          View All Products
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          padding: "0 16px 40px",
        }}
      >
        {categories
          .slice(0, 12)
          .map((cat) => (
            <Link
              key={cat.catagory_id}
              to={`/products/category/${cat.catagory_id}`}
              style={{
                textDecoration: "none",
                flex: "1 1 25%",
                maxWidth: "25%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            >
              <div
                className="zoom-card"
                style={{
                  position: "relative",
                  width: "100%",
                  height: "330px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "var(--neutral-white)",
                  boxShadow: "0 8px 32px var(--shadow-light)",
                  border: "1px solid var(--border-light)",
                  transition: "all 0.4s ease",
                }}
              >
                <img
                  src={`http://localhost:5000/images/${cat.image}`}
                  alt={cat.catagory_name}
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
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(to top, rgba(15, 118, 110, 0.4) 0%, rgba(15, 118, 110, 0.1) 50%, rgba(132, 204, 22, 0.05) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                    height: "2px",
                    background: "var(--primary-sage)",
                    borderRadius: "1px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "28px",
                    left: "20px",
                    right: "20px",
                    color: "var(--neutral-white)",
                    zIndex: 2,
                  }}
                >
                  <div style={{ 
                    fontSize: "1.5rem", 
                    fontWeight: "700",
                    marginBottom: "6px",
                    textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                  }}>
                    {cat.catagory_name}
                  </div>
                  <div style={{ 
                    fontSize: "1rem", 
                    fontWeight: "500",
                    color: "var(--primary-sage)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textShadow: "0 1px 4px rgba(0,0,0,0.3)"
                  }}>
                    Shop Now
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>

      <ReviewSection />
      <Footer />

      {/* Responsive Styles */}
      <style>
        {`
          @media (max-width: 1024px) {
            a {
              flex: 1 1 33.33% !important;
              max-width: 33.33% !important;
            }
            div[style*="height: 330px"] {
              height: 280px !important;
            }
            div[style*="font-size: 2rem"] {
              font-size: 1.5rem !important;
              padding: 0 10px !important;
            }
          }

          @media (max-width: 768px) {
            a {
              flex: 1 1 50% !important;
              max-width: 50% !important;
            }
            div[style*="height: 330px"] {
              height: 240px !important;
            }
            div[style*="font-size: 2rem"] {
              font-size: 1.3rem !important;
              padding: 0 8px !important;
            }
          }

          @media (max-width: 480px) {
            a {
              flex: 1 1 100% !important;
              max-width: 100% !important;
            }
            div[style*="height: 330px"] {
              height: 200px !important;
            }
            div[style*="font-size: 2rem"] {
              font-size: 1.1rem !important;
              padding: 0 6px !important;
            }
            button {
              width: 90% !important;
              padding: 12px 0 !important;
              font-size: 1.1rem !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default ByCategory;
