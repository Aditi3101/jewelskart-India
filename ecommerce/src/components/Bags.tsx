import React, { useEffect, useState } from "react";
import TopNavBar from "../components/TopNavBar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";
import axios from "axios";
import { createSlug } from "../utils/urlUtils";

interface Category {
  catagory_id: number;
  catagory_name: string;
  image: string;
  type_name: string;
}

interface BannerData {
  image_path: string;
  banner_text: string;
}

const Bags: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [banner, setBanner] = useState<BannerData | null>(null);

  useEffect(() => {
    // Fetch categories
    fetch("https://jewelskart-backend.onrender.com/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("❌ Error fetching categories:", err));

    // Fetch banner using placement = 'Bag-Banner'
    axios
      .get<any[]>("https://jewelskart-backend.onrender.com/api/banners/Bag-Banner")
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

      {/* Banner */}
      {banner ? (
        <div style={{ position: "relative" }}>
          <img
            style={{ height: "60vh", width: "100%", display: "block" }}
            src={`https://jewelskart-backend.onrender.com${banner.image_path}`}
            alt="Banner"
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
            }}
          >
            {banner.banner_text}
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: 50 }}>Loading banner...</p>
      )}

      {/* Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 24,
          width: "100%",
        }}
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
            marginBottom: 36,
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

      {/* Cards */}
      <div style={{ width: "100%", padding: "40px 0", background: 'var(--bg-secondary)' }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
            width: "100%",
            padding: "0 32px",
            boxSizing: "border-box",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          {categories
            .filter((cat) => cat.type_name === "Bags")
            .map((cat) => (
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
                    height: "350px",
                    borderRadius: "20px",
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
                      fontSize: "1.5rem", 
                      fontWeight: "700",
                      fontFamily: "serif",
                      marginBottom: "8px",
                      textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                    }}>
                      {cat.catagory_name}
                    </div>
                    <div style={{ 
                      fontSize: "1rem", 
                      fontWeight: "500",
                      color: "var(--primary-sage)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      textShadow: "0 1px 4px rgba(0,0,0,0.2)"
                    }}>
                      Explore Collection
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Bags;
