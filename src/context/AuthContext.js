// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Create context
export const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Clear error message
  const clearError = () => setError('');
  
  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different error codes
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password');
          break;
        case 'auth/too-many-requests':
          setError('Too many unsuccessful login attempts. Please try again later');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled');
          break;
        default:
          setError('An error occurred during login. Please try again');
      }
      throw err;
    }
  };
  
  // Register with email and password
  const register = async (email, password, userData) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: userData.fullName
      });
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName: userData.fullName,
        email: user.email,
        phone: userData.phone || '',
        createdAt: new Date().toISOString(),
        addresses: [],
        isAdmin: false
      });
      
      return user;
    } catch (err) {
      console.error('Registration error:', err);
      
      // Handle different error codes
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Email already in use');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/weak-password':
          setError('Password is too weak');
          break;
        default:
          setError('An error occurred during registration. Please try again');
      }
      throw err;
    }
  };
  
  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
      setError('An error occurred during logout. Please try again');
      throw err;
    }
  };
  
  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      console.error('Password reset error:', err);
      
      // Handle different error codes
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No user found with this email address');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        default:
          setError('An error occurred. Please try again');
      }
      throw err;
    }
  };
  
  // Update user profile
  const updateUserProfile = async (userData) => {
    try {
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }
      
      // Update displayName in Firebase Auth
      await updateProfile(currentUser, {
        displayName: userData.fullName
      });
      
      // Update user document in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        fullName: userData.fullName,
        phone: userData.phone || ''
      });
      
      // Update local user state
      fetchUserProfile(currentUser.uid);
      
      return true;
    } catch (err) {
      console.error('Profile update error:', err);
      setError('An error occurred while updating profile. Please try again');
      throw err;
    }
  };
  
  // Fetch user profile data from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile({
          uid,
          ...userData
        });
      } else {
        setUserProfile(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Error fetching user profile');
      setUserProfile(null);
    }
  };
  
  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    clearError
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};