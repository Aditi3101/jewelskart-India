
import React, { useEffect, useState } from "react";
import axios from "axios";

import TopNavBar from "./TopNavBar";
import Footer from "./Footer";
import "./OrderSummary.css";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";

interface User {
  fname: string;
  lname: string;
  street_address: string;
  phone: string;
  Email: string;
  customer_id: number;
}

interface CartItem {
  cart_id: number;
  p_id: number; // ✅ ADD THIS
  p_name: string;
  p_price: number;
  quantity: number;
  fileToUpload: string;
}

const OrderSummary: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);

  const API_KEY = "your_super_secret_api_key_123"; // match with .env

  const gst = subtotal * 0.18;
  const totalPayable = subtotal + gst;

  const fetchUserAndCart = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    try {
      const res = await axios.get(`http://localhost:5000/user/${email}`, {
        headers: { "x-api-key": API_KEY },
      });

      if (res.data.success) {
        const fetchedUser = res.data.user;
        setUser(fetchedUser);

        const cartRes = await axios.get(
          `http://localhost:5000/cart?customer_id=${fetchedUser.customer_id}`
        );

        setCart(cartRes.data);
        calculateSubtotal(cartRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch user or cart:", error);
    }
  };

  const calculateSubtotal = (items: CartItem[]) => {
    const total = items.reduce(
      (acc, item) => acc + item.p_price * item.quantity,
      0
    );
    setSubtotal(total);
  };

  const handleQuantityChange = async (cartId: number, newQty: number) => {
    if (newQty < 1) return;

    try {
      await axios.put(`http://localhost:5000/cart/${cartId}`, {
        quantity: newQty,
      });
      if (user) fetchUserAndCart();
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const handleRemove = async (cartId: number) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${cartId}`);
      if (user) fetchUserAndCart();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || cart.length === 0) {
      alert("Missing user or cart data");
      return;
    }

    // Check if login/phone number and address are filled
    const isPhoneEmpty = !user.phone || user.phone.trim() === '';
    const isAddressEmpty = !user.street_address || user.street_address.trim() === '';
    
    if (isPhoneEmpty || isAddressEmpty) {
      alert("Please complete your profile with phone number and address before placing order.");
      // Redirect to UserAccount page
      window.location.href = '/account';
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/place-order",
        {
          user,
          cart,
          subtotal,
          gst,
          total: subtotal + gst,
        },
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );

      if (response.data.success) {
        // 🔹 Redirect to order placed page instead of alert
        window.location.href = "/order-placed";
        setInvoiceUrl(response.data.invoiceUrl || null);
        setCart([]);
        setSubtotal(0);
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Try again.");
    }
  };

  useEffect(() => {
    fetchUserAndCart();
  }, []);

  return (
    <div>
      <TopNavBar />
      <ResponsiveNavBarWrapper />

      <div className="order-summary-container">
        <div className="order-left">
          <div className="section-box">
            <div className="section-header">
              <h6>LOGIN ✓</h6>
            </div>
            <p className="section-data">{user?.phone || "Not available"}</p>
          </div>

          <div className="section-box">
            <div className="section-header">
              <h6>DELIVERY ADDRESS ✓</h6>
            </div>
            <p className="section-data">
              <strong>
                {user?.fname} {user?.lname}
              </strong>
              <br />
              {user?.street_address || "No address available"}
            </p>
          </div>

          <div className="section-box">
            <div
              className="section-header blue-bg"
              style={{ textAlign: "center" }}
            >
              <h6 className="white">ORDER SUMMARY</h6>
            </div>
            {cart.map((item) => (
              <div key={item.cart_id} className="product-info">
                <img
                  src={`http://localhost:5000/uploads/${item.fileToUpload}`}
                  alt={item.p_name}
                />
                <div className="product-details">
                  <p className="product-title">{item.p_name}</p>
                  <div className="price-row">
                    <span className="discounted-price">
                      ₹{item.p_price} × {item.quantity} = ₹
                      {item.p_price * item.quantity}
                    </span>
                  </div>
                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(item.cart_id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="qty-text">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        handleQuantityChange(item.cart_id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <div className="remove-btn-right">
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.cart_id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-box email-confirm">
            Order confirmation email will be sent to:
            <input
              type="email"
              value={user?.Email || ""}
              readOnly
              style={{ marginLeft: "10px", width: "60%" }}
            />
          </div>
        </div>

        <div className="order-right">
          <div className="price-details">
            <h5>PRICE DETAILS</h5>
            <div className="price-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <hr />
            <div className="price-row total">
              <span>Total Payable</span>
              <span>₹{totalPayable.toFixed(2)}</span>
            </div>
          </div>

          <button className="continue-btn" onClick={handlePlaceOrder}>
            PLACE ORDER
          </button>

          {invoiceUrl && (
            <div style={{ marginTop: "10px" }}>
              📄{" "}
              <a
                href={invoiceUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Invoice
              </a>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSummary;
