import React from "react";
import "./Footer.css";
// Import icons from react-icons
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
        <h4>Links</h4>
        <p>Our Story</p>
        <p>Materials & Care</p>
        <p>Gift Packaging</p>
        <p>Size Guide</p>
      </div>
      <div className="footer-section">
        <h4>Help & Support</h4>
        <p>Exchanging & Returns</p>
        <p>Shipping</p>
        <p>Payment Methods</p>
        <p>Contact Us</p>
      </div>
      <div className="footer-section">
        <h4>Shops</h4>
        <p>Bags</p>
        <p>Jewellery</p>
        <p>Wholesale</p>
      </div>
      <div className="footer-section">
        <h4>Contact</h4>
        <p>
          Office No.2, Suvidha Corner,<br />
          Sheela Vihar society,<br />
          Karve Road, Pune -38
        </p>
        <p>📞 +91 9011663785</p>
        <p>📧 nishant@viyaantechnosoft.com</p>
        <div className="footer-social-icons" style={{ display: "flex", gap: "12px", marginTop: "15px" }}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" 
             style={{ 
               fontSize: "1.5rem", 
               color: '#e8e9ea',
               transition: 'all 0.3s ease',
               padding: '8px',
               borderRadius: '50%',
               border: '1px solid #e8e9ea'
             }}
             onMouseEnter={(e) => {
               e.currentTarget.style.color = '#f8c471';
               e.currentTarget.style.borderColor = '#f8c471';
               e.currentTarget.style.transform = 'translateY(-2px)';
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.color = '#e8e9ea';
               e.currentTarget.style.borderColor = '#e8e9ea';
               e.currentTarget.style.transform = 'translateY(0)';
             }}>
            <FaFacebookF />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" 
             style={{ 
               fontSize: "1.5rem", 
               color: '#e8e9ea',
               transition: 'all 0.3s ease',
               padding: '8px',
               borderRadius: '50%',
               border: '1px solid #e8e9ea'
             }}
             onMouseEnter={(e) => {
               e.currentTarget.style.color = '#f8c471';
               e.currentTarget.style.borderColor = '#f8c471';
               e.currentTarget.style.transform = 'translateY(-2px)';
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.color = '#e8e9ea';
               e.currentTarget.style.borderColor = '#e8e9ea';
               e.currentTarget.style.transform = 'translateY(0)';
             }}>
            <FaInstagram />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" 
             style={{ 
               fontSize: "1.5rem", 
               color: '#e8e9ea',
               transition: 'all 0.3s ease',
               padding: '8px',
               borderRadius: '50%',
               border: '1px solid #e8e9ea'
             }}
             onMouseEnter={(e) => {
               e.currentTarget.style.color = '#f8c471';
               e.currentTarget.style.borderColor = '#f8c471';
               e.currentTarget.style.transform = 'translateY(-2px)';
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.color = '#e8e9ea';
               e.currentTarget.style.borderColor = '#e8e9ea';
               e.currentTarget.style.transform = 'translateY(0)';
             }}>
            <FaYoutube />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" 
             style={{ 
               fontSize: "1.5rem", 
               color: '#e8e9ea',
               transition: 'all 0.3s ease',
               padding: '8px',
               borderRadius: '50%',
               border: '1px solid #e8e9ea'
             }}
             onMouseEnter={(e) => {
               e.currentTarget.style.color = '#f8c471';
               e.currentTarget.style.borderColor = '#f8c471';
               e.currentTarget.style.transform = 'translateY(-2px)';
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.color = '#e8e9ea';
               e.currentTarget.style.borderColor = '#e8e9ea';
               e.currentTarget.style.transform = 'translateY(0)';
             }}>
            <FaTwitter />
          </a>
        </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div style={{
        borderTop: '1px solid #8b5a6b',
        marginTop: '20px',
        paddingTop: '15px',
        textAlign: 'center',
        color: '#ffffff',
        fontSize: '0.85rem'
      }}>
        <p style={{ margin: 0 }}>
          © 2024 ShopHub. All rights reserved. | Quality products since 2020
        </p>
      </div>
    </footer>
  );
};

export default Footer;