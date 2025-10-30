
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaBars,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaSignInAlt,
  FaListAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.tsx";
import MobileSidebar from "./MobileSidebar";
import ForgotPassword from "./ForgotPassword";
import "./TopNavBar.css";
import "./MobileSidebar.css";
import { useCartWishlist } from "../contexts/CartWishlistContext";

const API_KEY = "your_super_secret_api_key_123";

const TopNavBar: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerSurname, setRegisterSurname] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [totalLoggedInCount, setTotalLoggedInCount] = useState<number | null>(
    null
  );
  const [showLoginCountPopup, setShowLoginCountPopup] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Debug mobile sidebar state
  useEffect(() => {
    console.log("Mobile sidebar state changed:", mobileSidebarOpen);
  }, [mobileSidebarOpen]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // now includes resetCounts & fetchCounts
  const { cartCount, wishlistCount, resetCounts, fetchCounts } = useCartWishlist();

  // const handleAdminClick = () => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/account");
  //   } else {
  //     alert("Please login first!");
  //   }
  // };

  const handleLogout = () => {
    localStorage.clear();
    resetCounts(); // instantly clear counts
    alert("Logged out");
    navigate("/");
  };

  const fetchTotalLoggedInCount = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/logged-in-count`, {
        headers: { "x-api-key": API_KEY },
      });
      if (res.data.success) {
        setTotalLoggedInCount(res.data.count);
        setShowLoginCountPopup(true);
        setTimeout(() => setShowLoginCountPopup(false), 3000);
      }
    } catch {}
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/login`,
        { email: loginEmail, pass: loginPassword },
        { headers: { "x-api-key": API_KEY } }
      );

      if (res.data.success) {
        const prevUserEmail = localStorage.getItem("userEmail");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", loginEmail);
        localStorage.setItem("token", res.data.token || "");

        if (prevUserEmail !== loginEmail) {
          const countRes = await axios.get(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/user/${loginEmail}`,
            {
              headers: { "x-api-key": API_KEY },
            }
          );
          if (countRes.data.success) {
            await fetchTotalLoggedInCount();
          }
        }

        await fetchCounts(); // instantly update counts for new user

        alert("Login Successful");
        setShowLogin(false);
      } else {
        setError(res.data.message || "Login failed.");
      }
    } catch {
      setError("Login failed.");
    }
  };

  useEffect(() => {
    fetchTotalLoggedInCount();

    if (isLoggedIn) {
      const email = localStorage.getItem("userEmail");
      if (email) {
        axios
          .get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/user/${email}`, {
            headers: { "x-api-key": API_KEY },
          })
          .then((res) => {
            if (res.data.success) {
              setFirstName(res.data.user.fname || "");
              setLastName(res.data.user.lname || "");
            }
          })
          .catch(() => {});
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLoggedIn]);

  return (
    <>
      {/* Discount Line */}
      <div style={{ 
        background: '#590330', 
        color: 'white', 
        textAlign: 'center', 
        padding: '8px 0', 
        fontSize: '0.9rem',
        fontWeight: '500'
      }}>
        🎉 Special Offer: Get 20% OFF on all Jewellery! Use code: SAVE20
      </div>
      
      <header className="top-navbar sticky-top py-2 px-3" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-light)', boxShadow: '0 2px 20px var(--shadow-light)' }}>
      {/* Desktop Layout */}
      <div className="container d-none d-lg-flex align-items-center justify-content-between">
        {/* Left: Logo */}
        <div className="d-flex align-items-center gap-3">
          <Link
            to="/"
            className="text-decoration-none d-flex align-items-center gap-2"
          >
            <img
              src="/JewelsKart_Final_Logo.jpg"
              alt="Jewelskart India"
              width="120"
              height="40"
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-grow-1 mx-4">
          <SearchBar />
        </div>

        {/* Right: Icons - Desktop */}
        <div className="d-flex align-items-center gap-4">
          {!isLoggedIn ? (
            <div
              className="text-center text-secondary small"
              style={{ cursor: "pointer" }}
              onClick={() => setShowLogin(true)}
            >
              <FaSignInAlt className="fs-5" style={{ color: '#590330' }} />
              <div>Login</div>
            </div>
          ) : null}

          <Link
            to="/wishlist"
            className="text-center text-secondary small text-decoration-none position-relative"
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <FaHeart className="fs-5" style={{ color: '#590330' }} />
              {wishlistCount > 0 && (
                <span className="wishlist-badge">{wishlistCount}</span>
              )}
            </div>
            <div>Wishlist</div>
          </Link>

            <Link
              to="/cart"
              className="text-center text-secondary small  text-decoration-none position-relative"
            >
              <FaShoppingCart className="fs-5" style={{ color: '#590330' }} />
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
              <div>Cart</div>
            </Link>

          {isLoggedIn && (
            <div
              className="position-relative d-flex align-items-center gap-2"
              ref={dropdownRef}
            >
              <div
                className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center"
                style={{ width: "36px", height: "36px", cursor: "pointer" }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {getInitials(firstName, lastName) || "JD"}
              </div>
              <span
                className="fw-semibold"
                style={{ cursor: "pointer" }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {firstName} {lastName}
              </span>

              {dropdownOpen && (
                <div className="profile-dropdown-menu">
                  <Link to="/account" className="profile-dropdown-item">
                    <FaUser className="me-2" /> My Account
                  </Link>
                  <Link to="/orders" className="profile-dropdown-item">
                    <FaListAlt className="me-2" /> Order History
                  </Link>
                  <Link to="#" className="profile-dropdown-item">
                    <FaCog className="me-2" /> Settings
                  </Link>
                  <div className="profile-dropdown-divider"></div>
                  <button
                    onClick={handleLogout}
                    className="profile-dropdown-item text-danger w-100 text-start"
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="container d-block d-lg-none">
        {/* Top Row: Logo and Hamburger */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <Link
            to="/"
            className="text-decoration-none d-flex align-items-center gap-2"
          >
            <img
              src="/JewelsKart_Final_Logo.jpg"
              alt="Jewelskart India"
              width="100"
              height="32"
              style={{ objectFit: 'contain' }}
            />
          </Link>
          
          <div className="d-flex align-items-center gap-2">
            <Link
              to="/wishlist"
              className="text-center text-secondary small text-decoration-none position-relative"
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                <FaHeart className="fs-5" style={{ color: '#590330' }} />
                {wishlistCount > 0 && (
                  <span className="wishlist-badge">{wishlistCount}</span>
                )}
              </div>
            </Link>

            <Link
              to="/cart"
              className="text-center text-secondary small text-decoration-none position-relative"
            >
              <FaShoppingCart className="fs-5" style={{ color: '#590330' }} />
              {cartCount > 0 && (
                <span className="cart-badge">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="btn mobile-menu-btn"
              onClick={() => {
                console.log("Mobile menu clicked, setting sidebar open");
                setMobileSidebarOpen(true);
              }}
            >
              <FaBars />
            </button>
          </div>
        </div>

        {/* Bottom Row: Search */}
        <div className="w-100">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={mobileSidebarOpen} 
        onClose={() => {
          console.log("Closing mobile sidebar");
          setMobileSidebarOpen(false);
        }} 
      />

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
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => {
                  setShowLogin(false);
                  setShowForgotPassword(true);
                }}
                style={{ color: '#590330', fontSize: '0.9rem' }}
              >
                Forgot Password?
              </button>
            </div>
            <div className="text-center mt-2">
              Don't have an account?{" "}
              <span
                className="text-primary"
                role="button"
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
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

      {/* Register Modal */}
      {showRegister && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <h5 className="mb-3 text-center">Create Account</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                axios
                  .post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/register`,
                    {
                      fname: registerName,
                      lname: registerSurname,
                      email: registerEmail,
                      pass: registerPassword,
                    },
                    { headers: { "x-api-key": API_KEY } }
                  )
                  .then((res) => {
                    if (res.data.success) {
                      setShowRegister(false);
                      setShowLogin(true);
                      alert("Registered Successfully");
                    } else {
                      setError(res.data.message || "Registration failed.");
                    }
                  })
                  .catch(() => {
                    setError("Registration failed.");
                  });
              }}
            >
              <input
                type="text"
                placeholder="First Name"
                className="form-control mb-2"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="form-control mb-2"
                value={registerSurname}
                onChange={(e) => setRegisterSurname(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="form-control mb-2"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="form-control mb-2"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              {error && <div className="text-danger mb-2">{error}</div>}
              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
            </form>
            <div className="text-center mt-2">
              Already have an account?{" "}
              <span
                className="text-primary"
                role="button"
                onClick={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              >
                Login
              </span>
            </div>
            <button
              className="btn btn-cancel mt-3 w-100"
              onClick={() => setShowRegister(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      <ForgotPassword 
        show={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />

      {/* Login Count Popup */}
      {showLoginCountPopup && totalLoggedInCount !== null && (
        <div className="login-count-popup">
          Logged in users are {totalLoggedInCount}
        </div>
      )}
    </header>
    </>
  );
};

function getInitials(firstName: string, lastName: string): string {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
  return firstInitial + lastInitial;
}

export default TopNavBar;
