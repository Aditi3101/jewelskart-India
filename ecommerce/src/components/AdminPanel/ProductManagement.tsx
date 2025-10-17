import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
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
}

interface Category {
  catagory_id: number;
  catagory_name: string;
  type_id: number;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
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

  const [files, setFiles] = useState({
    fileToUpload: null as File | null,
    image1: null as File | null,
    image2: null as File | null,
    image3: null as File | null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    fileToUpload: "" as string,
    image1: "" as string,
    image2: "" as string,
    image3: "" as string,
  });

  useEffect(() => {
    fetchProducts();
    fetchTypes();
    fetchCategories();
  }, [currentPage, searchTerm]);

  const fetchTypes = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/admin/types", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setTypes(response.data.types.filter((t: Type) => t.status === 'y'));
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("http://localhost:5000/admin/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCategories(response.data.categories.filter((c: any) => c.status === 'y'));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `http://localhost:5000/admin/products?page=${currentPage}&search=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      const file = fileList[0];
      setFiles(prev => ({ ...prev, [name]: file }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({ ...prev, [name]: previewUrl }));
    }
  };

  const removeImage = (fieldName: string) => {
    setFiles(prev => ({ ...prev, [fieldName]: null }));
    setImagePreviews(prev => ({ ...prev, [fieldName]: "" }));
    
    // Reset the file input
    const fileInput = document.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("adminToken");
      const formDataToSend = new FormData();

      formDataToSend.append("catagory_id", formData.catagory_id);
      formDataToSend.append("type_name", formData.type_name);
      formDataToSend.append("catagory_name", formData.catagory_name);
      formDataToSend.append("p_name", formData.p_name);
      formDataToSend.append("p_code", formData.p_code);
      formDataToSend.append("p_details", formData.p_details);
      formDataToSend.append("p_description", formData.p_description);
      formDataToSend.append("p_price", formData.p_price);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("sub_type", "");
      formDataToSend.append("collection_name", "");
      formDataToSend.append("subname", "");
      formDataToSend.append("small_description", "");

      if (files.fileToUpload) formDataToSend.append("fileToUpload", files.fileToUpload);
      if (files.image1) formDataToSend.append("image1", files.image1);
      if (files.image2) formDataToSend.append("image2", files.image2);
      if (files.image3) formDataToSend.append("image3", files.image3);

      if (editingProduct) {
        await axios.put(`http://localhost:5000/admin/products/${editingProduct.p_id}`, formDataToSend, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
        });
      } else {
        await axios.post("http://localhost:5000/admin/products", formDataToSend, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
        });
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
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
      fileToUpload: product.fileToUpload ? `http://localhost:5000/uploads/${product.fileToUpload.replace(/^.*[\\\\\\/]/, '')}` : "",
      image1: product.image1 ? `http://localhost:5000/uploads/${product.image1.replace(/^.*[\\\\\\/]/, '')}` : "",
      image2: product.image2 ? `http://localhost:5000/uploads/${product.image2.replace(/^.*[\\\\\\/]/, '')}` : "",
      image3: product.image3 ? `http://localhost:5000/uploads/${product.image3.replace(/^.*[\\\\\\/]/, '')}` : "",
    });
    
    setShowForm(true);
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`http://localhost:5000/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
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
  };

  if (showForm) {
    return (
      <div style={{ padding: '15px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="admin-form-header">
            <button className="admin-back-btn" onClick={resetForm}>
              <FaArrowLeft /> Back
            </button>
            <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-section">
              <h3>Product Classification</h3>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Type *</label>
                  <select
                    name="type_name"
                    value={formData.type_name}
                    onChange={handleTypeChange}
                    required
                    className="admin-input"
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
                  <label>Category *</label>
                  <select
                    name="catagory_id"
                    value={formData.catagory_id}
                    onChange={handleCategoryChange}
                    required
                    className="admin-input"
                    disabled={!formData.type_name}
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
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="p_name"
                    value={formData.p_name}
                    onChange={handleInputChange}
                    required
                    className="admin-input"
                    placeholder="Enter product name"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Product Code *</label>
                  <input
                    type="text"
                    name="p_code"
                    value={formData.p_code}
                    onChange={handleInputChange}
                    required
                    className="admin-input"
                    placeholder="Enter unique product code"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Price *</label>
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
                  />
                </div>
              </div>
            </div>

            <div className="admin-form-section">
              <h3>Product Images</h3>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Main Image</label>
                  <input
                    type="file"
                    name="fileToUpload"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="admin-file-input-field"
                  />
                  {imagePreviews.fileToUpload && (
                    <div style={{ marginTop: '10px', position: 'relative', display: 'inline-block' }}>
                      <img 
                        src={imagePreviews.fileToUpload} 
                        alt="Main preview" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeImage('fileToUpload')}
                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <div className="admin-form-group">
                  <label>Image 1</label>
                  <input
                    type="file"
                    name="image1"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="admin-file-input-field"
                  />
                  {imagePreviews.image1 && (
                    <div style={{ marginTop: '10px', position: 'relative', display: 'inline-block' }}>
                      <img 
                        src={imagePreviews.image1} 
                        alt="Image 1 preview" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeImage('image1')}
                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Image 2</label>
                  <input
                    type="file"
                    name="image2"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="admin-file-input-field"
                  />
                  {imagePreviews.image2 && (
                    <div style={{ marginTop: '10px', position: 'relative', display: 'inline-block' }}>
                      <img 
                        src={imagePreviews.image2} 
                        alt="Image 2 preview" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeImage('image2')}
                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                <div className="admin-form-group">
                  <label>Image 3</label>
                  <input
                    type="file"
                    name="image3"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="admin-file-input-field"
                  />
                  {imagePreviews.image3 && (
                    <div style={{ marginTop: '10px', position: 'relative', display: 'inline-block' }}>
                      <img 
                        src={imagePreviews.image3} 
                        alt="Image 3 preview" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <button 
                        type="button" 
                        onClick={() => removeImage('image3')}
                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
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
                >
                  <option value="y">Active</option>
                  <option value="n">Inactive</option>
                </select>
              </div>
            </div>

            <div className="admin-form-actions">
              <button type="button" className="admin-btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="admin-btn-primary">
                {editingProduct ? "Update Product" : "Add Product"}
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
        <button className="admin-add-btn" onClick={() => setShowForm(true)}>
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
          />
        </div>
      </div>

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
            {products.map((product) => (
              <tr key={product.p_id}>
                <td>
                  <div className="admin-product-image">
                    {product.fileToUpload ? (
                      <img
                        src={`http://localhost:5000/uploads/${product.fileToUpload.replace(/^.*[\\\\\\/]/, '')}`}
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
                    <button className="admin-action-btn edit" onClick={() => handleEdit(product)}>
                      <FaEdit />
                    </button>
                    <button className="admin-action-btn delete" onClick={() => handleDelete(product.p_id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
    </div>
  );
};

export default ProductManagement;