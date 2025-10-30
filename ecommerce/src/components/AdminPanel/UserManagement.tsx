// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   FaSearch, 
//   FaEye, 
//   FaEdit, 
//   FaUserCheck,
//   FaUserTimes
// } from 'react-icons/fa';
// import './UserManagement.css';

// interface User {
//   customer_id: number;
//   fname: string;
//   lname: string;
//   Email: string;
//   phone: string;
//   address: string;
//   status: string;
//   created_at: string;
//   last_login: string;
// }

// const UserManagement: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [statusUpdate, setStatusUpdate] = useState('');

//   useEffect(() => {
//     fetchUsers();
//   }, [currentPage, searchTerm]);

//   const fetchUsers = async () => {
//     try {
//       const token = localStorage.getItem('adminToken');
//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         ...(searchTerm && { search: searchTerm })
//       });

//       const response = await axios.get(`https://jewelskart-backend.onrender.com/admin/users?${params}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (response.data.success) {
//         setUsers(response.data.users);
//         setTotalPages(response.data.pagination.pages);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async () => {
//     if (!selectedUser) return;

//     try {
//       const token = localStorage.getItem('adminToken');
//       await axios.put(`https://jewelskart-backend.onrender.com/admin/users/${selectedUser.customer_id}/status`, {
//         status: statusUpdate
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setShowStatusModal(false);
//       setSelectedUser(null);
//       setStatusUpdate('');
//       fetchUsers();
//     } catch (error) {
//       console.error('Error updating user status:', error);
//     }
//   };

//   const openStatusModal = (user: User) => {
//     setSelectedUser(user);
//     setStatusUpdate(user.status);
//     setShowStatusModal(true);
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return 'Never';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'active': return '#10b981';
//       case 'inactive': return '#ef4444';
//       case 'suspended': return '#f59e0b';
//       default: return '#6b7280';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="admin-loading">
//         <div className="admin-spinner"></div>
//         <p>Loading users...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="admin-user-management">
//       <div className="admin-header">
//         <h1>User Management</h1>
//         <p>Manage customer accounts and permissions</p>
//       </div>

//       {/* Search */}
//       <div className="admin-search-section">
//         <div className="admin-search">
//           <FaSearch className="admin-search-icon" />
//           <input
//             type="text"
//             placeholder="Search users by name or email..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="admin-search-input"
//           />
//         </div>
//       </div>

//       {/* Users Table */}
//       <div className="admin-table-container">
//         <table className="admin-table">
//           <thead>
//             <tr>
//               <th>Customer ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Status</th>
//               <th>Joined</th>
//               <th>Last Login</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.customer_id}>
//                 <td>
//                   <strong>#{user.customer_id}</strong>
//                 </td>
//                 <td>
//                   <div className="admin-user-info">
//                     <strong>{user.fname} {user.lname}</strong>
//                     <small>{user.address}</small>
//                   </div>
//                 </td>
//                 <td>{user.Email}</td>
//                 <td>{user.phone || '-'}</td>
//                 <td>
//                   <span 
//                     className="admin-status-badge"
//                     style={{ backgroundColor: getStatusColor(user.status) }}
//                   >
//                     {user.status}
//                   </span>
//                 </td>
//                 <td>{formatDate(user.created_at)}</td>
//                 <td>{formatDate(user.last_login)}</td>
//                 <td>
//                   <div className="admin-actions">
//                     <button 
//                       className="admin-action-btn view"
//                       title="View Details"
//                     >
//                       <FaEye />
//                     </button>
//                     <button 
//                       className="admin-action-btn edit"
//                       onClick={() => openStatusModal(user)}
//                       title="Update Status"
//                     >
//                       <FaEdit />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="admin-pagination">
//           <button 
//             className="admin-pagination-btn"
//             onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
          
//           <span className="admin-pagination-info">
//             Page {currentPage} of {totalPages}
//           </span>
          
//           <button 
//             className="admin-pagination-btn"
//             onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Status Update Modal */}
//       {showStatusModal && selectedUser && (
//         <div className="admin-modal-overlay">
//           <div className="admin-modal">
//             <div className="admin-modal-header">
//               <h3>Update User Status</h3>
//               <button 
//                 className="admin-modal-close"
//                 onClick={() => setShowStatusModal(false)}
//               >
//                 ×
//               </button>
//             </div>

//             <div className="admin-modal-body">
//               <div className="admin-user-status-info">
//                 <p><strong>User:</strong> {selectedUser.fname} {selectedUser.lname}</p>
//                 <p><strong>Email:</strong> {selectedUser.Email}</p>
//                 <p><strong>Current Status:</strong> 
//                   <span 
//                     className="admin-status-badge"
//                     style={{ backgroundColor: getStatusColor(selectedUser.status) }}
//                   >
//                     {selectedUser.status}
//                   </span>
//                 </p>
//               </div>

