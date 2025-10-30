import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import "./ProductManagement.css";
import "./AdminForms.css";

interface Category {
  catagory_id: number;
  catagory_name: string;
  type_name: string;
  type_id?: number;
  image: string;
  description: string;
  banner_name: string;
  status: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState({
    catagory_name: "",
    type_id: "",
    description: "",
    banner_name: "",
    status: "y",
  });

  const [availableTypes, setAvailableTypes] = useState<{type_id: number, type_name: string}[]>([]);

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchTypes();
  }, [searchTerm]);

  const fetchTypes = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        "https://jewelskart-backend.onrender.com/admin/types",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setAvailableTypes(response.data.types.filter((t: any) => t.status === 'y'));
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No admin token found");
        return;
      }
      
      const response = await axios.get(
        `https://jewelskart-backend.onrender.com/admin/categories?search=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("No admin token found. Please login again.");
        return;
      }
      
      const formDataToSend = new FormData();

      formDataToSend.append("catagory_name", formData.catagory_name);
      formDataToSend.append("type_id", formData.type_id);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("banner_name", formData.banner_name);
      formDataToSend.append("status", formData.status);

      if (file) formDataToSend.append("image", file);

      console.log("Submitting with token:", token ? "Token exists" : "No token");
      console.log("Form data:", Object.fromEntries(formDataToSend));

      if (editingCategory) {
        await axios.put(`https://jewelskart-backend.onrender.com/admin/categories/${editingCategory.catagory_id}`, formDataToSend, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("https://jewelskart-backend.onrender.com/admin/categories", formDataToSend, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      }

      alert("Category saved successfully!");
      resetForm();
      fetchCategories();
    } catch (error: any) {
      console.error("Error saving category:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert(`Error saving category: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      catagory_name: category.catagory_name,
      type_id: category.type_id?.toString() || "",
      description: category.description,
      banner_name: category.banner_name,
      status: category.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`https://jewelskart-backend.onrender.com/admin/categories/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchCategories();
      } catch (error: any) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(new Set(categories.map(c => c.catagory_id)));
    } else {
      setSelectedCategories(new Set());
    }
  };

  const handleSelectCategory = (categoryId: number, checked: boolean) => {
    const newSelected = new Set(selectedCategories);
    if (checked) {
      newSelected.add(categoryId);
    } else {
      newSelected.delete(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedCategories.size === 0) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      
      await Promise.all(
        Array.from(selectedCategories).map(categoryId =>
          axios.put(`https://jewelskart-backend.onrender.com/admin/categories/${categoryId}/status`, 
            { status }, 
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      setSelectedCategories(new Set());
      fetchCategories();
    } catch (error: any) {
      console.error("Error updating categories:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.size === 0 || !window.confirm(`Delete ${selectedCategories.size} categories?`)) return;
    
    try {
      const token = localStorage.getItem("adminToken");
      await Promise.all(
        Array.from(selectedCategories).map(categoryId =>
          axios.delete(`https://jewelskart-backend.onrender.com/admin/categories/${categoryId}`, 
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      setSelectedCategories(new Set());
      fetchCategories();
    } catch (error: any) {
      console.error("Error deleting categories:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      catagory_name: "",
      type_id: "",
      description: "",
      banner_name: "",
      status: "y",
    });
    setFile(null);
    setEditingCategory(null);
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
            <h2>{editingCategory ? "Edit Category" : "Add New Category"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-section">
              <h3>Category Information</h3>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    name="catagory_name"
                    value={formData.catagory_name}
                    onChange={handleInputChange}
                    required
                    className="admin-input"
                    placeholder="Enter category name"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Type *</label>
                  <select
                    name="type_id"
                    value={formData.type_id}
                    onChange={handleInputChange}
                    required
                    className="admin-input"
                  >
                    <option value="">-- Select Type --</option>
                    {availableTypes.map(type => (
                      <option key={type.type_id} value={type.type_id}>{type.type_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Banner Name</label>
                  <input
                    type="text"
                    name="banner_name"
                    value={formData.banner_name}
                    onChange={handleInputChange}
                    className="admin-input"
                    placeholder="Enter banner name"
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

            <div className="admin-form-section">
              <h3>Description & Image</h3>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="admin-input"
                  placeholder="Enter category description"
                />
              </div>
              <div className="admin-form-group">
                <label>Category Image</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="admin-file-input-field"
                />
              </div>
            </div>

            <div className="admin-form-actions">
              <button type="button" className="admin-btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="admin-btn-primary">
                {editingCategory ? "Update Category" : "Add Category"}
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
        <h1>Category Management</h1>
        <button className="admin-add-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> Add New Category
        </button>
      </div>

      <div className="admin-search-section">
        <div className="admin-search">
          <FaSearch className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>
        {selectedCategories.size > 0 && (
          <div style={{display: 'flex', gap: '12px', marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
            <span style={{color: '#374151', fontWeight: '600', alignSelf: 'center'}}>{selectedCategories.size} selected:</span>
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
            <button 
              className="admin-btn-primary" 
              onClick={handleBulkDelete}
              style={{background: '#ef4444', minWidth: '120px'}}
            >
              Delete
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
                  checked={selectedCategories.size === categories.length && categories.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>Image</th>
              <th>Category Name</th>
              <th>Type Name</th>
              <th>Banner Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.catagory_id}>
                <td>
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.has(category.catagory_id)}
                    onChange={(e) => handleSelectCategory(category.catagory_id, e.target.checked)}
                  />
                </td>
                <td>
                  <div className="admin-product-image">
                    {category.image ? (
                      <img
                        src={`https://jewelskart-backend.onrender.com/uploads/${category.image}`}
                        alt={category.catagory_name}
                        style={{ display: 'block' }}
                      />
                    ) : null}
                    <div className="admin-product-placeholder" style={{ display: category.image ? 'none' : 'flex' }}>
                      No Image
                    </div>
                  </div>
                </td>
                <td>
                  <div className="admin-product-info">
                    <strong>{category.catagory_name}</strong>
                    <small>{category.description?.substring(0, 50)}...</small>
                  </div>
                </td>
                <td>{category.type_name}</td>
                <td>{category.banner_name}</td>
                <td>
                  <span className={`admin-status-badge ${category.status === "y" ? "active" : "inactive"}`}>
                    {category.status === "y" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button className="admin-action-btn edit" onClick={() => handleEdit(category)}>
                      <FaEdit />
                    </button>
                    <button className="admin-action-btn delete" onClick={() => handleDelete(category.catagory_id)}>
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

export default CategoryManagement;