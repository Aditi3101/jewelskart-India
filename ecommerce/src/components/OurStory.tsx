import React from 'react';
import TopNavBar from './TopNavBar';
import ResponsiveNavBarWrapper from './esponsiveNavBarWrapper';
import Footer from './Footer';

const OurStory: React.FC = () => {
  return (
    <div>
      <TopNavBar />
      <ResponsiveNavBarWrapper />
      
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-teal) 0%, var(--primary-accent) 100%)',
        color: 'var(--neutral-white)',
        padding: '120px 0 80px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            marginBottom: '24px',
            color: 'var(--neutral-white)'
          }}>
            Our Story
          </h1>
          <div style={{
            width: '100px',
            height: '3px',
            background: 'var(--primary-sage)',
            margin: '0 auto 32px',
            borderRadius: '2px'
          }} />
          <p style={{
            fontSize: '1.3rem',
            lineHeight: '1.6',
            color: 'var(--neutral-silver)'
          }}>
            Building connections through quality products and exceptional experiences
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '80px 0', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          
          {/* Story Content */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', marginBottom: '80px' }}>
            <div>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: 'var(--primary-teal)',
                marginBottom: '24px'
              }}>
                Where It All Began
              </h2>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.7',
                color: 'var(--text-secondary)',
                marginBottom: '20px'
              }}>
                Founded with a simple vision: to create a shopping experience that brings joy, quality, and value to every customer. What started as a small dream has grown into a trusted destination for thousands of happy shoppers.
              </p>
              <p style={{
                fontSize: '1.1rem',
                lineHeight: '1.7',
                color: 'var(--text-secondary)'
              }}>
                We believe that shopping should be more than just a transaction – it should be an experience that connects people with products they love and trust.
              </p>
            </div>
            <div style={{
              background: 'var(--primary-sage)',
              height: '400px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--neutral-white)',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Our Journey Image
            </div>
          </div>

          {/* Values Section */}
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'var(--primary-teal)',
              marginBottom: '48px'
            }}>
              Our Values
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
              
              <div style={{
                background: 'var(--neutral-white)',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px var(--shadow-light)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--primary-sage)',
                  borderRadius: '50%',
                  margin: '0 auto 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'var(--neutral-white)'
                }}>
                  ✓
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--primary-teal)',
                  marginBottom: '16px'
                }}>
                  Quality First
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6'
                }}>
                  Every product is carefully selected and tested to ensure it meets our high standards of quality and durability.
                </p>
              </div>

              <div style={{
                background: 'var(--neutral-white)',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px var(--shadow-light)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--primary-sage)',
                  borderRadius: '50%',
                  margin: '0 auto 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'var(--neutral-white)'
                }}>
                  ♥
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--primary-teal)',
                  marginBottom: '16px'
                }}>
                  Customer Care
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6'
                }}>
                  Your satisfaction is our priority. We're here to support you every step of your shopping journey.
                </p>
              </div>

              <div style={{
                background: 'var(--neutral-white)',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px var(--shadow-light)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'var(--primary-sage)',
                  borderRadius: '50%',
                  margin: '0 auto 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'var(--neutral-white)'
                }}>
                  ⚡
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'var(--primary-teal)',
                  marginBottom: '16px'
                }}>
                  Innovation
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6'
                }}>
                  We continuously evolve our platform and services to provide you with the best shopping experience.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary-teal), var(--primary-accent))',
            padding: '60px 40px',
            borderRadius: '20px',
            color: 'var(--neutral-white)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              marginBottom: '48px'
            }}>
              Our Impact
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>10K+</div>
                <div style={{ fontSize: '1.1rem', opacity: '0.9' }}>Happy Customers</div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>5+</div>
                <div style={{ fontSize: '1.1rem', opacity: '0.9' }}>Years of Excellence</div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>1000+</div>
                <div style={{ fontSize: '1.1rem', opacity: '0.9' }}>Products Available</div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>100%</div>
                <div style={{ fontSize: '1.1rem', opacity: '0.9' }}>Authentic Products</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          h1 { font-size: 2.5rem !important; }
          h2 { font-size: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default OurStory;