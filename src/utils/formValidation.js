// src/utils/formValidation.js

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validates phone number (10 digits)
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if phone is valid
   */
  export const isValidPhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };
  
  /**
   * Validates PIN code (6 digits)
   * @param {string} pincode - PIN code to validate
   * @returns {boolean} True if PIN code is valid
   */
  export const isValidPincode = (pincode) => {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
  };
  
  /**
   * Validates password strength
   * @param {string} password - Password to validate
   * @returns {object} Validation result with isValid and message
   */
  export const validatePassword = (password) => {
    if (!password || password.length < 6) {
      return {
        isValid: false,
        message: 'Password must be at least 6 characters long'
      };
    }
    
    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter'
      };
    }
    
    if (!/[0-9]/.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one number'
      };
    }
    
    return {
      isValid: true,
      message: 'Password is strong'
    };
  };
  
  /**
   * Validates required field
   * @param {string} value - Field value
   * @param {string} fieldName - Name of the field
   * @returns {string|null} Error message or null if valid
   */
  export const validateRequired = (value, fieldName) => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    return null;
  };
  
  /**
   * Validates minimum length
   * @param {string} value - Field value
   * @param {number} minLength - Minimum length required
   * @param {string} fieldName - Name of the field
   * @returns {string|null} Error message or null if valid
   */
  export const validateMinLength = (value, minLength, fieldName) => {
    if (value && value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters long`;
    }
    return null;
  };
  
  /**
   * Validates maximum length
   * @param {string} value - Field value
   * @param {number} maxLength - Maximum length allowed
   * @param {string} fieldName - Name of the field
   * @returns {string|null} Error message or null if valid
   */
  export const validateMaxLength = (value, maxLength, fieldName) => {
    if (value && value.length > maxLength) {
      return `${fieldName} must not exceed ${maxLength} characters`;
    }
    return null;
  };
  
  /**
   * Validates numeric value
   * @param {string} value - Field value
   * @param {string} fieldName - Name of the field
   * @returns {string|null} Error message or null if valid
   */
  export const validateNumeric = (value, fieldName) => {
    if (value && isNaN(Number(value))) {
      return `${fieldName} must be a number`;
    }
    return null;
  };
  
  /**
   * Validates form fields
   * @param {object} formData - Form data object
   * @param {object} validationRules - Validation rules object
   * @returns {object} Validation errors object
   */
  export const validateForm = (formData, validationRules) => {
    const errors = {};
    
    Object.keys(validationRules).forEach(fieldName => {
      const value = formData[fieldName];
      const rules = validationRules[fieldName];
      
      // Check required
      if (rules.required) {
        const error = validateRequired(value, rules.label || fieldName);
        if (error) {
          errors[fieldName] = error;
          return; // Skip other validations if required fails
        }
      }
      
      // Skip other validations if the field is empty and not required
      if (!value && !rules.required) {
        return;
      }
      
      // Check min length
      if (rules.minLength) {
        const error = validateMinLength(value, rules.minLength, rules.label || fieldName);
        if (error) {
          errors[fieldName] = error;
          return;
        }
      }
      
      // Check max length
      if (rules.maxLength) {
        const error = validateMaxLength(value, rules.maxLength, rules.label || fieldName);
        if (error) {
          errors[fieldName] = error;
          return;
        }
      }
      
      // Check if email
      if (rules.isEmail && value) {
        if (!isValidEmail(value)) {
          errors[fieldName] = `Please enter a valid email address`;
          return;
        }
      }
      
      // Check if phone
      if (rules.isPhone && value) {
        if (!isValidPhone(value)) {
          errors[fieldName] = `Please enter a valid 10-digit phone number`;
          return;
        }
      }
      
      // Check if PIN code
      if (rules.isPincode && value) {
        if (!isValidPincode(value)) {
          errors[fieldName] = `Please enter a valid 6-digit PIN code`;
          return;
        }
      }
      
      // Check if numeric
      if (rules.isNumeric && value) {
        const error = validateNumeric(value, rules.label || fieldName);
        if (error) {
          errors[fieldName] = error;
          return;
        }
      }
      
      // Check password strength
      if (rules.isPassword && value) {
        const passwordResult = validatePassword(value);
        if (!passwordResult.isValid) {
          errors[fieldName] = passwordResult.message;
          return;
        }
      }
      
      // Check if matches another field
      if (rules.matches && value) {
        const matchValue = formData[rules.matches];
        if (value !== matchValue) {
          errors[fieldName] = `${rules.label || fieldName} does not match ${rules.matchLabel || rules.matches}`;
          return;
        }
      }
      
      // Custom validation
      if (rules.custom && value) {
        const customError = rules.custom(value, formData);
        if (customError) {
          errors[fieldName] = customError;
        }
      }
    });
    
    return errors;
  };