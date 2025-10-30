
import React, { useEffect, useState } from "react";
import axios from "axios";
import TopNavBar from "./TopNavBar";
import Footer from "./Footer";
import "./CartWishListResponsive.css";
import { useNavigate } from "react-router-dom";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";
import { useCartWishlist } from "../contexts/CartWishlistContext"; // ✅ add this

interface CartItem {
  cart_id: number;
  customer_id: number;
  p_name: string;
  p_price: number;
  p_code: string;
  fileToUpload: string;
  size: string;
  quantity: number;
}

const Cart: React.FC = () => {
  const { refreshCounts } = useCartWishlist(); // ✅
  const [cart, setCart] = useState<CartItem[]>([]);
  const API_KEY = "your_super_secret_api_key_123";
  const navigate = useNavigate();

  const fetchCart = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    try {
      const userRes = await axios.get(`https://jewelskart-backend.onrender.com/user/${email}`, {
        headers: { "x-api-key": API_KEY },
      });
      if (userRes.data.success) {
        const customer_id = userRes.data.user.customer_id;
        const cartRes = await axios.get(
          `https://jewelskart-backend.onrender.com/cart?customer_id=${customer_id}`
        );
        setCart(cartRes.data);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
    refreshCounts();
  };

  const removeItem = async (id: number) => {
    try {
      await axios.delete(`https://jewelskart-backend.onrender.com/cart/${id}`);
      fetchCart();
      refreshCounts();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handlePlaceOrder = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (isLoggedIn !== "true") {
      alert("Please log in to place your order.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Navigate to order summary page
    navigate("/ordersummary");
  };

  const updateQuantity = async (id: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      await axios.put(`https://jewelskart-backend.onrender.com/cart/${id}`, { quantity: newQty });
      fetchCart();
      refreshCounts();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
    
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.p_price * item.quantity,
    0
  );
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div>
      <TopNavBar />
      <ResponsiveNavBarWrapper />

      <div className="container py-4">
        <div className="row w-100">
          <div className="col-lg-8 col-md-12 col-12 mb-4">
            <table className="table table-condensed table-responsive">
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Qty</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.cart_id}>
                    <td data-label="Product">
                      <div className="d-flex align-items-center">
                        <img
                          src={`https://jewelskart-backend.onrender.com/uploads/${item.fileToUpload}`}
                          alt={item.p_name}
                          width="60"
                          className="me-3"
                        />
                        <div>
                          <p className="mb-0">{item.p_name}</p>
                          <small>Code: {item.p_code}</small>
                        </div>
                      </div>
                    </td>
                    <td data-label="Price">₹{item.p_price}</td>
                    <td data-label="Stock">In Stock</td>
                    <td data-label="Quantity">
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "black",
                          textDecoration: "none",
                        }}
                        onClick={() =>
                          updateQuantity(item.cart_id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "black",
                          textDecoration: "none",
                        }}
                        onClick={() =>
                          updateQuantity(item.cart_id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </td>
                    <td data-label="Remove">
                      <span
                        style={{
                          cursor: "pointer",
                          color: "#dc3545",
                          fontSize: "1.2rem",
                        }}
                        title="Remove"
                        onClick={() => removeItem(item.cart_id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-x-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z" />
                          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                      </span>
                    </td>
                  </tr>
                ))}
                {cart.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No items in cart
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="col-lg-4 col-md-12 col-12">
            <div className="card p-3">
              <div className="card-body">
                <h5 className="card-title">Summary</h5>
                <ul className="list-group mb-3">
                  <li className="list-group-item d-flex justify-content-between">
                    Subtotal <span>₹{subtotal.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    GST (18%) <span>₹{gst.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold">
                    Total <span>₹{total.toFixed(2)}</span>
                  </li>
                </ul>
                {/* <button className="btn btn-primary w-100">Place Order</button> */}
                <button
                  className="btn btn-primary w-100"
                  onClick={handlePlaceOrder}
                  disabled={cart.length === 0}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
