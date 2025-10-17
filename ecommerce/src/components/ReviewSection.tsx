import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

interface Review {
  review_id: number;
  p_id: number;
  user_name: string;
  user_rating: number;
  user_review: string;
  datetime: string;
  created_date: string;
}

const ReviewSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("https://jewelskart-india.onrender.com/api/all-reviews", {
        headers: { "x-api-key": "your_super_secret_api_key_123" }
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="d-flex align-items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar
            key={i}
            className={i < rating ? "text-warning" : "text-muted"}
            size={16}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <section className="py-5 bg-light">
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section style={{ padding: '60px 0', background: '#fafafa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '600', 
            color: '#590330', 
            marginBottom: '10px',
            fontFamily: '"Monotype Corsiva", cursive'
          }}>
            What Our Customers Say
          </h1>
          <p style={{ color: '#F8C471', fontSize: '1rem' }}>
            Read reviews from our satisfied customers
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {(showAll ? reviews : reviews.slice(0, 6)).map((review) => (
            <div key={review.review_id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{
                  width: '45px',
                  height: '45px',
                  background: 'linear-gradient(135deg, #590330 0%, #7a1b4a 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginRight: '12px'
                }}>
                  {review.user_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h6 style={{ margin: '0 0 2px 0', fontSize: '1rem', fontWeight: '500', color: '#333' }}>
                    {review.user_name}
                  </h6>
                  <small style={{ color: '#888', fontSize: '0.85rem' }}>
                    {formatDate(review.created_date)}
                  </small>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                {renderStars(review.user_rating)}
              </div>
              
              <p style={{ 
                color: '#555', 
                fontSize: '0.95rem',
                lineHeight: '1.5',
                margin: '0',
                fontStyle: 'italic'
              }}>
                "{review.user_review}"
              </p>
            </div>
          ))}
        </div>
        
        {reviews.length > 6 && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button 
              onClick={() => setShowAll(!showAll)}
              style={{
                background: showAll ? '#590330' : 'transparent',
                color: showAll ? 'white' : '#590330',
                border: '2px solid #590330',
                padding: '10px 25px',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!showAll) {
                  e.currentTarget.style.background = '#590330';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!showAll) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#590330';
                }
              }}
            >
              {showAll ? 'Show Less' : 'View All Reviews'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;