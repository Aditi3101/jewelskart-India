import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSearch, 
  // FaEye, 
  // FaEdit, 
  // FaFilter,
  // FaSort
} from 'react-icons/fa';
import './OrderManagement.css';

interface Order {
  order_id: number;
  customer_id: number;
  subtotal: number;
  gst: number;
  total: number;
  invoice_file: string;
  created_at: string;
  status: string;
  cancellation_reason?: string;
  return_reason?: string;
  delivered_at?: string;
  tracking_number?: string;
  notes?: string;
}

interface OrderItem {
  item_id: number;
  order_id: number;
  p_id: number;
  quantity: number;
  price_at_time: number;
  total_price: number;
}

const API_BASE_URL = 'https://jewelskart-backend.onrender.com';

interface OrderManagementProps {
  onNavigate?: (view: string) => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    tracking_number: '',
    notes: ''
  });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/orders?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
        setTotalOrders(data.pagination.totalOrders);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`https://jewelskart-backend.onrender.com/admin/orders/${selectedOrder.order_id}/status`, updateForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowUpdateModal(false);
      setSelectedOrder(null);
      setUpdateForm({ status: '', tracking_number: '', notes: '' });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const openUpdateModal = (order: Order) => {
    setSelectedOrder(order);
    setUpdateForm({ 
      status: order.status, 
      tracking_number: order.tracking_number || '',
      notes: order.notes || ''
    });
    setShowUpdateModal(true);
  };

  const viewOrderDetails = async (orderId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data.order);
        setOrderItems(data.order.items || []);
        setShowDetailsModal(true);
      } else {
        console.error('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      case 'refunded': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'refunded': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-order-management">
      <div className="admin-header">
        <h1>Order Management</h1>
        <p>Manage and track customer orders</p>
      </div>

      {/* Search and Filters */}
      <div className="admin-filters-section">
        <div className="admin-search">
          <FaSearch className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search orders by customer name or order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <div className="admin-filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>#{order.order_id}</td>
                <td>{order.customer_id}</td>
                <td>₹{order.total}</td>
                <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => openUpdateModal(order)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button 
            className="admin-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <span className="admin-pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            className="admin-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Status Update Modal */}
      {showUpdateModal && selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Update Order Status</h3>
              <button 
                className="admin-modal-close"
                onClick={() => setShowUpdateModal(false)}
              >
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label htmlFor="order-status">Order Status</label>
                <select
                  id="order-status"
                  value={updateForm.status}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, status: e.target.value }))}
                  className="admin-input"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="tracking-number">Tracking Number</label>
                <input
                  type="text"
                  id="tracking-number"
                  value={updateForm.tracking_number}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, tracking_number: e.target.value }))}
                  placeholder="Enter tracking number"
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-modal-footer">
              <button 
                className="admin-btn-secondary"
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="admin-btn-primary"
                onClick={handleStatusUpdate}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
