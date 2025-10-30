

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Banner {
  id: number;
  title: string;
  type: string;
  image_url: string;
  link: string;
  placement: string;
}

const HomeCarousel: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get<Banner[]>(
          "https://jewelskart-backend.onrender.com/api/banners/carousal" // ✅ UPDATED
        );
       const homepageBanners = res.data; // ✅ no filtering

        setBanners(homepageBanners);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
        setError("Failed to load banners");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) return <p className="text-center">Loading carousel...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;
  if (banners.length === 0) return <p className="text-center">No banners available.</p>;

  return (
    <section className="home-carousel-section">
      <div className="container-fluid px-0">
        <div className="text-center mb-3">
          <h1 className="carousel-title">Timeless Elegance In Every Piece</h1>
          <div className="title-underline"></div>
        </div>

        <div className="carousel-container">
          <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4000">
            <div className="carousel-indicators d-none d-md-flex">
              {banners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#homeCarousel"
                  data-bs-slide-to={index}
                  className={index === 0 ? "active" : ""}
                  aria-current={index === 0 ? "true" : "false"}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>

            <div className="carousel-inner">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <div className="carousel-image-wrapper">
                    <img
                      src={`http://localhost:5000${banner.image_url}`}
                      className="carousel-image"
                      alt={banner.title}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                    {index !== 1 && <div className="carousel-overlay"></div>}
                  </div>
                  {banner.title && (
                    <div className="carousel-caption">
                      <h3 className="carousel-caption-title">{banner.title}</h3>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>

            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .home-carousel-section {
          background: #f9f2f6;
        }

        .carousel-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #590330;
          margin-bottom: 1rem;
          letter-spacing: 1.5px;
          font-family: "Monotype Corsiva", cursive;
        }

        .title-underline {
          width: 70px;
          height: 3px;
          background: #F8C471;
          margin: 0 auto;
          border-radius: 2px;
        }

        .carousel-container {
          width: 100%;
          margin: 0;
          border-radius: 0;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        .carousel-image-wrapper {
          position: relative;
          height: 550px;
          overflow: hidden;
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center bottom;
          transition: transform 0.3s ease;
          display: block;
        }

        .carousel-item:nth-child(2) .carousel-overlay {
          display: none;
        }
        
        .carousel-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%);
        }

        .carousel-caption {
          position: absolute;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 10;
        }

        .carousel-caption-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: white;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
          margin: 0;
        }

        .carousel-indicators {
          bottom: 12px;
        }

        .carousel-indicators [data-bs-target] {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin: 0 3px;
          background-color: rgba(255,255,255,0.6);
          border: 2px solid white;
          transition: all 0.3s ease;
        }

        .carousel-indicators .active {
          background-color: white;
          transform: scale(1.2);
        }

        .carousel-control-prev,
        .carousel-control-next {
          width: 55px;
          height: 55px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          border: none;
          transition: all 0.3s ease;
        }

        .carousel-control-prev {
          left: 15px;
        }

        .carousel-control-next {
          right: 15px;
        }

        .carousel-control-prev:hover,
        .carousel-control-next:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          width: 22px;
          height: 22px;
          background-size: 22px;
          filter: invert(1);
        }

        @media (max-width: 768px) {
          .home-carousel-section {
            padding: 2rem 0;
          }

          .carousel-title {
            font-size: 1.6rem;
            letter-spacing: 1px;
          }

          .carousel-container {
            border-radius: 0;
            margin: 0;
          }

          .carousel-image-wrapper {
            height: 280px;
          }

          .carousel-caption-title {
            font-size: 1.3rem;
            padding: 0 10px;
          }

          .carousel-control-prev,
          .carousel-control-next {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .home-carousel-section {
            padding: 1.5rem 0;
          }

          .carousel-title {
            font-size: 1.3rem;
            margin-bottom: 0.8rem;
          }

          .title-underline {
            width: 50px;
            height: 2px;
          }

          .carousel-container {
            border-radius: 0;
            margin: 0;
          }

          .carousel-image-wrapper {
            height: 220px;
          }

          .carousel-caption {
            bottom: 15px;
          }

          .carousel-caption-title {
            font-size: 1rem;
            padding: 0 8px;
          }

          .carousel-control-prev,
          .carousel-control-next {
            display: none;
          }
        }
        
        @media (max-width: 360px) {
          .carousel-title {
            font-size: 1.1rem;
          }

          .carousel-container {
            margin: 0;
          }

          .carousel-image-wrapper {
            height: 200px;
          }

          .carousel-control-prev,
          .carousel-control-next {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HomeCarousel;
