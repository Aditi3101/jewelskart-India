import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes, FaHeart, FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { useCartWishlist } from "../contexts/CartWishlistContext";

interface Type {
  type_id: number;
  type_name: string;
  path: string;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_KEY = "your_super_secret_api_key_123";

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  console.log("MobileSidebar render - isOpen:", isOpen);
  const [types, setTypes] = useState<Type[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const { cartCount, wishlistCount } = useCartWishlist();

  useEffect(() => {
    // Fetch types data (same as TypeNavBar)
    fetch("http://localhost:5000/api/types")
      .then((res) => res.json())
      .then((data) => {
        console.log("Types data:", data);
        setTypes(data);
      })
      .catch((err) => console.error("❌ Failed to fetch types:", err));

    // Get user info if logged in
    if (isLoggedIn) {
      const email = localStorage.getItem("userEmail");
      if (email) {
        axios
          .get(`http://localhost:5000/user/${email}`, {
            headers: { "x-api-key": API_KEY },
          })
          .then((res) => {
            if (res.data?.success) {
              setFirstName(res.data.user.fname || "");
              setLastName(res.data.user.lname || "");
            }
          })
          .catch((err) => console.error("Failed to fetch user:", err));
      }
    }
  }, [isLoggedIn]);



  const handleLogout = () => {
    localStorage.clear();
    onClose();
    navigate("/");
  };

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/login",
        { email: loginEmail, pass: loginPassword },
        { headers: { "x-api-key": API_KEY } }
      );

      if (res.data.success) {
        const prevUserEmail = localStorage.getItem("userEmail");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", loginEmail);
        localStorage.setItem("token", res.data.token || "");

        if (prevUserEmail !== loginEmail) {
          // Optionally fetch user count or other info here
        }

        alert("Login Successful");
        setShowLogin(false);
        onClose();
        window.location.reload();
      } else {
        setError(res.data.message || "Login failed.");
      }
    } catch {
      setError("Login failed.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="mobile-sidebar-backdrop"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`mobile-sidebar ${isOpen ? 'open' : ''}`}
        style={{ border: '2px solid red', backgroundColor: 'white', position: 'fixed', top: 0, left: isOpen ? '0' : '-100%', width: '85%', maxWidth: '350px', height: '100vh', zIndex: 1050, overflowY: 'auto' }}
      >
        <div className="mobile-sidebar-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="mobile-sidebar-content">
          {/* User Section */}
          {isLoggedIn ? (
            <div className="user-section">
              <div className="user-info">
                <div className="user-avatar">
                  {firstName && lastName ? `${firstName[0]}${lastName[0]}` : "U"}
                </div>
                <div className="user-details">
                  <div className="user-name">{firstName} {lastName}</div>
                  <div className="user-email">{localStorage.getItem("userEmail")}</div>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <div className="login-section">
              <button className="btn btn-primary w-100 mb-3" onClick={() => setShowLogin(true)}>
                <FaUser /> Login / Register
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="quick-actions">
            <Link to="/cart" className="quick-action-btn" onClick={handleLinkClick}>
              <FaShoppingCart />
              <span>Cart</span>
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </Link>
            <Link to="/wishlist" className="quick-action-btn" onClick={handleLinkClick}>
              <FaHeart />
              <span>Wishlist</span>
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </Link>
            {isLoggedIn && (
              <>
                <Link to="/account" className="quick-action-btn" onClick={handleLinkClick}>
                  <FaUser />
                  <span>Account</span>
                </Link>
                <Link to="/orders" className="quick-action-btn" onClick={handleLinkClick}>
                  <FaUser />
                  <span>Orders</span>
                </Link>
              </>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="mobile-nav">
            {types.length === 0 ? (
              <div className="nav-item">Loading...</div>
            ) : (
              types.map((type) => (
                <Link 
                  key={type.type_id} 
                  to={`/type/${type.type_id}`} 
                  className="nav-item flat"
                  onClick={handleLinkClick}
                >
                  {type.type_name}
                </Link>
              ))
            )}
          </nav>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <h5 className="mb-3 text-center">Login to Your Account</h5>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Username or Email"
                className="form-control mb-2"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="form-control mb-2"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              {error && <div className="text-danger mb-2">{error}</div>}
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
            <div className="text-center mt-2">
              Don't have an account?{" "}
              <span
                className="text-primary"
                role="button"
                onClick={() => {
                  setShowLogin(false);
                  // Optionally open register modal here
                }}
              >
                Register
              </span>
            </div>
            <button
              className="btn btn-cancel mt-3 w-100"
              onClick={() => setShowLogin(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default MobileSidebar;

