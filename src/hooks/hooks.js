// src/hooks/hooks.js
import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Custom hook for form handling
 * @param {object} initialState - Initial form state
 * @param {function} validateForm - Validation function
 * @param {function} onSubmit - Submit handler function
 * @returns {object} Form state, handlers, and error state
 */
export const useForm = (initialState, validateForm, onSubmit) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  
  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setTouched({});
  };
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle field blur (for validation on blur)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    
    if (validateForm) {
      const fieldError = validateForm({
        [name]: formData[name]
      }, {
        [name]: { required: true }
      });
      
      if (fieldError[name]) {
        setErrors({
          ...errors,
          [name]: fieldError[name]
        });
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm) {
      const formErrors = validateForm(formData);
      setErrors(formErrors);
      
      if (Object.keys(formErrors).length === 0) {
        setIsSubmitting(true);
        try {
          await onSubmit(formData);
        } catch (error) {
          console.error('Form submission error:', error);
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return {
    formData,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormData,
    errors,
    isSubmitting,
    touched
  };
};

/**
 * Custom hook for authentication state
 * @returns {object} Auth state and user
 */
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              ...userDoc.data()
            });
          } else {
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  return { currentUser, loading };
};

/**
 * Custom hook for fetching document from Firestore
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {object} Document data, loading state, and error
 */
export const useFirestoreDoc = (collectionName, docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!docId) {
          setData(null);
          setLoading(false);
          return;
        }
        
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setData({
            id: docSnap.id,
            ...docSnap.data()
          });
        } else {
          setData(null);
          setError('Document not found');
        }
      } catch (err) {
        console.error(`Error fetching document from ${collectionName}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [collectionName, docId]);
  
  return { data, loading, error };
};

/**
 * Custom hook for debouncing values (useful for search inputs)
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

/**
 * Custom hook for local storage
 * @param {string} key - Storage key
 * @param {any} initialValue - Initial value
 * @returns {Array} [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };
  
  return [storedValue, setValue];
};

/**
 * Custom hook for handling modal state
 * @returns {object} Modal state and handlers
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  
  const openModal = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }, []);
  
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
    // Restore body scrolling when modal is closed
    document.body.style.overflow = 'auto';
  }, []);
  
  return { isOpen, modalData, openModal, closeModal };
};

/**
 * Custom hook for handling pagination
 * @param {Array} items - Array of items to paginate
 * @param {number} itemsPerPage - Number of items per page
 * @returns {object} Pagination state and handlers
 */
export const usePagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(items.length / itemsPerPage);
  
  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const next = () => {
    setCurrentPage(current => Math.min(current + 1, maxPage));
  };
  
  const prev = () => {
    setCurrentPage(current => Math.max(current - 1, 1));
  };
  
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, maxPage));
    setCurrentPage(pageNumber);
  };
  
  return {
    currentPage,
    maxPage,
    currentItems,
    next,
    prev,
    goToPage
  };
};