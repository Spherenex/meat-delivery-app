// src/components/Modal.js
import React, { useEffect, useRef } from 'react';
import '../styles/components/Modal.css';
import { FaTimes } from 'react-icons/fa';

/**
 * Reusable Modal component
 * @param {boolean} isOpen - Whether modal is open
 * @param {function} onClose - Function to call when modal is closed
 * @param {string} title - Modal title
 * @param {node} children - Modal content
 * @param {string} size - Modal size: 'small', 'medium', 'large' (default: 'medium')
 * @returns {JSX.Element} - Modal component
 */
const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  const modalRef = useRef(null);
  
  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  // Close modal when pressing Escape key
  const handleEscKey = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  // Add and remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose]);
  
  // Don't render if modal is not open
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className={`modal-container ${size}`} ref={modalRef}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;