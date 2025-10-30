import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaArrowLeft, FaTimes } from "react-icons/fa";
import "./ProductManagement.css";
import "./AdminForms.css";

interface Product {
  p_id: number;
  catagory_id?: number;
  type_name: string;
  sub_type: string;
  catagory_name: string;
  collection_name: string;
  p_name: string;
  subname: string;
  p_code: string;
  p_details: string;
  p_description: string;
  small_description: string;
  p_price: number;
  fileToUpload: string;
  image1: string;
  image2: string;
  image3: string;
  status: string;
}

interface Type {
  type_id: number;
  type_name: string;
  status?: string;
}

interface Category {
  catagory_id: number;
  catagory_name: string;
  type_id: number;
}

interface FormData {
  type_name: string;
  catagory_id: string;
  catagory_name: string;
  p_name: string;
  p_code: string;
  p_details: string;
  p_description: string;
  p_price: string;
  status: string;
}

interface FileState {
  fileToUpload: File | null;
  image1: File | null;
  image2: File | null;
  image3: File | null;
}

interface PreviewState {
  fileToUpload: string;
  image1: string;
  image2: string;
  image3: string;
}

const ProductManagementNew: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormData>({
    type_name: "",
    catagory_id: "",
    catagory_name: "",
    p_name: "",
    p_code: "",
    p_details: "",
    p_description: "",
    p_price: "",
    status: "y",
  });

  const [files, setFiles] = useState<FileState>({
    fileToUpload: null,
    image1: null,
    image2: null,
    image3: null,
  });

  const [imagePreviews, setImagePreviews] = useState<PreviewState>({
    fileToUpload: "",
    image1: "",
    image2: "",
    image3: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchTypes();
    fetchCategories();
  }, [currentPage, searchTerm]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get("https://jewelskart-backend.onrender.com/admin/types", {
        headers: getAuthHeaders()
      });
      if (response.data.success) {
        setTypes(response.data.types.filter((t: Type) => t.status === 'y'));
      }
    } catch (error) {
      console.error("Error fetching types:", error);
      setError("Failed to fetch types");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://jewelskart-backend.onrender.com/admin/categories", {
        headers: getAuthHeaders()
      });
      if (response.data.success) {
        setCategories(response.data.categories.filter((c: any) => c.status === 'y'));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://jewelskart-backend.onrender.com/admin/products?page=${currentPage}&search=${searchTerm}`,
        { headers: getAuthHeaders() }
      );
      if (response.data.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTypeName = e.target.value;
    const selectedType = types.find(t => t.type_name === selectedTypeName);
    
    setFormData(prev => ({
      ...prev,
      type_name: selectedTypeName,
      catagory_id: "",
      catagory_name: ""
    }));

    if (selectedType) {
      const typeCategories = categories.filter(c => c.type_id === selectedType.type_id);
      setFilteredCategories(typeCategories);
    } else {
      setFilteredCategories([]);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = e.target.value;
    const selectedCategory = filteredCategories.find(c => c.catagory_id.toString() === selectedCategoryId);
    
    setFormData(prev => ({
      ...prev,
      catagory_id: selectedCategoryId,
      catagory_name: selectedCategory?.catagory_name || ""
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isVideo = (file: File) => {
    return file.type.startsWith('video/');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      const file = fileList[0];
      
      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        alert("File size must be less than 50MB");
        return;
      }

      setFiles(prev => ({ ...prev, [name]: file }));
      
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({ ...prev, [name]: previewUrl }));
    }
  };

  const removeImage = (fieldName: keyof FileState) => {
    setFiles(prev => ({ ...prev, [fieldName]: null }));
    setImagePreviews(prev => ({ ...prev, [fieldName]: "" }));
    
    const fileInput = document.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const validateForm = (): boolean => {
    if (!formData.type_name) {
      alert("Please select a type");
      return false;
    }
    if (!formData.catagory_id) {
      alert("Please select a category");
      return false;
    }
    if (!formData.p_name.trim()) {
      alert("Please enter product name");
      return false;
    }
    if (!formData.p_code.trim()) {
      alert("Please enter product code");
      return false;
    }
    if (!formData.p_price || parseFloat(formData.p_price) <= 0) {
      alert("Please enter a valid price");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add additional fields
      formDataToSend.append("sub_type", "");
      formDataToSend.append("collection_name", "");
      formDataToSend.append("subname", "");
      formDataToSend.append("small_description", "");

      // Add files
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(key, file);
        }
      });

      const url = editingProduct 
        ? `https://jewelskart-backend.onrender.com/admin/products/${editingProduct.p_id}`
        : "https://jewelskart-backend.onrender.com/admin/products";
      
      const method = editingProduct ? 'put' : 'post';
      
      const response = await axios[method](url, formDataToSend, {
        headers: { 
          ...getAuthHeaders(), 
          "Content-Type": "multipart/form-data" 
        }
      });

      if (response.data.success) {
        alert(editingProduct ? "Product updated successfully!" : "Product added successfully!");
        resetForm();
        fetchProducts();
      }
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert(error.response?.data?.message || "Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    
    const productType = types.find(t => t.type_name === product.type_name);
    if (productType) {
      const typeCategories = categories.filter(c => c.type_id === productType.type_id);
      setFilteredCategories(typeCategories);
    }
    
    setFormData({
      type_name: product.type_name,
      catagory_id: product.catagory_id?.toString() || "",
      catagory_name: product.catagory_name,
      p_name: product.p_name,
      p_code: product.p_code,
      p_details: product.p_details,
      p_description: product.p_description,
      p_price: product.p_price.toString(),
      status: product.status,
    });
    
    // Set existing image previews
    setImagePreviews({
      fileToUpload: product.fileToUpload ? `https://jewelskart-backend.onrender.com/uploads/${product.fileToUpload.replace(/^.*[\\\\\\/]/, '')}` : "",
      image1: product.image1 ? `https://jewelskart-backend.onrender.com/uploads/${product.image1.replace(/^.*[\\\\\\/]/, '')}` : "",
      image2: product.image2 ? `https://jewelskart-backend.onrender.com/uploads/${product.image2.replace(/^.*[\\\\\\/]/, '')}` : "",
      image3: product.image3 ? `https://jewelskart-backend.onrender.com/uploads/${product.image3.replace(/^.*[\\\\\\/]/, '')}` : "",
    });
    
    setShowForm(true);
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        await axios.delete(`https://jewelskart-backend.onrender.com/admin/products/${productId}`, {
          headers: getAuthHeaders()
        });
        alert("Product deleted successfully!");
        fetchProducts();
      } catch (error: any) {
        console.error("Error deleting product:", error);
        alert(error.response?.data?.message || "Error deleting product");
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type_name: "",
      catagory_id: "",
      catagory_name: "",
      p_name: "",
      p_code: "",
      p_details: "",
      p_description: "",
      p_price: "",
      status: "y",
    });
    setFiles({
      fileToUpload: null,
      image1: null,
      image2: null,
      image3: null,
    });
    setImagePreviews({
      fileToUpload: "",
      image1: "",
      image2: "",
      image3: "",
    });
    setFilteredCategories([]);
    setEditingProduct(null);
    setShowForm(false);
    setError("");
  };

  const renderMediaPreview = (fieldName: keyof FileState, label: string, required: boolean = false) => (
    <div className="admin-form-group">
      <label>{label} {required && <span style={{color: 'red'}}>*</span>}</label>
      <input
        type="file"
        name={fieldName}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="admin-file-input-field"
        required={false}
      />
      {imagePreviews[fieldName] && (
        <div style={{ marginTop: '10px', position: 'relative', display: 'inline-block' }}>
          {files[fieldName] && isVideo(files[fieldName]!) ? (
            <video 
              src={imagePreviews[fieldName]} 
              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
              controls
            />
          ) : (
            <img 
              src={imagePreviews[fieldName]} 
              alt={`${label} preview`} 
              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
            />
          )}
          <button 
            type="button" 
            onClick={() => removeImage(fieldName)}
            style={{ 
              position: 'absolute', 
              top: '-5px', 
              right: '-5px', 
              background: 'red', 
              color: 'white', 
              border: 'none', 
              borderRadius: '50%', 
              width: '20px', 
              height: '20px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FaTimes size={10} />
          </button>
        </div>
      )}
    </div>
  );

  if (showForm) {
    return (
      <div style={{ padding: '15px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="admin-form-header">
            <button className="admin-back-btn" onClick={resetForm} disabled={loading}>
              <FaArrowLeft /> Back
            </button>
            <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          </div>

          {error && (
            <div style={{ background: '#fee', color: '#c53030', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-section">
              <h3>Product Classification</h3>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Type <span style={{color: 'red'}}>*</span></label>
                  <select
                    name="type_name"
                    value={formData.type_name}
                    onChange={handleTypeChange}
                    required
                    className="admin-input"
                    disabled={loading}
                  >
                    <option value="">-- Select Type --</option>
                    {types.map(type => (
                      <option key={type.type_id} value={type.type_name}>
                        {type.type_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Category <span style={{color: 'red'}}>*</span></label>
                  <select
                    name="catagory_id"
                    value={formData.catagory_id}
                    onChange={handleCategoryChange}
                    required
                    className="admin-input"
                    disabled={!formData.type_name || loading}
                  >
                    <option value="">-- Select Category --</option>
                    {filteredCategories.map(category => (
                      <option key={category.catagory_id} value={category.catagory_id}>
                        {category.catagory_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="admin-form-section">
              <h3>Basic Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', alignItems: 'start', marginBottom: '16px' }}>
                <div className="admin-form-group">
                  <label>Product Name <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="text"
                    name="p_name"
                    value={formData.p_name}
                    onChange={handleInputChange}
                    required
                    className="admin-input"
                    placeholder="Enter product name"
                    disabled={loading}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Product Code <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="text"
                    name="p_code"
                    value={formData.p_code}
                    onChange={handleInputChange}
                    required
                    className="admin-input"
                    placeholder="Enter unique product code"
                    disabled={loading}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Price <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="number"
                    name="p_price"
                    value={formData.p_price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    className="admin-input"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="admin-form-section">
              <h3>Product Descriptions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
                <div className="admin-form-group">
                  <label>Product Details</label>
                  <textarea
                    name="p_details"
                    value={formData.p_details}
                    onChange={handleInputChange}
                    rows={4}
                    className="admin-input"
                    placeholder="Key product details and specifications"
                    disabled={loading}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Product Description</label>
                  <textarea
                    name="p_description"
                    value={formData.p_description}
                    onChange={handleInputChange}
                    rows={4}
                    className="admin-input"
                    placeholder="Complete product description"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="admin-form-section">
              <h3>Product Media</h3>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                Supports images and videos (max 50MB each). Files are optional.
              </p>
              <div className="admin-form-row">
                {renderMediaPreview('fileToUpload', 'Main Media')}
                {renderMediaPreview('image1', 'Media 1')}
              </div>
              <div className="admin-form-row">
                {renderMediaPreview('image2', 'Media 2')}
                {renderMediaPreview('image3', 'Media 3')}
              </div>
            </div>

            <div className="admin-form-section">
              <h3>Product Status</h3>
              <div className="admin-form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="admin-input"
                  disabled={loading}
                >
                  <option value="y">Active</option>
                  <option value="n">Inactive</option>
                </select>
              </div>
            </div>

            <div className="admin-form-actions">
              <button type="button" className="admin-btn-secondary" onClick={resetForm} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="admin-btn-primary" disabled={loading}>
                {loading ? "Saving..." : (editingProduct ? "Update Product" : "Add Product")}
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
        <h1>Product Management</h1>
        <button className="admin-add-btn" onClick={() => setShowForm(true)} disabled={loading}>
          <FaPlus /> Add New Product
        </button>
      </div>

      <div className="admin-search-section">
        <div className="admin-search">
          <FaSearch className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee', color: '#c53030', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                  Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.p_id}>
                  <td>
                    <div className="admin-product-image">
                      {product.fileToUpload ? (
                        <img
                          src={`https://jewelskart-backend.onrender.com/uploads/${product.fileToUpload.replace(/^.*[\\\\\\/]/, '')}`}
                          alt={product.p_name}
                          style={{ display: 'block' }}
                        />
                      ) : (
                        <div className="admin-product-placeholder">No Image</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="admin-product-info">
                      <strong>{product.p_name}</strong>
                      <small>{product.p_description?.substring(0, 50)}...</small>
                    </div>
                  </td>
                  <td>{product.catagory_name}</td>
                  <td>₹{product.p_price}</td>
                  <td>
                    <span className={`admin-status-badge ${product.status === "y" ? "active" : "inactive"}`}>
                      {product.status === "y" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button 
                        className="admin-action-btn edit" 
                        onClick={() => handleEdit(product)}
                        disabled={loading}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="admin-action-btn delete" 
                        onClick={() => handleDelete(product.p_id)}
                        disabled={loading}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button
            className="admin-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </button>
          <span className="admin-pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="admin-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductManagementNew;