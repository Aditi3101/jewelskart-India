import React from "react";
import { Link } from "react-router-dom";
import "./OrderPlaced.css";

const OrderPlaced: React.FC = () => {
  return (
    <div className="order-placed-container">
      <div className="order-animation">
        ✅
      </div>
      <h1>Order Placed Successfully!</h1>
      <p>Thank you for your purchase. Your order is being processed.</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link to="/orders" className="home-button">
          View Order History
        </Link>
        <Link to="/" className="home-button">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderPlaced;
