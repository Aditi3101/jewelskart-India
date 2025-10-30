import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaChartBar, 
  FaBox, 
  FaUsers, 
  FaShoppingCart, 
  FaImages, 
  FaSignOutAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaRupeeSign
} from 'react-icons/fa';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
}

interface RecentOrder {
  order_id: number;
  customer_id: number;
  total: number;
  status: string;
  created_at: string;
}

interface AdminDashboardProps {
  onNavigate?: (view: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('https://jewelskart-backend.onrender.com/admin/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.stats);
        setRecentOrders(response.data.recentOrders);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      case 'processing': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-content">
        <div className="admin-header">
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card orders">
            <div className="stat-icon orders">
              <FaShoppingCart size={20} />
            </div>
            <div className="stat-content">
              <h3>{stats?.totalOrders || 0}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          
          <div className="stat-card revenue">
            <div className="stat-icon revenue">
              <FaRupeeSign size={20} />
            </div>
            <div className="stat-content">
              <h3>₹{stats?.totalRevenue?.toLocaleString() || 0}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          
          <div className="stat-card users">
            <div className="stat-icon users">
              <FaUsers size={20} />
            </div>
            <div className="stat-content">
              <h3>{stats?.totalUsers || 0}</h3>
              <p>Total Users</p>
            </div>
          </div>
          
          <div className="stat-card products">
            <div className="stat-icon products">
              <FaBox size={20} />
            </div>
            <div className="stat-content">
              <h3>{stats?.totalProducts || 0}</h3>
              <p>Total Products</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="recent-orders">
            <h3>Recent Orders</h3>
            <div className="orders-list">
              {recentOrders.map((order) => (
                <div key={order.order_id} className="order-item">
                  <div className="order-info">
                    <span className="order-id">#{order.order_id}</span>
                    <span className="customer-id">Customer: {order.customer_id}</span>
                  </div>
                  <div className="order-details">
                    <span className="amount">₹{order.total}</span>
                    <span className={`status ${order.status}`}>{order.status}</span>
                  </div>
                  <div className="order-date">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      {/* Quick Actions */}
      <div className="admin-section">
        <h2>Quick Actions</h2>
        <div className="admin-quick-actions">
          <button 
            className="admin-quick-action-btn"
            onClick={() => handleNavigation('products')}
          >
            <FaPlus />
            Add New Product
          </button>
          
          <button 
            className="admin-quick-action-btn"
            onClick={() => handleNavigation('banners')}
          >
            <FaPlus />
            Add New Banner
          </button>
          
          <button 
            className="admin-quick-action-btn"
            onClick={() => handleNavigation('orders')}
          >
            <FaShoppingCart />
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
