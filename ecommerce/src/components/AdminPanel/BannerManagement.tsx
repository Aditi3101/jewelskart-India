import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaArrowLeft,
  FaUpload
} from 'react-icons/fa';
import './BannerManagement.css';
import './AdminForms.css';

interface Banner {
  id: number;
  title: string;
  image_url: string;
  placement: string;
  link: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  type: string;
}

interface BannerManagementProps {
  onNavigate?: (view: string) => void;
}

const BannerManagement: React.FC<BannerManagementProps> = ({ onNavigate }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    is_active: 1
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  
  const types = ['Main Homepage banner', 'Homepage Carousal', 'ByCategory', 'ByCollection', 'Wholesale', 'Contact', 'Bag-Banner', 'Wholesale_sub'];
  const [categories] = useState(['Bags', 'Necklaces', 'Bracelets', 'Earrings', 'Rings', 'Other']);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('https://jewelskart-backend.onrender.com/admin/banners', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setBanners(response.data.banners);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      
      // Add form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });
      
      // Add image if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingBanner) {
        await axios.put(`https://jewelskart-backend.onrender.com/admin/banners/${editingBanner.id}`, formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('https://jewelskart-backend.onrender.com/admin/banners', formDataToSend, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setShowForm(false);
      setEditingBanner(null);
      setFormData({
        title: '',
        type: '',
        is_active: 1
      });
      setImageFile(null);
      setPreviewImage('');
      
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      type: banner.type,
      is_active: banner.is_active
    });
    setPreviewImage(banner.image_url ? `https://jewelskart-backend.onrender.com/uploads/banner/${banner.image_url}` : '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (bannerId: number) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(`https://jewelskart-backend.onrender.com/admin/banners/${bannerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: '',
      is_active: 1
    });
    setEditingBanner(null);
    setImageFile(null);
    setPreviewImage('');
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="admin-banner-form-container">
        <div className="admin-banner-form">
          <div className="admin-form-header">
            <button className="admin-back-btn" onClick={resetForm}>
              <FaArrowLeft /> Back
            </button>
            <h2>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-form-group">
              <label htmlFor="title">Banner Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="admin-input"
                placeholder="Enter banner title"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="type">Banner Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="admin-input"
              >
                <option value="">Select Type</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>



            <div className="admin-form-group">
              <label htmlFor="image">Banner Image *</label>
              <div className="admin-image-upload">
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="admin-file-input"
                  required={!editingBanner}
                />
                <label htmlFor="image" className="admin-upload-label">
                  <FaUpload />
                  <span>Choose Image</span>
                </label>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Active Status</label>
              <div className="admin-checkbox-group">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active === 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked ? 1 : 0 }))}
                  className="admin-checkbox"
                />
                <label htmlFor="is_active">Enable this banner</label>
              </div>
            </div>

            {/* Image Preview */}
            {(previewImage || editingBanner?.image_url) && (
              <div className="admin-image-preview">
                <label>Preview:</label>
                <div className="admin-preview-container">
                  <img 
                    src={previewImage || `https://jewelskart-backend.onrender.com/uploads/banner/${editingBanner?.image_url}`} 
                    alt="Banner preview" 
                    className="admin-preview-image"
                  />
                </div>
              </div>
            )}

            <div className="admin-form-actions">
              <button type="button" className="admin-btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="admin-btn-primary">
                {editingBanner ? 'Update Banner' : 'Add Banner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading banners...</p>
      </div>
    );
  }

  return (
    <div className="admin-banner-management">
      <div className="admin-header">
        <h1>Banner Management</h1>
        <button 
          className="admin-add-btn"
          onClick={() => setShowForm(true)}
        >
          <FaPlus /> Add New Banner
        </button>
      </div>

      {/* Banners Grid */}
      <div className="admin-banners-grid">
        {banners.map((banner) => (
          <div key={banner.id} className="admin-banner-card">
            <div className="admin-banner-image">
              {banner.image_url ? (
                <img 
                  src={`https://jewelskart-backend.onrender.com/uploads/banner/${banner.image_url}`} 
                  alt={banner.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/vite.svg';
                  }}
                />
              ) : (
                <div className="admin-banner-placeholder">No Image</div>
              )}
              <div className="admin-banner-overlay">
                <div className="admin-banner-actions">
                  <button 
                    className="admin-action-btn edit"
                    onClick={() => handleEdit(banner)}
                    title="Edit Banner"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="admin-action-btn delete"
                    onClick={() => handleDelete(banner.id)}
                    title="Delete Banner"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="admin-banner-info">
              <h3>{banner.title}</h3>
              <div className="admin-banner-meta">
                <span className={`admin-status-badge ${banner.is_active ? 'active' : 'inactive'}`}>
                  {banner.is_active ? 'Active' : 'Inactive'}
                </span>

                <span className="admin-type-badge">{banner.type}</span>
              </div>

            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="admin-empty-state">
          <div className="admin-empty-icon">
            {/* <FaImages /> */}
          </div>
          <h3>No Banners Found</h3>
          <p>Get started by adding your first banner to promote your products.</p>
          <button 
            className="admin-btn-primary"
            onClick={() => setShowForm(true)}
          >
            <FaPlus /> Add First Banner
          </button>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;

