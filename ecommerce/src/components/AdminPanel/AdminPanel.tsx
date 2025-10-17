import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import { FaSignOutAlt, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import ProductManagement from './ProductManagement';
import TypeManagement from './TypeManagement';
import CategoryManagement from './CategoryManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import BannerManagement from './BannerManagement';
import ExportData from './ExportData';
import './AdminPanel.css';

interface AdminData {
  id: number;
  name: string;
  email: string;
  role: string;
}

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminData');

    if (token && admin) {
      try {
        setAdminData(JSON.parse(admin));
        setIsAuthenticated(true);
        if (location.pathname === '/admin' || location.pathname === '/admin/') {
          navigate('/admin/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
    setLoading(false);
  };

  const handleLogin = (admin: AdminData) => {
    setAdminData(admin);
    setIsAuthenticated(true);
    navigate('/admin/dashboard');
  };

  const handleLogout = () => {
    setAdminData(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin');
  };

  const handleNavigation = (path: string) => {
    navigate(`/admin/${path}`);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === `/admin/${path}` || 
           (path === 'dashboard' && location.pathname === '/admin');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {isAuthenticated && (
        <aside className="admin-sidebar">
          <div className="admin-sidebar-header">
            <h2>Admin Panel</h2>
            <span>Welcome, {adminData?.name}</span>
          </div>
          <nav className="admin-nav">
            <button 
              className={`admin-nav-item ${isActiveRoute('dashboard') ? 'active' : ''}`}
              onClick={() => handleNavigation('dashboard')}
            >
              <span>📊</span><span>Dashboard</span>
            </button>
            <div className="admin-nav-dropdown">
              <button 
                className={`admin-nav-item ${isActiveRoute('products') || isActiveRoute('types') || isActiveRoute('categories') ? 'active' : ''}`}
                onClick={() => setProductDropdownOpen(!productDropdownOpen)}
              >
                <span>📦</span><span>Products</span>
                {productDropdownOpen ? <FaChevronDown /> : <FaChevronRight />}
              </button>
              {productDropdownOpen && (
                <div className="admin-nav-submenu">
                  <button 
                    className={`admin-nav-subitem ${isActiveRoute('products') ? 'active' : ''}`}
                    onClick={() => handleNavigation('products')}
                  >
                    All Products
                  </button>
                  <button 
                    className={`admin-nav-subitem ${isActiveRoute('types') ? 'active' : ''}`}
                    onClick={() => handleNavigation('types')}
                  >
                    Types
                  </button>
                  <button 
                    className={`admin-nav-subitem ${isActiveRoute('categories') ? 'active' : ''}`}
                    onClick={() => handleNavigation('categories')}
                  >
                    Categories
                  </button>
                </div>
              )}
            </div>
            <button 
              className={`admin-nav-item ${isActiveRoute('orders') ? 'active' : ''}`}
              onClick={() => handleNavigation('orders')}
            >
              <span>🛒</span><span>Orders</span>
            </button>
            <button 
              className={`admin-nav-item ${isActiveRoute('users') ? 'active' : ''}`}
              onClick={() => handleNavigation('users')}
            >
              <span>👥</span><span>Users</span>
            </button>
            <button 
              className={`admin-nav-item ${isActiveRoute('banners') ? 'active' : ''}`}
              onClick={() => handleNavigation('banners')}
            >
              <span>🖼️</span><span>Banners</span>
            </button>
            <button 
              className={`admin-nav-item ${isActiveRoute('export') ? 'active' : ''}`}
              onClick={() => handleNavigation('export')}
            >
              <span>📊</span><span>Export Data</span>
            </button>
          </nav>
          <button onClick={handleLogout} className="admin-logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </aside>
      )}
      <main className="admin-content">
        {!isAuthenticated ? (
          <AdminLogin onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route path="/" element={<AdminDashboard onNavigate={handleNavigation} />} />
            <Route path="/dashboard" element={<AdminDashboard onNavigate={handleNavigation} />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/types" element={<TypeManagement />} />
            <Route path="/categories" element={<CategoryManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/banners" element={<BannerManagement />} />
            <Route path="/export" element={<ExportData />} />
          </Routes>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;