//               <div className="admin-form-group">
//                 <label htmlFor="user-status">New Status</label>
//                 <select
//                   id="user-status"
//                   value={statusUpdate}
//                   onChange={(e) => setStatusUpdate(e.target.value)}
//                   className="admin-input"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                   <option value="suspended">Suspended</option>
//                 </select>
//               </div>

//               <div className="admin-status-warning">
//                 <p><strong>Note:</strong> Changing user status will affect their ability to:</p>
//                 <ul>
//                   <li>Place new orders</li>
//                   <li>Access their account</li>
//                   <li>Receive notifications</li>
//                 </ul>
//               </div>
//             </div>

//             <div className="admin-modal-footer">
//               <button 
//                 className="admin-btn-secondary"
//                 onClick={() => setShowStatusModal(false)}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="admin-btn-primary"
//                 onClick={handleStatusUpdate}
//               >
//                 Update Status
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSearch, 
  FaEdit
} from 'react-icons/fa';
import './UserManagement.css';

interface User {
  customer_id: number;
  fname: string;
  lname: string;
  Email: string;
  phone: string;
  address: string; // combined from street, state, country, zip
  status: string;
  login_count: number;
  last_login: string;
  is_logged_in: number; // tinyint (0/1)
}

interface UserManagementProps {
  onNavigate?: (view: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onNavigate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [expandedAddresses, setExpandedAddresses] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await axios.get(`https://jewelskart-backend.onrender.com/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`https://jewelskart-backend.onrender.com/admin/users/${selectedUser.customer_id}/status`, {
        status: statusUpdate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowStatusModal(false);
      setSelectedUser(null);
      setStatusUpdate('');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const openStatusModal = (user: User) => {
    setSelectedUser(user);
    setStatusUpdate(user.status);
    setShowStatusModal(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
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
      case 'active': return '#10b981';
      case 'inactive': return '#ef4444';
      case 'suspended': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const toggleAddress = (userId: number) => {
    setExpandedAddresses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="admin-user-management">
      <div className="admin-header">
        <h1>User Management</h1>
        <p>Manage customer accounts and permissions</p>
      </div>

      {/* Search */}
      <div className="admin-search-section">
        <div className="admin-search">
          <FaSearch className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Login Count</th>
              <th>Last Login</th>
              <th>Currently Logged In</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.customer_id}>
                <td><strong>#{user.customer_id}</strong></td>
                <td>
                  <div className="admin-user-info">
                    <strong>{user.fname} {user.lname}</strong>
                  </div>
                </td>
                <td>{user.Email}</td>
                <td>{user.phone || '-'}</td>
                <td style={{minWidth: '200px', maxWidth: expandedAddresses.has(user.customer_id) ? '500px' : '200px', width: expandedAddresses.has(user.customer_id) ? '500px' : '200px'}}>
                  {user.address && user.address.length > 50 ? (
                    <div style={{wordBreak: 'break-word', whiteSpace: 'normal', overflow: 'visible'}}>
                      <div style={{marginBottom: '4px'}}>
                        {expandedAddresses.has(user.customer_id) ? user.address : `${user.address.substring(0, 50)}...`}
                      </div>
                      <button 
                        style={{background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline'}}
                        onClick={() => {
                          console.log('Toggling address for user:', user.customer_id);
                          console.log('Current expanded state:', expandedAddresses.has(user.customer_id));
                          toggleAddress(user.customer_id);
                        }}
                      >
                        {expandedAddresses.has(user.customer_id) ? 'Show Less' : 'Show More'}
                      </button>
                    </div>
                  ) : (
                    <div style={{wordBreak: 'break-word'}}>{user.address || '-'}</div>
                  )}
                </td>
                <td>{user.login_count}</td>
                <td>{formatDate(user.last_login)}</td>
                <td>{user.is_logged_in ? "Yes" : "No"}</td>
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
      {showStatusModal && selectedUser && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Update User Status</h3>
              <button 
                className="admin-modal-close"
                onClick={() => setShowStatusModal(false)}
              >
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-user-status-info">
                <p><strong>User:</strong> {selectedUser.fname} {selectedUser.lname}</p>
                <p><strong>Email:</strong> {selectedUser.Email}</p>
                <p><strong>Current Status:</strong> 
                  <span 
                    className="admin-status-badge"
                    style={{ backgroundColor: getStatusColor(selectedUser.status) }}
                  >
                    {selectedUser.status}
                  </span>
                </p>
              </div>

              <div className="admin-form-group">
                <label htmlFor="user-status">New Status</label>
                <select
                  id="user-status"
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="admin-input"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="admin-status-warning">
                <p><strong>Note:</strong> Changing user status will affect their ability to:</p>
                <ul>
                  <li>Place new orders</li>
                  <li>Access their account</li>
                  <li>Receive notifications</li>
                </ul>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button 
                className="admin-btn-secondary"
                onClick={() => setShowStatusModal(false)}
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

export default UserManagement;
