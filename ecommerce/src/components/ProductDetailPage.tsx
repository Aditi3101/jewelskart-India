import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TopNavBar from "./TopNavBar";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";
import Footer from "./Footer";
import "./ProductDetailPageResponsive.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCartWishlist } from "../contexts/CartWishlistContext";
import DOMPurify from "dompurify";

interface Review {
  review_id: number;
  p_id: number;
  user_name: string;
  user_rating: number;
  user_review: string;
  datetime: string;
  created_date: string;
}

interface ProductDetailPageProps {
  productId?: number;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId: propProductId }) => {
  const { id: paramId } = useParams();
  const id = propProductId?.toString() || paramId;
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, review: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { refreshCounts } = useCartWishlist();

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/product/${id}`)
        .then((res) => {
          if (res.data) {
            setProduct(res.data);
            setActiveImage(res.data.fileToUpload);
            fetchReviews(id);
          } else {
            setError("Product not found");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Error loading product");
          setLoading(false);
        });
    } else {
      setError("Invalid product ID");
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = async (productId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = localStorage.getItem("userEmail");
    
    if (!email) {
      toast.warn("Please log in to submit a review");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reviews', {
        p_id: id,
        user_email: email,
        user_rating: newReview.rating,
        user_review: newReview.review
      });

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setNewReview({ rating: 5, review: '' });
        setShowReviewForm(false);
        fetchReviews(id!);
      }
    } catch (error) {
      toast.error("Failed to submit review");
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        onClick={() => interactive && onRate && onRate(i + 1)}
        style={{
          color: i < rating ? '#ffc107' : '#e4e5e9',
          cursor: interactive ? 'pointer' : 'default',
          fontSize: '20px'
        }}
      >
        ★
      </span>
    ));
  };

  const handleAddToCart = async () => {
    const email = localStorage.getItem("userEmail");
    const API_KEY = "your_super_secret_api_key_123";

    if (!email) return toast.warn("Please log in to add to cart");

    try {
      const { data } = await axios.get(`http://localhost:5000/user/${email}`, {
        headers: { "x-api-key": API_KEY },
      });

      if (data.success) {
        await axios.post("http://localhost:5000/cart", {
          customer_id: data.user.customer_id,
          p_name: product.p_name,
          p_price: product.p_price,
          p_code: product.p_code,
          fileToUpload: product.fileToUpload,
          // size: selectedSize,
          quantity: 1,
        });
        toast.success("Product added to cart!");
      }
    } catch {
      toast.error("Failed to add to cart");
    }
    refreshCounts();
  };

  const handleAddToWishlist = async () => {
    const email = localStorage.getItem("userEmail");
    const API_KEY = "your_super_secret_api_key_123";

    if (!email) return toast.warn("Please log in to add to wishlist");

    try {
      const { data } = await axios.get(`http://localhost:5000/user/${email}`, {
        headers: { "x-api-key": API_KEY },
      });

      if (data.success) {
        await axios.post("http://localhost:5000/wishlist", {
          customer_id: data.user.customer_id,
          p_name: product.p_name,
          p_price: product.p_price,
          p_code: product.p_code,
          fileToUpload: product.fileToUpload,
          quantity: 1,
        });
        toast.success("Product added to wishlist!");
      }
    } catch {
      toast.error("Failed to add to wishlist");
    }
    refreshCounts();
  };

  if (loading) return <p className="text-center mt-5">Loading product...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!product) return null;

  const allImages = [product.fileToUpload, product.image1, product.image2, product.image3]
    .filter(Boolean)
    .filter((img, index, arr) => arr.indexOf(img) === index);
  const thumbnails = allImages.slice(0, 4);

  return (
    <div>
      <TopNavBar />
      <ResponsiveNavBarWrapper />
      <ToastContainer position="top-right" autoClose={3000} />
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
        <nav style={{ fontSize: "14px", color: "#666", marginBottom: "30px", fontWeight: "500" }}>
          Home / Products / {product.catagory_name} / {product.p_name}
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }}>
          <div>
            <div
              style={{
                background: "#f8f9fa",
                borderRadius: "16px",
                padding: "30px",
                textAlign: "center",
                cursor: "zoom-in",
                height: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
              }}
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={`http://localhost:5000/uploads/${activeImage?.replace(/^.*[\\\\\\/]/, '')}`}
                alt="Main product"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "12px"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
              {thumbnails.map((img: string, i: number) => (
                <img
                  key={`thumb-${i}-${img}`}
                  src={`http://localhost:5000/uploads/${img.replace(/^.*[\\\\\\/]/, '')}`}
                  alt={`thumb-${i}`}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    border: activeImage === img ? "3px solid var(--primary-teal)" : "2px solid #e9ecef",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    opacity: activeImage === img ? 0.8 : 1
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ background: "var(--primary-sage)", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>
                {product.catagory_name}
              </span>
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#212529", marginBottom: "16px", lineHeight: "1.2" }}>
              {product.p_name}
            </h1>
            <p style={{ color: "#6c757d", marginBottom: "20px", fontSize: "14px" }}>
              Product Code: {product.p_code}
            </p>
            <div style={{ marginBottom: "30px" }}>
              <span style={{ fontSize: "2rem", fontWeight: "700", color: "var(--primary-teal)" }}>₹{product.p_price}</span>
              <span style={{ color: "#6c757d", marginLeft: "8px", fontSize: "14px" }}>Inclusive of all taxes</span>
            </div>

            {/* Sanitize and render description */}
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  product.p_description || "<p>No description available.</p>"
                ),
              }}
              style={{ marginBottom: "15px", color: "#555", lineHeight: "1.6" }}
            />

            <p><strong>Details:</strong></p>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.p_details || ""),
              }}
              style={{ marginBottom: "20px", color: "#444", lineHeight: "1.5" }}
            />

            {/* <div style={{ margin: "15px 0" }}> 
              <label htmlFor="sizeSelect">
                <strong>Size:</strong>
              </label>
              <select
                id="sizeSelect"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                style={{ marginLeft: "10px", padding: "8px" }}
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
              </select>
            </div> */}

            <div style={{ display: "flex", gap: "16px", marginTop: "40px" }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: "1",
                  background: "linear-gradient(135deg, var(--primary-teal) 0%, #0f766e 100%)",
                  color: "white",
                  padding: "16px 24px",
                  fontWeight: "600",
                  fontSize: "16px",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(15, 118, 110, 0.3)"
                }}
              >
                Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                style={{
                  background: "#fff",
                  border: "2px solid var(--primary-sage)",
                  color: "var(--primary-sage)",
                  padding: "16px 24px",
                  fontWeight: "600",
                  fontSize: "16px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "120px"
                }}
              >
                ♡ Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "60px auto 0", padding: "0 20px" }}>
        <div style={{ background: "#f8f9fa", borderRadius: "16px", padding: "40px" }}>
          <h3 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "30px", color: "#212529" }}>Customer Reviews</h3>
          
          {localStorage.getItem("userEmail") && (
            <div style={{ marginBottom: "30px" }}>
              {!showReviewForm ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  style={{
                    backgroundColor: "var(--primary-teal)",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Write a Review
                </button>
              ) : (
                <form onSubmit={handleSubmitReview} style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px" }}>
                  <h4>Write Your Review</h4>
                  <div style={{ marginBottom: "15px" }}>
                    <label>Rating:</label>
                    <div style={{ marginTop: "5px" }}>
                      {renderStars(newReview.rating, true, (rating) => setNewReview(prev => ({ ...prev, rating })))}
                    </div>
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <label>Review:</label>
                    <textarea
                      value={newReview.review}
                      onChange={(e) => setNewReview(prev => ({ ...prev, review: e.target.value }))}
                      required
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        marginTop: "5px"
                      }}
                      placeholder="Share your experience with this product..."
                    />
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button type="submit" style={{ backgroundColor: "var(--primary-sage)", color: "white", padding: "8px 16px", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                      Submit Review
                    </button>
                    <button type="button" onClick={() => setShowReviewForm(false)} style={{ backgroundColor: "#6c757d", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <div>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.review_id} style={{ border: "1px solid #eee", padding: "20px", marginBottom: "15px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <strong>{review.user_name}</strong>
                    <span style={{ color: "#666", fontSize: "14px" }}>
                      {new Date(review.created_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    {renderStars(review.user_rating)}
                  </div>
                  <p style={{ margin: 0, lineHeight: "1.5" }}>{review.user_review}</p>
                </div>
              ))
            ) : (
              <p style={{ color: "#666", fontStyle: "italic" }}>No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={`http://localhost:5000/uploads/${activeImage?.replace(/^.*[\\\\\\/]/, '')}`}
            alt="modal preview"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
