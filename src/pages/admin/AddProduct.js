// src/pages/admin/AddProduct.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db, storage } from '../../firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useForm } from '../../hooks/hooks';
import { FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import '../../styles/pages/admin/ProductForm.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  
  // Initialize form with default values
  const initialState = {
    name: '',
    category: '',
    description: '',
    price: '',
    originalPrice: '',
    weight: '',
    pieces: '',
    serves: '',
    stock: '',
    featured: false,
    discount: 0,
    nutritionalInfo: {
      calories: '',
      protein: '',
      fat: '',
      carbohydrates: ''
    },
    cookingInstructions: ''
  };
  
  // Form validation function
  const validateForm = (formData) => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.price) errors.price = 'Price is required';
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (formData.originalPrice && 
        (isNaN(Number(formData.originalPrice)) || Number(formData.originalPrice) <= 0)) {
      errors.originalPrice = 'Original price must be a positive number';
    }
    
    if (!formData.weight.trim()) errors.weight = 'Weight is required';
    
    if (formData.stock && isNaN(Number(formData.stock))) {
      errors.stock = 'Stock must be a number';
    }
    
    return errors;
  };
  
  // Submit handler
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Check if image is selected
      if (!imageFile) {
        setError('Product image is required');
        setLoading(false);
        return;
      }
      
      // Calculate discount percentage if originalPrice is provided
      let discountPercentage = 0;
      if (formData.originalPrice && formData.price) {
        const originalPrice = Number(formData.originalPrice);
        const price = Number(formData.price);
        
        if (originalPrice > price) {
          discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
        }
      }
      
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);
      
      // Parse numerical values
      const productData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: formData.stock ? Number(formData.stock) : 0,
        discount: discountPercentage,
        image: imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Convert cooking instructions to array if provided as string
      if (typeof productData.cookingInstructions === 'string' && productData.cookingInstructions.trim()) {
        productData.cookingInstructions = productData.cookingInstructions
          .split('\n')
          .filter(line => line.trim());
      }
      
      // Add product to Firestore
      const docRef = await addDoc(collection(db, 'products'), productData);
      
      setSuccess(`Product "${formData.name}" added successfully!`);
      resetForm();
      setImagePreview(null);
      setImageFile(null);
      
      // Redirect to product list after 2 seconds
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err) {
      console.error('Error adding product:', err);
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Initialize form with validation and submit handler
  const {
    formData,
    handleChange,
    handleSubmit: submitForm,
    resetForm,
    setFormData,
    errors,
    isSubmitting
  } = useForm(initialState, validateForm, handleSubmit);
  
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle nutritional info changes
  const handleNutritionalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      nutritionalInfo: {
        ...formData.nutritionalInfo,
        [name.split('.')[1]]: value
      }
    });
  };
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please reload the page.');
      }
    };
    
    fetchCategories();
  }, []);
  
  return (
    <div className="admin-page product-form-page">
      <div className="admin-container">
        <div className="page-header">
          <Link to="/admin" className="back-link">
            <FaArrowLeft /> Back to Dashboard
          </Link>
          <h1>Add New Product</h1>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form className="product-form" onSubmit={submitForm}>
          <div className="form-grid">
            <div className="form-section">
              <h2>Basic Information</h2>
              
              <div className="form-group">
                <label htmlFor="name">Product Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <div className="error-text">{errors.name}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category*</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={errors.category ? 'error' : ''}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && <div className="error-text">{errors.category}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="weight">Weight*</label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g., 500 g"
                    className={errors.weight ? 'error' : ''}
                  />
                  {errors.weight && <div className="error-text">{errors.weight}</div>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price (₹)*</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={errors.price ? 'error' : ''}
                  />
                  {errors.price && <div className="error-text">{errors.price}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="originalPrice">Original Price (₹)</label>
                  <input
                    type="text"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className={errors.originalPrice ? 'error' : ''}
                  />
                  {errors.originalPrice && <div className="error-text">{errors.originalPrice}</div>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pieces">Pieces</label>
                  <input
                    type="text"
                    id="pieces"
                    name="pieces"
                    value={formData.pieces}
                    onChange={handleChange}
                    placeholder="e.g., 12-15 Pieces"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="serves">Serves</label>
                  <input
                    type="text"
                    id="serves"
                    name="serves"
                    value={formData.serves}
                    onChange={handleChange}
                    placeholder="e.g., 3-4"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    type="text"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className={errors.stock ? 'error' : ''}
                  />
                  {errors.stock && <div className="error-text">{errors.stock}</div>}
                </div>
                
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                    Mark as Featured
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Product Image</h2>
              
              <div className="image-upload">
                <div className={`image-preview ${!imagePreview ? 'empty' : ''}`}>
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Product preview" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <div className="upload-placeholder">
                      <p>Click to upload image</p>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="image-input"
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Description</h2>
            
            <div className="form-group">
              <label htmlFor="description">Product Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>
          </div>
          
          <div className="form-section">
            <h2>Additional Information</h2>
            
            <div className="form-subsection">
              <h3>Nutritional Information (per 100g)</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nutritionalInfo.calories">Calories</label>
                  <input
                    type="text"
                    id="nutritionalInfo.calories"
                    name="nutritionalInfo.calories"
                    value={formData.nutritionalInfo.calories}
                    onChange={handleNutritionalInfoChange}
                    placeholder="e.g., 215 kcal"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="nutritionalInfo.protein">Protein</label>
                  <input
                    type="text"
                    id="nutritionalInfo.protein"
                    name="nutritionalInfo.protein"
                    value={formData.nutritionalInfo.protein}
                    onChange={handleNutritionalInfoChange}
                    placeholder="e.g., 18.5g"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nutritionalInfo.fat">Fat</label>
                  <input
                    type="text"
                    id="nutritionalInfo.fat"
                    name="nutritionalInfo.fat"
                    value={formData.nutritionalInfo.fat}
                    onChange={handleNutritionalInfoChange}
                    placeholder="e.g., 15.7g"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="nutritionalInfo.carbohydrates">Carbohydrates</label>
                  <input
                    type="text"
                    id="nutritionalInfo.carbohydrates"
                    name="nutritionalInfo.carbohydrates"
                    value={formData.nutritionalInfo.carbohydrates}
                    onChange={handleNutritionalInfoChange}
                    placeholder="e.g., 0g"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="cookingInstructions">Cooking Instructions</label>
              <textarea
                id="cookingInstructions"
                name="cookingInstructions"
                value={formData.cookingInstructions}
                onChange={handleChange}
                rows="4"
                placeholder="Enter each instruction on a new line"
              ></textarea>
              <small>Enter each instruction on a new line</small>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => navigate('/admin')}>
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={isSubmitting}
            >
              <FaSave /> {isSubmitting ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;