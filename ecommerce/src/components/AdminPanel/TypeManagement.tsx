import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import "./ProductManagement.css";
import "./AdminForms.css";

interface Type {
  type_id: number;
  type_name: string;
  status: string;
  created_at: string;
}

const TypeManagement: React.FC = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState<Type | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState({
    type_name: "",
    status: "y",
  });

  useEffect(() => {
    fetchTypes();
  }, [searchTerm]);

  const fetchTypes = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `https://jewelskart-backend.onrender.com/admin/types?search=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setTypes(response.data.types);
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      if (editingType) {
        await axios.put(`https://jewelskart-backend.onrender.com/admin/types/${editingType.type_id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("https://jewelskart-backend.onrender.com/admin/types", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      resetForm();
      fetchTypes();
    } catch (error) {
      console.error("Error saving type:", error);
    }
  };

  const handleEdit = (type: Type) => {
    setEditingType(type);
    setFormData({
      type_name: type.type_name,
      status: type.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (typeId: number) => {
    if (window.confirm("Are you sure you want to delete this type?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`https://jewelskart-backend.onrender.com/admin/types/${typeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchTypes();
      } catch (error) {
        console.error("Error deleting type:", error);
      }
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTypes(new Set(types.map(t => t.type_id)));
    } else {
      setSelectedTypes(new Set());
    }
  };

  const handleSelectType = (typeId: number, checked: boolean) => {
    const newSelected = new Set(selectedTypes);
    if (checked) {
      newSelected.add(typeId);
    } else {
      newSelected.delete(typeId);
    }
    setSelectedTypes(newSelected);
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedTypes.size === 0) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      
      await Promise.all(
        Array.from(selectedTypes).map(typeId =>
          axios.put(`https://jewelskart-backend.onrender.com/admin/types/${typeId}/status`, 
            { status }, 
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      setSelectedTypes(new Set());
      fetchTypes();
    } catch (error) {
      console.error("Error updating types:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      type_name: "",
      status: "y",
    });
    setEditingType(null);
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="admin-product-form-container">
        <div className="admin-product-form">
          <div className="admin-form-header">
            <button className="admin-back-btn" onClick={resetForm}>
              <FaArrowLeft /> Back
            </button>
            <h2>{editingType ? "Edit Type" : "Add New Type"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-section">
              <h3>Type Information</h3>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Type Name *</label>
                  <input
                    type="text"
                    name="type_name"
                    value={formData.type_name}
                    onChange={handleInputChange}
                    required
                    className="admin-input"
                    placeholder="Enter type name (e.g., 925 Sterling Silver)"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="admin-input"
                  >
                    <option value="y">Active</option>
                    <option value="n">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="admin-form-actions">
              <button type="button" className="admin-btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="admin-btn-primary">
                {editingType ? "Update Type" : "Add Type"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-product-management">
      <div className="admin-header">
        <h1>Type Management</h1>
        <button className="admin-add-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> Add New Type
        </button>
      </div>

      <div className="admin-search-section">
        <div className="admin-search">
          <FaSearch className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>
        {selectedTypes.size > 0 && (
          <div style={{display: 'flex', gap: '12px', marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <span style={{color: '#374151', fontWeight: '600', alignSelf: 'center'}}>{selectedTypes.size} selected:</span>
            <button 
              className="admin-btn-primary" 
              onClick={() => handleBulkStatusUpdate('y')}
              style={{background: '#10b981', minWidth: '120px'}}
            >
              Activate
            </button>
            <button 
              className="admin-btn-primary" 
              onClick={() => handleBulkStatusUpdate('n')}
              style={{background: '#f59e0b', minWidth: '120px'}}
            >
              Deactivate
            </button>
          </div>
        )}
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  checked={selectedTypes.size === types.length && types.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>Type Name</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type.type_id}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedTypes.has(type.type_id)}
                    onChange={(e) => handleSelectType(type.type_id, e.target.checked)}
                  />
                </td>
                <td>
                  <strong>{type.type_name}</strong>
                </td>
                <td>
                  <span className={`admin-status-badge ${type.status === "y" ? "active" : "inactive"}`}>
                    {type.status === "y" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{new Date(type.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn edit" onClick={() => handleEdit(type)}>
                      <FaEdit />
                    </button>
                    <button className="admin-action-btn delete" onClick={() => handleDelete(type.type_id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TypeManagement;