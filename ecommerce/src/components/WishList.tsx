
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TopNavBar from "./TopNavBar";

import Footer from "./Footer";
import "./CartWishListResponsive.css";
import ResponsiveNavBarWrapper from "./esponsiveNavBarWrapper";
import { useCartWishlist } from "../contexts/CartWishlistContext";

interface WishlistItem {
  wishlist_id: number;
  customer_id: number;
  p_name: string;
  p_price: number;
  p_code: string;
  fileToUpload: string;
  quantity: number;
  p_id: number; // Add product ID for cart functionality
}

const WishList: React.FC = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const API_KEY = "your_super_secret_api_key_123";
  const { refreshCounts } = useCartWishlist();

  const fetchWishlist = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    try {
      // First get customer_id from email
      const userRes = await axios.get(`https://jewelskart-backend.onrender.com/user/${email}`, {
        headers: { "x-api-key": API_KEY },
      });

      if (userRes.data.success) {
        const customerId = userRes.data.user.customer_id;

        // Then get wishlist using customer_id
        const wishlistRes = await axios.get(
          `https://jewelskart-backend.onrender.com/wishlist?customer_id=${customerId}`
        );
        setWishlist(wishlistRes.data);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const removeItem = (id: number) => {
    axios
      .delete(`https://jewelskart-backend.onrender.com/wishlist/${id}`)
      .then(() => {
        fetchWishlist();
        refreshCounts(); // ✅ update wishlist count after remove
      })
      .catch((err) => console.error("Error deleting item:", err));
  };

  const addToCart = async (item: WishlistItem) => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      toast.error("Please log in to add items to cart");
      return;
    }

    try {
      // Get customer_id from email
      const userRes = await axios.get(`https://jewelskart-backend.onrender.com/user/${email}`, {
        headers: { "x-api-key": API_KEY },
      });

      if (userRes.data.success) {
        const customerId = userRes.data.user.customer_id;

        // Add item to cart
        await axios.post("https://jewelskart-backend.onrender.com/cart", {
          customer_id: customerId,
          p_id: item.p_id,
          p_name: item.p_name,
          p_price: item.p_price,
          p_code: item.p_code,
          fileToUpload: item.fileToUpload,
          size: "M", // Default size, can be changed if needed
          quantity: 1,
        });
        refreshCounts();

        toast.success("Product added to cart successfully!");
      }
    } catch (err) {
      console.error("Error adding item to cart:", err);
      toast.error("Failed to add product to cart");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div>
      <TopNavBar />
      <ResponsiveNavBarWrapper />

      <div className="container py-4">
        <div className="row w-100">
          <div className="col-lg-12 col-md-12 col-12 mb-4">
            <h3 className="mb-4">My Wishlist</h3>
            <table className="table table-bordered table-hover table-responsive">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Add to Cart</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {wishlist.map((item) => (
                  <tr key={item.wishlist_id}>
                    <td>
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
                    <td>₹{item.p_price}</td>
                    <td>In Stock</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </td>
                    <td>
                      <span
                        style={{
                          cursor: "pointer",
                          color: "#dc3545",
                          fontSize: "1.2rem",
                        }}
                        title="Remove"
                        onClick={() => removeItem(item.wishlist_id)}
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
                {wishlist.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No items in wishlist
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WishList;
