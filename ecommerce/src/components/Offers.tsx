import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TopNavBar from "./TopNavBar";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";
import Footer from "./Footer";
import ReviewSection from "./ReviewSection";

interface Product {
  p_id: number;
  p_name: string;
  p_price: number;
  p_code: string;
  fileToUpload: string;
  catagory_name: string;
  collection_name?: string;
  small_description?: string;
}

const Offers: React.FC = () => {
  const [offerProducts, setOfferProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOfferProducts();
  }, []);

  const fetchOfferProducts = async () => {
    try {
      const response = await axios.get("https://jewelskart-backend.onrender.com/api/offers", {
        headers: { "x-api-key": "your_super_secret_api_key_123" }
      });
      
      const productsWithOffers = response.data;
      
      setOfferProducts(productsWithOffers);
    } catch (error) {
      console.error("Error fetching offer products:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <TopNavBar />
      <ResponsiveNavBarWrapper />
      
      <div className="container my-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary">Special Offers</h1>
          <p className="lead text-muted">Discover amazing deals and discounts on our premium products</p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : offerProducts.length === 0 ? (
          <div className="text-center py-5">
            <h3 className="text-muted">No offers available at the moment</h3>
            <p>Check back soon for exciting deals!</p>
          </div>
        ) : (
          <div className="row g-4">
            {offerProducts.map((product) => (
              <div key={product.p_id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="card h-100 shadow-sm border-0 position-relative">
                  <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 rounded-end">
                    Special Offer
                  </div>
                  
                  <div className="card-img-top-wrapper" style={{ height: "250px", overflow: "hidden" }}>
                    <img
                      src={`https://jewelskart-backend.onrender.com/uploads/${product.fileToUpload}`}
                      className="card-img-top w-100 h-100"
                      alt={product.p_name}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-truncate">{product.p_name}</h5>
                    <p className="text-muted small mb-2">{product.catagory_name}</p>
                    {product.small_description && (
                      <p className="text-muted small mb-2">{product.small_description}</p>
                    )}
                    
                    <div className="mt-auto">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="h5 text-primary mb-0">₹{product.p_price}</span>
                      </div>
                      
                      <Link
                        to={`/product/${product.p_id}`}
                        className="btn btn-primary w-100"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Special Offers Banner */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="bg-gradient p-5 rounded-3 text-center text-white" 
                 style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
              <h2 className="mb-3">Don't Miss Out!</h2>
              <p className="lead mb-4">Subscribe to our newsletter and get exclusive offers delivered to your inbox</p>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                    <button className="btn btn-light" type="button">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewSection />
      <Footer />
    </>
  );
};

export default Offers;