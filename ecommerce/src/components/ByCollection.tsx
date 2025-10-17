import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import TopNavBar from "./TopNavBar";
import { Link } from "react-router-dom";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";
import axios from "axios";
import ReviewSection from "./ReviewSection";

interface CollectionProduct {
  collection_name: string;
  fileToUpload: string;
}

interface BannerData {
  image_path: string;
  banner_text: string;
}

const ByCollection: React.FC = () => {
  const [collections, setCollections] = useState<CollectionProduct[]>([]);
  const [banner, setBanner] = useState<BannerData | null>(null);

  useEffect(() => {
    // Fetch collections
    fetch("http://localhost:5000/api/collections")
      .then((res) => res.json())
      .then((data) => setCollections(data))
      .catch((err) => console.error("❌ Error fetching collections:", err));

    // Fetch banner where placement = 'ByCollection'
    axios
      .get<any[]>("http://localhost:5000/api/banners/ByCollection")
      .then((res) => {
        if (res.data.length > 0) {
          setBanner({
            image_path: res.data[0].image_url, // already includes /uploads/banner/...
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
            style={{ height: "60vh", width: "100%", display: "block" }}
            src={`http://localhost:5000${banner.image_path}`}
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
      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <button
          style={{
            padding: "14px 40px",
            fontSize: "1.1rem",
            background: "var(--gradient-primary)",
            color: "var(--text-light)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: 32,
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
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "32px",
          padding: "0 20px 60px",
          width: "100%",
          boxSizing: "border-box",
        }}
        className="collection-cards-container"
      >
        {collections.map((item, index) => (
          <Link
            to={`/products/${encodeURIComponent(item.collection_name)}`}
            key={index}
            className="zoom-card"
            style={{
              width: 360,
              border: "1px solid var(--border-light)",
              borderRadius: 16,
              boxShadow: "0 8px 32px var(--shadow-light)",
              overflow: "hidden",
              background: "var(--neutral-white)",
              position: "relative",
              textDecoration: "none",
              color: "inherit",
              transition: "all 0.4s ease",
            }}
          >
            <div style={{ width: "100%", height: 260, position: "relative" }}>
              <img
                src={`http://localhost:5000/uploads/${item.fileToUpload}`}
                alt={item.collection_name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Calm Theme Overlay */}
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
              
              {/* Decorative Border */}
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "16px",
                  right: "16px",
                  height: "2px",
                  background: "var(--primary-sage)",
                  borderRadius: "1px",
                }}
              />

              {/* Text */}
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: 0,
                  width: "100%",
                  color: "var(--neutral-white)",
                  textAlign: "center",
                  padding: "0 16px",
                  zIndex: 2,
                }}
              >
                <h3 style={{ 
                  margin: "0 0 6px 0", 
                  fontWeight: 700, 
                  fontSize: "1.3rem",
                  textShadow: "0 2px 8px rgba(0,0,0,0.5)"
                }}>
                  {item.collection_name}
                </h3>
                <span style={{ 
                  fontSize: "1rem", 
                  fontWeight: 500,
                  color: "var(--primary-sage)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  textShadow: "0 1px 4px rgba(0,0,0,0.3)"
                }}>
                  Shop Now
                </span>
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
            div.collection-cards-container {
              justify-content: flex-start !important;
              padding: 0 10px 60px !important;
            }
            div[style*="width: 360px"] {
              width: 48% !important;
            }
            div[style*="font-size: 2rem"] {
              font-size: 1.5rem !important;
              padding: 0 10px !important;
            }
          }

          @media (max-width: 768px) {
            div.collection-cards-container {
              justify-content: flex-start !important;
              padding: 0 8px 60px !important;
            }
            div[style*="width: 360px"] {
              width: 70% !important;
            }
            div[style*="font-size: 2rem"] {
              font-size: 1.3rem !important;
              padding: 0 8px !important;
            }
          }

          @media (max-width: 480px) {
            div.collection-cards-container {
              justify-content: flex-start !important;
              padding: 0 6px 60px !important;
            }
            div[style*="width: 360px"] {
              width: 100% !important;
              max-width: 100% !important;
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

export default ByCollection;
