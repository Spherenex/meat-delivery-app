

import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/components/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, cart, updateQuantity } = useContext(CartContext);

  // If the product is not active or doesn't exist, don't render it
  if (!product || !product.isActive) {
    return null;
  }

  const {
    id = '',
    name = 'Product Name',
    image = '',
    weight = '',
    price = 0,
    originalPrice = 0,
    discount = 0,
    meatCut = '' // Add the meat cut property
  } = product;

  const discountPercentage = discount || (originalPrice > price ? 
    Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  // Calculate price per liter (assuming weight is in ml)
  const weightInLiters = parseFloat(weight) / 1000;
  const pricePerLiter = weightInLiters > 0 ? (price / weightInLiters).toFixed(2) : 0;

  // Check if the product is in the cart and get its quantity
  const cartItem = cart.find(item => item.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Format weight to consistently display with 'g' unit if it's a number
  const formatWeight = (weightStr) => {
    if (!weightStr) return '';
    
    // If it already has a unit (g, kg, ml, etc.), return as is
    if (/[a-zA-Z]/.test(weightStr)) {
      return weightStr;
    }
    
    // If it's just a number, assume it's grams and add 'g'
    const numValue = parseFloat(weightStr);
    if (!isNaN(numValue)) {
      return `${numValue}g`;
    }
    
    return weightStr;
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image+Available';
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleRemoveFromCart = (e) => {
    e.stopPropagation();
    if (quantity > 0) {
      updateQuantity(id, quantity - 1); // Decrease quantity by 1
    }
  };
  
  // Display the meat cut category label
  const getMeatCutLabel = () => {
    return meatCut === 'jc-jatka' ? 'Desi Cut' : meatCut === 'halal-cut' ? 'Halal Cut' : '';
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} onError={handleImageError} />
        <div className="top-left-elements">
          {discountPercentage > 0 && (
            <span className="discount-tag">{discountPercentage}%off</span>
          )}
        </div>
        {meatCut && (
          <div className="meat-cut-label">
            <span className={`meat-cut-tag ${meatCut}`}>{getMeatCutLabel()}</span>
          </div>
        )}
        
        {/* Cart controls on the image */}
        <div className="cart-controls">
          <button 
            className={`cart-btn remove-btn ${quantity === 0 ? 'hidden' : ''}`}
            onClick={handleRemoveFromCart}
            aria-label="Remove one item from cart"
            disabled={quantity === 0}
          >
            −
          </button>
          
          {quantity > 0 && (
            <div className="quantity-display">
              {quantity}
            </div>
          )}
          
          <button 
            className="cart-btn add-btn"
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="product-details">
        <h3 className="product-name">{name}</h3>
        
        <div className="product-meta">
          {weight && <span className="product-weight">{formatWeight(weight)}</span>}
        </div>
        
        <div className="product-price">
          <span className="current-price">₹{price}</span>
          {originalPrice > price && (
            <span className="original-price">₹{originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

