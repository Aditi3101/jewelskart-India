import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Banner {
  id: number;
  title: string;
  image_url: string;
  placement: string;
  link: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  type: string;
}

const HeroSection: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const isVideo = (filename: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const isImage = (filename: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  };

  const fetchBanners = async () => {
    try {
      const response = await axios.get('https://jewelskart-india.onrender.com/api/banners');
      if (response.data.success) {
        const activeBanners = response.data.banners.filter((banner: Banner) => 
          banner.is_active && banner.placement === 'Main Home Page Banner'
        );
        setBanners(activeBanners);
        if (activeBanners.length > 0) {
          setCurrentBanner(activeBanners[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  return (
    <>
    <section 
      className="hero-section"
      style={{
        backgroundImage: currentBanner && isImage(currentBanner.image_url) ? `url(http://localhost:5000/uploads/banner/${currentBanner.image_url})` : !currentBanner ? 'linear-gradient(135deg, var(--primary-teal) 0%, var(--primary-accent) 100%)' : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'var(--neutral-white)',
        padding: '80px 40px',
        position: 'relative',
        overflow: 'hidden',
        height: '600px'
      }}
    >
      {/* Video Background */}
      {currentBanner && isVideo(currentBanner.image_url) && (
        <video
          autoPlay
          muted
          loop
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        >
          <source src={`http://localhost:5000/uploads/banner/${currentBanner.image_url}`} type="video/mp4" />
        </video>
      )}
      
      {/* Transparent Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(19, 45, 119, 0.25)',
          zIndex: 1
        }}
      />
      {/* Decorative Elements */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(132, 204, 22, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(132, 204, 22, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />

      <div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 40px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Main Heading */}
        <h1 
          style={{
            fontSize: '4rem',
            fontWeight: '700',
            marginBottom: '24px',
            letterSpacing: '2px',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            color: 'var(--neutral-white)'
          }}
        >
          {currentBanner?.title || 'Shop Everything'}
        </h1>

        {/* Decorative Line */}
        <div
          style={{
            width: '120px',
            height: '3px',
            background: '#F8C471',
            margin: '0 auto 32px',
            borderRadius: '2px'
          }}
        />

        {/* Subtitle */}
        <p 
          style={{
            fontSize: '1.4rem',
            fontWeight: '300',
            marginBottom: '140px',
            maxWidth: '600px',
            margin: '0 auto 48px',
            lineHeight: '1.6',
            color: '#eed78cff',
            fontFamily: '"Monotype Corsiva", cursive'
          }}
        >
          Discover Our Collections
        </p>

        {/* CTA Buttons */}
        <div className="cta-buttons" style={{ display: 'flex', gap: '34px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '10rem' }}>
          <Link
            to="/by-collection"
            style={{
              background: 'var(--gradient-primary)',
              color: 'var(--text-light)',
              padding: '16px 32px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'all 0.4s ease',
              boxShadow: '0 8px 32px rgba(234, 88, 12, 0.3)',
              border: '2px solid var(--primary-orange)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(234, 88, 12, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(234, 88, 12, 0.3)';
            }}
          >
            Shop Collection
          </Link>
          
          <Link
            to="/about"
            style={{
              background: 'transparent',
              color: 'var(--neutral-white)',
              padding: '16px 32px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem',
              transition: 'all 0.4s ease',
              border: '2px solid var(--neutral-white)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--neutral-white)';
              e.currentTarget.style.color = 'var(--primary-navy)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--neutral-white)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Our Story
          </Link>
        </div>

      </div>

      {/* Floating Animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @media (max-width: 768px) {
          .hero-section {
            padding: 40px 20px !important;
            height: 500px !important;
          }
          .hero-section h1 {
            font-size: 2.5rem !important;
            margin-bottom: 16px !important;
          }
          .hero-section p {
            font-size: 1.1rem !important;
            margin-bottom: 32px !important;
          }
          .hero-section .cta-buttons {
            margin-top: 2rem !important;
            gap: 20px !important;
          }
          .hero-section .cta-buttons a {
            padding: 12px 24px !important;
            font-size: 0.9rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .hero-section {
            padding: 30px 15px !important;
            height: 450px !important;
          }
          .hero-section h1 {
            font-size: 2rem !important;
            letter-spacing: 1px !important;
          }
          .hero-section p {
            font-size: 1rem !important;
          }
          .hero-section .cta-buttons {
            flex-direction: column !important;
            align-items: center !important;
            gap: 15px !important;
          }
          .hero-section .cta-buttons a {
            width: 200px !important;
            text-align: center !important;
          }
          .trust-indicators {
            padding: 40px 0 !important;
          }
          .trust-indicators > div {
            padding: 0 20px !important;
          }
          .trust-indicators > div > div {
            gap: 30px !important;
          }
          .trust-indicators div[style*="font-size: 3rem"] {
            font-size: 2.5rem !important;
          }
          .trust-indicators div[style*="font-size: 1.1rem"] {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </section>

    {/* Trust Indicators - Outside hero section */}
    <section className="trust-indicators" style={{ padding: '60px 0', backgroundColor: '#f9f2f6' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '60px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: '#590330',
              fontFamily: 'serif'
            }}>
              10K+
            </div>
            <div style={{ 
              fontSize: '1.1rem', 
              color: '#590330',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Happy Customers
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: '#590330',
              fontFamily: 'serif'
            }}>
              5+
            </div>
            <div style={{ 
              fontSize: '1.1rem', 
              color: '#590330',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Years Excellence
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: '#590330',
              fontFamily: 'serif'
            }}>
              100%
            </div>
            <div style={{ 
              fontSize: '1.1rem', 
              color: '#590330',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Authentic
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default HeroSection;