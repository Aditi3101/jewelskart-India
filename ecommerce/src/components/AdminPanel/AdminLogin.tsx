import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaEye, FaEyeSlash } from 'react-icons/fa';
import './AdminLogin.css';

interface AdminLoginProps {
  onLogin: (adminData: any) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/admin/login', {
        email,
        password
      });

      if (response.data.success) {
        const { token, admin } = response.data;
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminData', JSON.stringify(admin));
        onLogin(admin);
      }
    } catch (error: any) {
      // Dev fallback: allow default creds if backend is not reachable
      if (!error?.response && email === 'admin@example.com' && password === 'admin123') {
        const admin = { id: 1, name: 'Admin', email: 'admin@example.com', role: 'superadmin' };
        localStorage.setItem('adminToken', 'dev-token');
        localStorage.setItem('adminData', JSON.stringify(admin));
        onLogin(admin);
        return;
      }
      setError(error?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <FaUserShield />
          </div>
          <h1>Admin Panel</h1>
          <p>Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="admin-error-message">
              {error}
            </div>
          )}

          <div className="admin-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <div className="admin-password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="admin-input"
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`admin-login-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* <div className="admin-login-footer">
          <p>Default credentials:</p>
          <p><strong>Email:</strong> admin@example.com</p>
          <p><strong>Password:</strong> admin123</p>
        </div> */}
      </div>
    </div>
  );
};

export default AdminLogin;

