import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeCategoryCards from "./HomeCategoryCards.tsx";

interface BannerItem {
  id: number;
  type: string;
  image_url: string;
  link: string;
  placement: string;
  title: string;
}

const Banner: React.FC = () => {
  const [homepageBanners, setHomepageBanners] = useState<BannerItem[]>([]);

  useEffect(() => {
    // Fetch homepage banners
    fetch("http://localhost:5000/api/banners/homepage")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (banner: BannerItem) =>
            banner.type &&
            banner.type.trim().toLowerCase() === "main homepage banner"
        );
        setHomepageBanners(filtered.slice(0, 2)); // only first 2 matching banners
      })
      .catch((err) =>
        console.error("❌ Error fetching homepage banners:", err)
      );
  }, []);

  return (
    <>
      {/* Top Two Dynamic Banners */}
      <div
        style={{
          display: "flex",
          width: "100%",
          maxHeight: "650px",
          padding: "24px",
          boxSizing: "border-box",
          gap: "24px",
          overflow: "hidden",
          background: "var(--bg-primary)",
        }}
      >
        {homepageBanners.map((banner) => (
          <Link
            key={banner.id}
            to={banner.link || "#"}
            style={{
              position: "relative",
              flex: 1,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {/* <img
              src={`http://localhost:5000${banner.image_url}`}
              alt={banner.type}
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "100%",
                objectFit: "cover",
                borderRadius: "16px",
                display: "block",
                transition: "transform 0.6s ease",
                filter: "brightness(0.9) contrast(1.1)",
              }}
            /> */}
            {/* Luxury Overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(135deg, rgba(26, 35, 50, 0.3) 0%, rgba(212, 175, 55, 0.2) 100%)",
                borderRadius: "16px",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "32px",
                left: "32px",
                right: "32px",
                color: "var(--neutral-white)",
                textAlign: "center",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  fontFamily: "serif",
                  textShadow: "0 4px 12px rgba(0,0,0,0.6)",
                  marginBottom: "8px",
                  letterSpacing: "1px",
                }}
              >
                {banner.title}
              </div>
              <div
                style={{
                  width: "60px",
                  height: "2px",
                  background: "var(--primary-gold)",
                  margin: "0 auto",
                  borderRadius: "1px",
                }}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Title */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ background: "var(--bg-primary)", padding: "60px 20px 20px" }}
      >
        <div className="text-center">
          <h1
            style={{
              color: "var(--primary-teal)",
              fontSize: "4rem",
              fontWeight: "700",
              letterSpacing: "2px",
              marginBottom: "16px",
              fontFamily: '"Monotype Corsiva", cursive',
            }}
          >
            Discover Our Collections
          </h1>
          <div
            style={{
              width: "120px",
              height: "3px",
              background: "var(--primary-sage)",
              margin: "0 auto 16px",
              borderRadius: "2px",
            }}
          />
          <p
            style={{
              color: "#F8C471",
              fontSize: "1.5rem",
              fontWeight: "400",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            Exquisite jewelry crafted with precision and passion
          </p>
        </div>
      </div>

      {/* Category Cards */}
      <HomeCategoryCards />
    </>
  );
};

export default Banner;
