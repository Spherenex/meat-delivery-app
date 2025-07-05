// // src/pages/Login.js
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   FaMobile, 
//   FaEnvelope, 
//   FaChevronRight,
//   FaTimes,
//   FaEye,
//   FaEyeSlash,
//   FaShieldAlt,
//   FaGoogle,
//   FaFacebook,
//   FaUser,
//   FaLock
// } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import { 
//   signInWithEmailAndPassword, 
//   createUserWithEmailAndPassword,
//   signInWithPopup, 
//   GoogleAuthProvider, 
//   FacebookAuthProvider,
//   RecaptchaVerifier,
//   signInWithPhoneNumber 
// } from 'firebase/auth';
// import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
// import { auth, db } from '../firebase/config';
// import '../styles/pages/Login.css';
// import logoImage from '../assets/images/logo.png';

// const Login = ({ isOpen, onClose, onLogin }) => {
//   // Common states
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [loginMethod, setLoginMethod] = useState('phone');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   // Phone login states
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [confirmationResult, setConfirmationResult] = useState(null);
  
//   // Email login states
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
  
//   // Registration states
//   const [name, setName] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
  
//   const modalRef = useRef(null);
//   const recaptchaVerifierRef = useRef(null);
//   const navigate = useNavigate();

//   // Initialize recaptcha verifier for phone authentication
//   useEffect(() => {
//     if (isOpen && loginMethod === 'phone' && !recaptchaVerifierRef.current) {
//       recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
//         'size': 'invisible'
//       });
//     }
    
//     return () => {
//       if (recaptchaVerifierRef.current) {
//         recaptchaVerifierRef.current = null;
//       }
//     };
//   }, [isOpen, loginMethod]);

//   // Reset state when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       setLoginMethod('phone');
//       setPhone('');
//       setOtp('');
//       setOtpSent(false);
//       setEmail('');
//       setPassword('');
//       setIsRegistering(false);
//       setName('');
//       setConfirmPassword('');
//       setError('');
//     }
//   }, [isOpen]);

//   // OTP timer
//   useEffect(() => {
//     let timer;
//     if (countdown > 0) {
//       timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [countdown]);

//   // Close modal when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   // Send OTP function using Firebase
//   const sendOtp = async () => {
//     if (phone.length !== 10) return;
    
//     try {
//       setLoading(true);
//       setError('');
      
//       // Format phone number for international format
//       const phoneNumber = `+91${phone}`;
      
//       // Send OTP using Firebase
//       const appVerifier = recaptchaVerifierRef.current;
//       const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
//       setConfirmationResult(confirmation);
//       setOtpSent(true);
//       setCountdown(30);
      
//       toast.success(`OTP sent to ${phoneNumber}`, {
//         position: "bottom-center",
//         autoClose: 2000
//       });
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       setError(`Failed to send OTP: ${error.message}`);
//       toast.error(`Failed to send OTP: ${error.message}`, {
//         position: "bottom-center"
//       });
      
//       // Reset recaptcha on error
//       if (recaptchaVerifierRef.current) {
//         recaptchaVerifierRef.current.clear();
//         recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
//           'size': 'invisible'
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify OTP function using Firebase
//   const verifyOtp = async () => {
//     if (otp.length !== 6 || !confirmationResult) return;
    
//     try {
//       setLoading(true);
//       setError('');
      
//       // Verify OTP
//       const result = await confirmationResult.confirm(otp);
//       const user = result.user;
      
//       // Check if user exists in Firestore
//       const userDoc = await getDoc(doc(db, 'users', user.uid));
      
//       // If user doesn't exist, create profile
//       if (!userDoc.exists()) {
//         await setDoc(doc(db, 'users', user.uid), {
//           phoneNumber: user.phoneNumber,
//           createdAt: serverTimestamp(),
//           lastLogin: serverTimestamp()
//         });
//       } else {
//         // Update last login
//         await setDoc(doc(db, 'users', user.uid), {
//           lastLogin: serverTimestamp()
//         }, { merge: true });
//       }
      
//       // Update local storage and state
//       localStorage.setItem("isAuthenticated", "true");
//       localStorage.setItem("userId", user.uid);
      
//       onLogin();
//       onClose();
      
//       toast.success("Successfully logged in!", {
//         position: "bottom-center",
//         autoClose: 2000
//       });
      
//       navigate('/account');
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       setError(`Invalid OTP: ${error.message}`);
//       toast.error(`Invalid OTP: ${error.message}`, {
//         position: "bottom-center"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Email login function using Firebase
//   const handleEmailLogin = async (e) => {
//     e.preventDefault();
//     if (!email || !password) return;
    
//     try {
//       setLoading(true);
//       setError('');
      
//       // Sign in with email and password
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
      
//       // Update last login
//       await setDoc(doc(db, 'users', user.uid), {
//         lastLogin: serverTimestamp()
//       }, { merge: true });
      
//       // Update local storage and state
//       localStorage.setItem("isAuthenticated", "true");
//       localStorage.setItem("userId", user.uid);
      
//       onLogin();
//       onClose();
      
//       toast.success("Successfully logged in!", {
//         position: "bottom-center",
//         autoClose: 2000
//       });
      
//       navigate('/account');
//     } catch (error) {
//       console.error("Error logging in:", error);
//       setError(`Login failed: ${error.message}`);
//       toast.error(`Login failed: ${error.message}`, {
//         position: "bottom-center"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Email registration function
//   const handleEmailRegistration = async (e) => {
//     e.preventDefault();
    
//     if (!name || !email || !password || password !== confirmPassword) {
//       if (password !== confirmPassword) {
//         setError("Passwords do not match");
//         toast.error("Passwords do not match", {
//           position: "bottom-center"
//         });
//       } else {
//         setError("Please fill all fields");
//         toast.error("Please fill all fields", {
//           position: "bottom-center"
//         });
//       }
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError('');
      
//       // Create user with email and password
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
      
//       // Create user profile in Firestore
//       await setDoc(doc(db, 'users', user.uid), {
//         name,
//         email,
//         createdAt: serverTimestamp(),
//         lastLogin: serverTimestamp()
//       });
      
//       // Update local storage and state
//       localStorage.setItem("isAuthenticated", "true");
//       localStorage.setItem("userId", user.uid);
      
//       onLogin();
//       onClose();
      
//       toast.success("Account created successfully!", {
//         position: "bottom-center",
//         autoClose: 2000
//       });
      
//       navigate('/account');
//     } catch (error) {
//       console.error("Error creating account:", error);
//       setError(`Registration failed: ${error.message}`);
//       toast.error(`Registration failed: ${error.message}`, {
//         position: "bottom-center"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Social login functions
//   const handleGoogleLogin = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
      
//       // Check if user exists in Firestore
//       const userDoc = await getDoc(doc(db, 'users', user.uid));
      
//       // If user doesn't exist, create profile
//       if (!userDoc.exists()) {
//         await setDoc(doc(db, 'users', user.uid), {
//           name: user.displayName,
//           email: user.email,
//           photoURL: user.photoURL,
//           createdAt: serverTimestamp(),
//           lastLogin: serverTimestamp()
//         });
//       } else {
//         // Update last login
//         await setDoc(doc(db, 'users', user.uid), {
//           lastLogin: serverTimestamp()
//         }, { merge: true });
//       }
      
//       // Update local storage and state
//       localStorage.setItem("isAuthenticated", "true");
//       localStorage.setItem("userId", user.uid);
      
//       onLogin();
//       onClose();
      
//       toast.success("Successfully logged in with Google!", {
//         position: "bottom-center",
//         autoClose: 2000
//       });
      
//       navigate('/account');
//     } catch (error) {
//       console.error("Error with Google login:", error);
//       setError(`Google login failed: ${error.message}`);
//       toast.error(`Google login failed: ${error.message}`, {
//         position: "bottom-center"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFacebookLogin = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const provider = new FacebookAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
      
//       // Check if user exists in Firestore
//       const userDoc = await getDoc(doc(db, 'users', user.uid));
      
//       // If user doesn't exist, create profile
//       if (!userDoc.exists()) {
//         await setDoc(doc(db, 'users', user.uid), {
//           name: user.displayName,
//           email: user.email,
//           photoURL: user.photoURL,
//           createdAt: serverTimestamp(),
//           lastLogin: serverTimestamp()
//         });
//       } else {
//         // Update last login
//         await setDoc(doc(db, 'users', user.uid), {
//           lastLogin: serverTimestamp()
//         }, { merge: true });
//       }
      
//       // Update local storage and state
//       localStorage.setItem("isAuthenticated", "true");
//       localStorage.setItem("userId", user.uid);
      
//       onLogin();
//       onClose();
      
//       toast.success("Successfully logged in with Facebook!", {
//         position: "bottom-center",
//         autoClose: 2000
//       });
      
//       navigate('/account');
//     } catch (error) {
//       console.error("Error with Facebook login:", error);
//       setError(`Facebook login failed: ${error.message}`);
//       toast.error(`Facebook login failed: ${error.message}`, {
//         position: "bottom-center"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // For demo mode only - remove in production
//   const handleDemoLogin = () => {
//     localStorage.setItem("isAuthenticated", "true");
//     localStorage.setItem("userId", "demo-user");
//     onLogin();
//     onClose();
//     toast.success("Demo login successful!", {
//       position: "bottom-center",
//       autoClose: 2000
//     });
//     navigate('/account');
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="login-modal-overlay">
//       <div className="login-modal" ref={modalRef}>
//         <button className="login-modal-close" onClick={onClose}>
//           <FaTimes />
//         </button>

//         <div className="login-modal-content">
//           <div className="login-header">
//             <h2>{isRegistering ? 'Create an Account' : 'Login to Fresh Deliver'}</h2>
//             <p>
//               {isRegistering 
//                 ? 'Join Fresh Deliver for exclusive deals and easy ordering' 
//                 : 'Get access to your orders, wishlist, and recommendations'}
//             </p>
//           </div>

//           {!isRegistering && (
//             <div className="login-method-selector">
//               <button 
//                 className={`method-tab ${loginMethod === 'phone' ? 'active' : ''}`}
//                 onClick={() => setLoginMethod('phone')}
//               >
//                 <FaMobile />
//                 <span>Phone</span>
//               </button>
//               <button 
//                 className={`method-tab ${loginMethod === 'email' ? 'active' : ''}`}
//                 onClick={() => setLoginMethod('email')}
//               >
//                 <FaEnvelope />
//                 <span>Email</span>
//               </button>
//             </div>
//           )}
          
//           <div className="secure-login">
//             <FaShieldAlt className="secure-icon" />
//             <span>Secure {isRegistering ? 'Registration' : 'Login'}</span>
//           </div>

//           {/* Error message display */}
//           {error && (
//             <div className="error-message">
//               {error}
//             </div>
//           )}

//           {/* Phone Login Section */}
//           {!isRegistering && loginMethod === 'phone' && (
//             <div className="phone-login-section">
//               {!otpSent ? (
//                 <div className="phone-input-container">
//                   <div className="input-wrapper">
//                     <span className="country-code">+91</span>
//                     <input 
//                       type="tel"
//                       placeholder="Enter mobile number"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
//                       maxLength={10}
//                       disabled={loading}
//                     />
//                   </div>
                  
//                   <button 
//                     className="continue-btn"
//                     onClick={sendOtp}
//                     disabled={phone.length !== 10 || loading}
//                   >
//                     {loading ? 'Sending...' : 'Continue'} {!loading && <FaChevronRight />}
//                   </button>
                  
//                   {/* Demo mode button - remove in production */}
//                   <button 
//                     className="demo-login-btn"
//                     onClick={handleDemoLogin}
//                   >
//                     Use Demo Login (Skip OTP)
//                   </button>
//                 </div>
//               ) : (
//                 <div className="otp-verification-container">
//                   <p className="otp-sent-message">
//                     Enter the 6-digit OTP sent to +91 {phone}
//                   </p>
                  
//                   <div className="otp-input-wrapper">
//                     <input 
//                       type="text"
//                       placeholder="Enter 6-digit OTP"
//                       value={otp}
//                       onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
//                       maxLength={6}
//                       className="otp-input"
//                       disabled={loading}
//                     />
//                   </div>
                  
//                   <div className="otp-actions">
//                     {countdown > 0 ? (
//                       <p className="resend-timer">
//                         Resend OTP in {countdown} seconds
//                       </p>
//                     ) : (
//                       <button 
//                         className="resend-otp-btn"
//                         onClick={sendOtp}
//                         disabled={loading}
//                       >
//                         Resend OTP
//                       </button>
//                     )}
                    
//                     <button 
//                       className="verify-otp-btn"
//                       onClick={verifyOtp}
//                       disabled={otp.length !== 6 || loading}
//                     >
//                       {loading ? 'Verifying...' : 'Verify & Login'} {!loading && <FaChevronRight />}
//                     </button>
//                   </div>

//                   <button 
//                     className="back-button" 
//                     onClick={() => {
//                       setOtpSent(false);
//                       setOtp("");
//                     }}
//                     disabled={loading}
//                   >
//                     Change Phone Number
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Email Login Section */}
//           {!isRegistering && loginMethod === 'email' && (
//             <form onSubmit={handleEmailLogin} className="email-login-section">
//               <div className="input-group">
//                 <label>Email Address</label>
//                 <input 
//                   type="email"
//                   placeholder="Enter your email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   disabled={loading}
//                 />
//               </div>
              
//               <div className="input-group">
//                 <label>Password</label>
//                 <div className="password-input">
//                   <input 
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     disabled={loading}
//                   />
//                   <button 
//                     type="button"
//                     className="password-toggle"
//                     onClick={() => setShowPassword(!showPassword)}
//                     disabled={loading}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//               </div>
              
//               <div className="forgot-password">
//                 <button type="button" className="text-button" disabled={loading}>
//                   Forgot Password?
//                 </button>
//               </div>
              
//               <button 
//                 type="submit" 
//                 className="login-submit-btn"
//                 disabled={!email || !password || loading}
//               >
//                 {loading ? 'Logging in...' : 'Login'} {!loading && <FaChevronRight />}
//               </button>
              
//               {/* Demo mode button - remove in production */}
//               <button 
//                 type="button"
//                 className="demo-login-btn"
//                 onClick={handleDemoLogin}
//               >
//                 Use Demo Login
//               </button>
//             </form>
//           )}

//           {/* Registration Form */}
//           {isRegistering && (
//             <form onSubmit={handleEmailRegistration} className="registration-form">
//               <div className="input-group">
//                 <label>Full Name</label>
//                 <div className="input-with-icon">
//                   <FaUser className="input-icon" />
//                   <input 
//                     type="text"
//                     placeholder="Enter your full name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
              
//               <div className="input-group">
//                 <label>Email Address</label>
//                 <div className="input-with-icon">
//                   <FaEnvelope className="input-icon" />
//                   <input 
//                     type="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
              
//               <div className="input-group">
//                 <label>Password</label>
//                 <div className="input-with-icon password-input">
//                   <FaLock className="input-icon" />
//                   <input 
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Create a password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     disabled={loading}
//                   />
//                   <button 
//                     type="button"
//                     className="password-toggle"
//                     onClick={() => setShowPassword(!showPassword)}
//                     disabled={loading}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//               </div>
              
//               <div className="input-group">
//                 <label>Confirm Password</label>
//                 <div className="input-with-icon password-input">
//                   <FaLock className="input-icon" />
//                   <input 
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Confirm your password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
              
//               <button 
//                 type="submit" 
//                 className="register-btn"
//                 disabled={!name || !email || !password || !confirmPassword || loading}
//               >
//                 {loading ? 'Creating Account...' : 'Create Account'} {!loading && <FaChevronRight />}
//               </button>
//             </form>
//           )}

//           {/* Social Login Options */}
//           <div className="social-login">
//             <p className="divider"><span>OR</span></p>
            
//             <div className="social-buttons">
//               <button 
//                 type="button" 
//                 className="google-btn"
//                 onClick={handleGoogleLogin}
//                 disabled={loading}
//               >
//                 <FaGoogle />
//                 <span>{isRegistering ? 'Sign up with Google' : 'Login with Google'}</span>
//               </button>
// {/*               
//               <button 
//                 type="button" 
//                 className="facebook-btn"
//                 onClick={handleFacebookLogin}
//                 disabled={loading}
//               >
//                 <FaFacebook />
//                 <span>{isRegistering ? 'Sign up with Facebook' : 'Login with Facebook'}</span>
//               </button> */}
//             </div>
//           </div>

//           {/* Footer - Switch between Login and Register */}
//           <div className="login-footer">
//             {isRegistering ? (
//               <>
//                 <p>Already have an account?</p>
//                 <button 
//                   className="switch-form-btn"
//                   onClick={() => setIsRegistering(false)}
//                   disabled={loading}
//                 >
//                   Login
//                 </button>
//               </>
//             ) : (
//               <>
//                 <p>New to Fresh Deliver?</p>
//                 <button 
//                   className="switch-form-btn"
//                   onClick={() => setIsRegistering(true)}
//                   disabled={loading}
//                 >
//                   Create an Account
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Invisible reCAPTCHA container for phone auth */}
//       <div id="recaptcha-container"></div>
//     </div>
//   );
// };

// export default Login;
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaTimes, FaSpinner, FaExclamationTriangle, FaMobile, FaUser } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import '../styles/pages/Login.css';

// // No Firebase imports at all for a completely local solution

// const Login = ({ isOpen, onClose, onLogin }) => {
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [name, setName] = useState('');
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [generatedOTP, setGeneratedOTP] = useState(null);

//   const modalRef = useRef(null);
//   const navigate = useNavigate();

//   // Reset countdown timer
//   useEffect(() => {
//     let timer;
//     if (countdown > 0) {
//       timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [countdown]);

//   // Reset state when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       setPhone('');
//       setOtp('');
//       setOtpSent(false);
//       setName('');
//       setIsRegistering(false);
//       setError('');
//       setCountdown(0);
//       setGeneratedOTP(null);
//     }
//   }, [isOpen]);

//   // Click outside to close
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   // Simple OTP generator
//   const generateOTP = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   };

//   // Send OTP function - purely local with no Firebase
//   const sendOtp = () => {
//     if (!/^\d{10}$/.test(phone)) {
//       setError('Please enter a valid 10-digit phone number');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');

//       // Generate a random 6-digit OTP
//       const newOTP = generateOTP();
      
//       // Store in session storage
//       sessionStorage.setItem(`otp_${phone}`, JSON.stringify({
//         otp: newOTP,
//         createdAt: Date.now(),
//         expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes
//       }));
      
//       // Set state for verification
//       setGeneratedOTP(newOTP); 
//       setOtpSent(true);
//       setCountdown(30); // 30 second cooldown before resend
      
//       toast.success(`OTP sent to +91 ${phone}`, {
//         position: 'bottom-center',
//         autoClose: 2000
//       });
//     } catch (error) {
//       console.error('Error generating OTP:', error);
//       setError(`Failed to generate OTP: ${error.message}`);
//       toast.error(`Failed to generate OTP: ${error.message}`, {
//         position: 'bottom-center'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify OTP function - purely local
//   const verifyOtp = () => {
//     if (!/^\d{6}$/.test(otp)) {
//       setError('Please enter a valid 6-digit OTP');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
      
//       // Get the stored OTP data
//       const storedOTPData = sessionStorage.getItem(`otp_${phone}`);
      
//       if (!storedOTPData) {
//         throw new Error('OTP not found. Please request a new one.');
//       }
      
//       const otpData = JSON.parse(storedOTPData);
      
//       // Check if OTP is expired
//       if (otpData.expiresAt < Date.now()) {
//         sessionStorage.removeItem(`otp_${phone}`);
//         throw new Error('OTP expired. Please request a new one.');
//       }
      
//       // Check if OTP matches
//       if (otpData.otp !== otp) {
//         throw new Error('Invalid OTP. Please check and try again.');
//       }
      
//       // Remove the OTP after successful verification
//       sessionStorage.removeItem(`otp_${phone}`);
      
//       // Store the authenticated user in local storage
//       const userData = {
//         phoneNumber: `+91${phone}`,
//         name: name || 'User',
//         lastLogin: Date.now()
//       };
      
//       // Add createdAt if registering
//       if (isRegistering) {
//         userData.createdAt = Date.now();
//       }
      
//       // Store user data and authentication state
//       localStorage.setItem(`user_${phone}`, JSON.stringify(userData));
//       localStorage.setItem('isAuthenticated', 'true');
//       localStorage.setItem('userId', phone);
      
//       // Complete login process
//       onLogin();
//       onClose();
      
//       toast.success('Successfully logged in!', {
//         position: 'bottom-center',
//         autoClose: 2000
//       });
      
//       navigate('/account');
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       setError(error.message);
//       toast.error(error.message, {
//         position: 'bottom-center'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle registration with phone
//   const handleRegisterWithPhone = () => {
//     if (isRegistering && !name) {
//       setError('Please enter your name');
//       return;
//     }

//     if (!otpSent) {
//       sendOtp();
//     } else {
//       verifyOtp();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="login-modal-overlay">
//       <div className="login-modal" ref={modalRef}>
//         <button className="login-modal-close" onClick={onClose} disabled={loading}>
//           <FaTimes />
//         </button>

//         <div className="login-modal-content">
//           <div className="login-header">
//             <h2>{isRegistering ? 'Create an Account' : 'Login to ZappCart'}</h2>
//             <p>
//               {isRegistering
//                 ? 'Create your account to get started with ZappCart'
//                 : 'Get access to your orders, wishlist, and recommendations'}
//             </p>
//           </div>

//           {error && (
//             <div className="error-message">
//               <FaExclamationTriangle />
//               <span>{error}</span>
//             </div>
//           )}

//           <div className="phone-login-section">
//             {isRegistering && (
//               <div className="input-group">
//                 <label>Your Name</label>
//                 <div className="input-with-icon">
//                   <FaUser className="input-icon" />
//                   <input
//                     type="text"
//                     placeholder="Enter your full name"
//                     value={name}
//                     onChange={(e) => {
//                       setName(e.target.value);
//                       if (error && e.target.value) setError('');
//                     }}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>
//             )}

//             {!otpSent ? (
//               <div className="phone-input-container">
//                 <div className="input-group">
//                   <label>Phone Number</label>
//                   <div className="input-wrapper">
//                     <span className="country-code">+91</span>
//                     <input
//                       type="tel"
//                       placeholder="Enter your 10-digit number"
//                       value={phone}
//                       onChange={(e) => {
//                         const value = e.target.value.replace(/\D/g, '');
//                         setPhone(value.substring(0, 10));
//                         if (error && value.length === 10) setError('');
//                       }}
//                       maxLength={10}
//                       disabled={loading}
//                     />
//                   </div>
//                 </div>

//                 <button
//                   className="continue-btn"
//                   onClick={isRegistering ? handleRegisterWithPhone : sendOtp}
//                   disabled={phone.length !== 10 || loading}
//                 >
//                   {loading ? (
//                     <>
//                       <FaSpinner className="spinner" />
//                       <span>Sending OTP...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span>Continue</span>
//                       <FaMobile />
//                     </>
//                   )}
//                 </button>
//               </div>
//             ) : (
//               <div className="otp-verification-container">
//                 <p className="otp-sent-message">
//                   Enter the 6-digit OTP sent to +91 {phone}
//                 </p>

//                 {/* DEVELOPMENT MODE OTP DISPLAY */}
//                 {generatedOTP && (
//                   <div style={{ 
//                     backgroundColor: '#e8f4fe', 
//                     padding: '12px', 
//                     borderRadius: '8px',
//                     marginBottom: '15px',
//                     border: '1px dashed #4a90e2',
//                     textAlign: 'center'
//                   }}>
//                     <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#0056b3' }}>
//                       DEVELOPMENT MODE
//                     </p>
//                     <p style={{ margin: '0 0 5px 0' }}>
//                       Your OTP is:
//                     </p>
//                     <div style={{
//                       fontWeight: 'bold',
//                       fontSize: '24px',
//                       color: '#0056b3',
//                       letterSpacing: '8px',
//                       padding: '5px 0',
//                       backgroundColor: '#f8f9fa',
//                       borderRadius: '4px',
//                       border: '1px solid #dee2e6',
//                       marginBottom: '10px'
//                     }}>
//                       {generatedOTP}
//                     </div>
//                     <p style={{ margin: '0', fontSize: '12px', color: '#555' }}>
//                       (In production, this would be sent via SMS)
//                     </p>
//                   </div>
//                 )}

//                 <div className="otp-input-wrapper">
//                   <input
//                     type="text"
//                     placeholder="Enter 6-digit OTP"
//                     value={otp}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, '');
//                       setOtp(value.substring(0, 6));
//                       if (error && value.length === 6) setError('');
//                     }}
//                     maxLength={6}
//                     className="otp-input"
//                     disabled={loading}
//                   />
//                 </div>

//                 <div className="otp-actions">
//                   {countdown > 0 ? (
//                     <p className="resend-timer">
//                       Resend OTP in {countdown} seconds
//                     </p>
//                   ) : (
//                     <button
//                       className="resend-otp-btn"
//                       onClick={sendOtp}
//                       disabled={loading}
//                     >
//                       Resend OTP
//                     </button>
//                   )}

//                   <button
//                     className="verify-otp-btn"
//                     onClick={isRegistering ? handleRegisterWithPhone : verifyOtp}
//                     disabled={otp.length !== 6 || loading}
//                   >
//                     {loading ? (
//                       <>
//                         <FaSpinner className="spinner" />
//                         <span>Verifying...</span>
//                       </>
//                     ) : (
//                       <>
//                         <span>{isRegistering ? 'Create Account' : 'Verify & Login'}</span>
//                         <FaMobile />
//                       </>
//                     )}
//                   </button>
//                 </div>

//                 <button
//                   className="back-button"
//                   onClick={() => {
//                     setOtpSent(false);
//                     setOtp('');
//                     setGeneratedOTP(null);
//                   }}
//                   disabled={loading}
//                 >
//                   Change Phone Number
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="login-footer">
//             {isRegistering ? (
//               <>
//                 <p>Already have an account?</p>
//                 <button
//                   className="switch-form-btn"
//                   onClick={() => {
//                     setIsRegistering(false);
//                     setOtpSent(false);
//                     setOtp('');
//                     setGeneratedOTP(null);
//                   }}
//                   disabled={loading}
//                 >
//                   Login
//                 </button>
//               </>
//             ) : (
//               <>
//                 <p>New to ZappCart?</p>
//                 <button
//                   className="switch-form-btn"
//                   onClick={() => {
//                     setIsRegistering(true);
//                     setOtpSent(false);
//                     setOtp('');
//                     setGeneratedOTP(null);
//                   }}
//                   disabled={loading}
//                 >
//                   Create an Account
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaTimes, FaSpinner, FaExclamationTriangle, FaMobile, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import '../styles/pages/Login.css';
// import { auth } from '../firebase/config';
// import { 
//   signInWithEmailAndPassword, 
//   createUserWithEmailAndPassword, 
//   PhoneAuthProvider,
//   RecaptchaVerifier,
//   signInWithPhoneNumber, 
//   updateProfile
// } from 'firebase/auth';

// const Login = ({ isOpen, onClose, onLogin }) => {
//   // Email/password auth states
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
  
//   // Phone auth states
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [confirmationResult, setConfirmationResult] = useState(null);
  
//   // Shared states
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [name, setName] = useState('');
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'

//   const modalRef = useRef(null);
//   const recaptchaVerifierRef = useRef(null);
//   const navigate = useNavigate();

//   // Reset countdown timer
//   useEffect(() => {
//     let timer;
//     if (countdown > 0) {
//       timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [countdown]);

//   // Reset state when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       resetForm();
//     }
//   }, [isOpen]);

//   // Setup recaptcha when modal opens
//   useEffect(() => {
//     if (isOpen && authMethod === 'phone' && !recaptchaVerifierRef.current) {
//       recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
//         'size': 'invisible',
//         'callback': () => {
//           // reCAPTCHA solved, allow sending OTP
//         }
//       });
//     }

//     return () => {
//       if (recaptchaVerifierRef.current) {
//         recaptchaVerifierRef.current.clear();
//         recaptchaVerifierRef.current = null;
//       }
//     };
//   }, [isOpen, authMethod]);

//   // Click outside to close
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   const resetForm = () => {
//     setEmail('');
//     setPassword('');
//     setPhone('');
//     setOtp('');
//     setOtpSent(false);
//     setName('');
//     setIsRegistering(false);
//     setError('');
//     setCountdown(0);
//     setConfirmationResult(null);
//     setAuthMethod('email');
//   };

//   // Email/Password Authentication
//   const handleEmailLogin = async () => {
//     if (!email || !password) {
//       setError('Please enter both email and password');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       handleLoginSuccess(userCredential.user);
//     } catch (error) {
//       handleAuthError(error);
//     }
//   };

//   const handleEmailRegister = async () => {
//     if (!email || !password || !name) {
//       setError('Please enter your name, email, and password');
//       return;
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
//       // Update profile with name
//       await updateProfile(userCredential.user, {
//         displayName: name
//       });

//       handleLoginSuccess(userCredential.user);
//     } catch (error) {
//       handleAuthError(error);
//     }
//   };

//   // Phone Authentication
//   const sendOtp = async () => {
//     if (!/^\d{10}$/.test(phone)) {
//       setError('Please enter a valid 10-digit phone number');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const phoneNumber = `+91${phone}`;
//       const appVerifier = recaptchaVerifierRef.current;
      
//       const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
//       setConfirmationResult(confirmation);
//       setOtpSent(true);
//       setCountdown(30); // 30 second cooldown before resend
      
//       toast.success(`OTP sent to +91 ${phone}`, {
//         position: 'bottom-center',
//         autoClose: 2000
//       });
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       handleAuthError(error);
      
//       // Reset recaptcha on error
//       if (recaptchaVerifierRef.current) {
//         recaptchaVerifierRef.current.clear();
//         recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
//           'size': 'invisible'
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOtp = async () => {
//     if (!/^\d{6}$/.test(otp)) {
//       setError('Please enter a valid 6-digit OTP');
//       return;
//     }

//     if (!confirmationResult) {
//       setError('Session expired. Please request OTP again.');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const result = await confirmationResult.confirm(otp);
      
//       // If registering, update the user profile with name
//       if (isRegistering && name) {
//         await updateProfile(result.user, {
//           displayName: name
//         });
//       }
      
//       handleLoginSuccess(result.user);
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       handleAuthError(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Common functions
//   const handleLoginSuccess = (user) => {
//     setLoading(false);
//     onLogin(user);
//     onClose();
    
//     toast.success('Successfully logged in!', {
//       position: 'bottom-center',
//       autoClose: 2000
//     });
    
//     navigate('/account');
//   };

//   const handleAuthError = (error) => {
//     setLoading(false);
    
//     const errorCode = error.code;
//     let errorMessage = 'An error occurred. Please try again.';
    
//     // Map Firebase error codes to user-friendly messages
//     if (errorCode === 'auth/invalid-email') {
//       errorMessage = 'Invalid email address.';
//     } else if (errorCode === 'auth/user-disabled') {
//       errorMessage = 'This account has been disabled.';
//     } else if (errorCode === 'auth/user-not-found') {
//       errorMessage = 'No account found with this email.';
//     } else if (errorCode === 'auth/wrong-password') {
//       errorMessage = 'Incorrect password.';
//     } else if (errorCode === 'auth/email-already-in-use') {
//       errorMessage = 'This email is already in use.';
//     } else if (errorCode === 'auth/weak-password') {
//       errorMessage = 'Password should be at least 6 characters.';
//     } else if (errorCode === 'auth/invalid-verification-code') {
//       errorMessage = 'Invalid OTP. Please try again.';
//     } else if (errorCode === 'auth/code-expired') {
//       errorMessage = 'OTP expired. Please request a new one.';
//     } else if (errorCode === 'auth/invalid-phone-number') {
//       errorMessage = 'Invalid phone number format.';
//     } else if (errorCode === 'auth/too-many-requests') {
//       errorMessage = 'Too many attempts. Please try again later.';
//     } else if (error.message) {
//       errorMessage = error.message;
//     }
    
//     setError(errorMessage);
    
//     toast.error(errorMessage, {
//       position: 'bottom-center'
//     });
//   };

//   const switchAuthMethod = () => {
//     setAuthMethod(authMethod === 'email' ? 'phone' : 'email');
//     setError('');
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="login-modal-overlay">
//       <div className="login-modal" ref={modalRef}>
//         <button className="login-modal-close" onClick={onClose} disabled={loading}>
//           <FaTimes />
//         </button>

//         <div className="login-modal-content">
//           <div id="recaptcha-container"></div>
          
//           <div className="login-container">
//             <div className="auth-banner">
//               <div className="auth-banner-content">
//                 <h1>ZappCart</h1>
//                 <p>Your one-stop solution for fresh groceries, delivered in minutes.</p>
//                 <div className="auth-features">
//                   <div className="auth-feature">
//                     <FaUser size={20} />
//                     <span>Personalized Recommendations</span>
//                   </div>
//                   <div className="auth-feature">
//                     <FaMobile size={20} />
//                     <span>Express Delivery</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="auth-form-container">
//               <div className="auth-form">
//                 <h2>{isRegistering ? 'Create an Account' : 'Welcome Back'}</h2>
//                 <p>{isRegistering 
//                   ? 'Sign up to start your shopping journey' 
//                   : 'Sign in to continue your shopping experience'}</p>
                
//                 {error && (
//                   <div className="error-message">
//                     <FaExclamationTriangle />
//                     <span>{error}</span>
//                   </div>
//                 )}
                
//                 <div className="auth-methods">
//                   <button 
//                     className={`auth-method-btn ${authMethod === 'email' ? 'active' : ''}`}
//                     onClick={() => setAuthMethod('email')}
//                   >
//                     <FaEnvelope />
//                     <span>Email</span>
//                   </button>
//                   <button 
//                     className={`auth-method-btn ${authMethod === 'phone' ? 'active' : ''}`}
//                     onClick={() => setAuthMethod('phone')}
//                   >
//                     <FaMobile />
//                     <span>Phone</span>
//                   </button>
//                 </div>
                
//                 {authMethod === 'email' ? (
//                   // Email Authentication Form
//                   <form onSubmit={(e) => {
//                     e.preventDefault();
//                     isRegistering ? handleEmailRegister() : handleEmailLogin();
//                   }}>
//                     {isRegistering && (
//                       <div className="form-group">
//                         <label htmlFor="name">Full Name</label>
//                         <div className="input-with-icon">
//                           <FaUser className="input-icon" />
//                           <input
//                             type="text"
//                             id="name"
//                             placeholder="Enter your full name"
//                             value={name}
//                             onChange={(e) => {
//                               setName(e.target.value);
//                               if (error && e.target.value) setError('');
//                             }}
//                             disabled={loading}
//                           />
//                         </div>
//                       </div>
//                     )}
                    
//                     <div className="form-group">
//                       <label htmlFor="email">Email Address</label>
//                       <div className="input-with-icon">
//                         <FaEnvelope className="input-icon" />
//                         <input
//                           type="email"
//                           id="email"
//                           placeholder="you@example.com"
//                           value={email}
//                           onChange={(e) => {
//                             setEmail(e.target.value);
//                             if (error) setError('');
//                           }}
//                           disabled={loading}
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="form-group">
//                       <label htmlFor="password">Password</label>
//                       <div className="input-with-icon">
//                         <FaLock className="input-icon" />
//                         <input
//                           type="password"
//                           id="password"
//                           placeholder="Enter your password"
//                           value={password}
//                           onChange={(e) => {
//                             setPassword(e.target.value);
//                             if (error) setError('');
//                           }}
//                           disabled={loading}
//                         />
//                       </div>
//                     </div>
                    
//                     <button 
//                       type="submit" 
//                       className="login-btn"
//                       disabled={loading}
//                     >
//                       {loading ? (
//                         <>
//                           <FaSpinner className="spinner" />
//                           <span>{isRegistering ? 'Creating Account...' : 'Signing in...'}</span>
//                         </>
//                       ) : (
//                         <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
//                       )}
//                     </button>
//                   </form>
//                 ) : (
//                   // Phone Authentication Form
//                   <div className="phone-login-section">
//                     {isRegistering && (
//                       <div className="form-group">
//                         <label htmlFor="name">Full Name</label>
//                         <div className="input-with-icon">
//                           <FaUser className="input-icon" />
//                           <input
//                             type="text"
//                             id="name"
//                             placeholder="Enter your full name"
//                             value={name}
//                             onChange={(e) => {
//                               setName(e.target.value);
//                               if (error && e.target.value) setError('');
//                             }}
//                             disabled={loading}
//                           />
//                         </div>
//                       </div>
//                     )}
                    
//                     {!otpSent ? (
//                       <div className="phone-input-container">
//                         <div className="form-group">
//                           <label>Phone Number</label>
//                           <div className="input-wrapper">
//                             <span className="country-code">+91</span>
//                             <input
//                               type="tel"
//                               placeholder="Enter your 10-digit number"
//                               value={phone}
//                               onChange={(e) => {
//                                 const value = e.target.value.replace(/\D/g, '');
//                                 setPhone(value.substring(0, 10));
//                                 if (error && value.length === 10) setError('');
//                               }}
//                               maxLength={10}
//                               disabled={loading}
//                             />
//                           </div>
//                         </div>
                        
//                         <button
//                           className="login-btn"
//                           onClick={sendOtp}
//                           disabled={phone.length !== 10 || loading}
//                         >
//                           {loading ? (
//                             <>
//                               <FaSpinner className="spinner" />
//                               <span>Sending OTP...</span>
//                             </>
//                           ) : (
//                             <>
//                               <span>Continue</span>
//                               <FaMobile />
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="otp-verification-container">
//                         <p className="otp-sent-message">
//                           Enter the 6-digit OTP sent to +91 {phone}
//                         </p>
                        
//                         <div className="otp-input-wrapper">
//                           <input
//                             type="text"
//                             placeholder="Enter 6-digit OTP"
//                             value={otp}
//                             onChange={(e) => {
//                               const value = e.target.value.replace(/\D/g, '');
//                               setOtp(value.substring(0, 6));
//                               if (error && value.length === 6) setError('');
//                             }}
//                             maxLength={6}
//                             className="otp-input"
//                             disabled={loading}
//                           />
//                         </div>
                        
//                         <div className="otp-actions">
//                           {countdown > 0 ? (
//                             <p className="resend-timer">
//                               Resend OTP in {countdown} seconds
//                             </p>
//                           ) : (
//                             <button
//                               className="resend-otp-btn"
//                               onClick={sendOtp}
//                               disabled={loading}
//                             >
//                               Resend OTP
//                             </button>
//                           )}
                          
//                           <button
//                             className="verify-otp-btn"
//                             onClick={verifyOtp}
//                             disabled={otp.length !== 6 || loading}
//                           >
//                             {loading ? (
//                               <>
//                                 <FaSpinner className="spinner" />
//                                 <span>Verifying...</span>
//                               </>
//                             ) : (
//                               <>
//                                 <span>{isRegistering ? 'Create Account' : 'Verify & Login'}</span>
//                                 <FaMobile />
//                               </>
//                             )}
//                           </button>
//                         </div>
                        
//                         <button
//                           className="back-button"
//                           onClick={() => {
//                             setOtpSent(false);
//                             setOtp('');
//                             setConfirmationResult(null);
//                           }}
//                           disabled={loading}
//                         >
//                           Change Phone Number
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
                
//                 <div className="login-footer">
//                   {isRegistering ? (
//                     <>
//                       <p>Already have an account?</p>
//                       <button
//                         className="switch-form-btn"
//                         onClick={() => {
//                           setIsRegistering(false);
//                           setOtpSent(false);
//                           setOtp('');
//                         }}
//                         disabled={loading}
//                       >
//                         Login
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <p>New to ZappCart?</p>
//                       <button
//                         className="switch-form-btn"
//                         onClick={() => {
//                           setIsRegistering(true);
//                           setOtpSent(false);
//                           setOtp('');
//                         }}
//                         disabled={loading}
//                       >
//                         Create an Account
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaTimes, FaSpinner, FaExclamationTriangle, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import '../styles/pages/Login.css';
// import { auth } from '../firebase/config';
// import { 
//   signInWithEmailAndPassword, 
//   createUserWithEmailAndPassword, 
//   updateProfile
// } from 'firebase/auth';

// const Login = ({ isOpen, onClose, onLogin }) => {
//   // Email/password auth states
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
  
//   // Shared states
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [name, setName] = useState('');
//   const [isRegistering, setIsRegistering] = useState(false);

//   const modalRef = useRef(null);
//   const navigate = useNavigate();

//   // Reset state when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       resetForm();
//     }
//   }, [isOpen]);

//   // Click outside to close
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   const resetForm = () => {
//     setEmail('');
//     setPassword('');
//     setName('');
//     setIsRegistering(false);
//     setError('');
//   };

//   // Email/Password Authentication
//   const handleEmailLogin = async () => {
//     if (!email || !password) {
//       setError('Please enter both email and password');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       handleLoginSuccess(userCredential.user, false);
//     } catch (error) {
//       handleAuthError(error);
//     }
//   };

//   const handleEmailRegister = async () => {
//     if (!email || !password || !name) {
//       setError('Please enter your name, email, and password');
//       return;
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
//       // Update profile with name
//       await updateProfile(userCredential.user, {
//         displayName: name
//       });

//       handleLoginSuccess(userCredential.user, true);
//     } catch (error) {
//       handleAuthError(error);
//     }
//   };

//   // Common functions
//   const handleLoginSuccess = (user, isNewAccount) => {
//     setLoading(false);
//     onLogin(user);
//     onClose();
    
//     // Show different success messages based on whether the user is registering or logging in
//     if (isNewAccount) {
//       toast.success('Your account has been created successfully!', {
//         position: 'bottom-center',
//         autoClose: 3000
//       });
//     } else {
//       toast.success('Successfully logged in!', {
//         position: 'bottom-center',
//         autoClose: 2000
//       });
//     }
    
//     // Navigate to the homepage
//     navigate('/');
//   };

//   const handleAuthError = (error) => {
//     setLoading(false);
    
//     const errorCode = error.code;
//     let errorMessage = 'An error occurred. Please try again.';
    
//     // Map Firebase error codes to user-friendly messages
//     if (errorCode === 'auth/invalid-email') {
//       errorMessage = 'Invalid email address.';
//     } else if (errorCode === 'auth/user-disabled') {
//       errorMessage = 'This account has been disabled.';
//     } else if (errorCode === 'auth/user-not-found') {
//       errorMessage = 'No account found with this email.';
//     } else if (errorCode === 'auth/wrong-password') {
//       errorMessage = 'Incorrect password.';
//     } else if (errorCode === 'auth/email-already-in-use') {
//       errorMessage = 'This email is already in use.';
//     } else if (errorCode === 'auth/weak-password') {
//       errorMessage = 'Password should be at least 6 characters.';
//     } else if (error.message) {
//       errorMessage = error.message;
//     }
    
//     setError(errorMessage);
    
//     toast.error(errorMessage, {
//       position: 'bottom-center'
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="login-modal-overlay">
//       <div className="login-modal" ref={modalRef}>
//         <button className="login-modal-close" onClick={onClose} disabled={loading}>
//           <FaTimes />
//         </button>

//         <div className="login-modal-content">
//           <div className="login-container">
//             <div className="auth-banner">
//               <div className="auth-banner-content">
//                 <h1>ZappCart</h1>
//                 <p>Your one-stop solution for fresh groceries, delivered in minutes.</p>
//                 <div className="auth-features">
//                   <div className="auth-feature">
//                     <FaUser size={20} />
//                     <span>Personalized Recommendations</span>
//                   </div>
//                   <div className="auth-feature">
//                     <FaEnvelope size={20} />
//                     <span>Order Updates via Email</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="auth-form-container">
//               <div className="auth-form">
//                 <h2>{isRegistering ? 'Create an Account' : 'Welcome Back'}</h2>
//                 <p>{isRegistering 
//                   ? 'Sign up to start your shopping journey' 
//                   : 'Sign in to continue your shopping experience'}</p>
                
//                 {error && (
//                   <div className="error-message">
//                     <FaExclamationTriangle />
//                     <span>{error}</span>
//                   </div>
//                 )}
                
//                 <form onSubmit={(e) => {
//                   e.preventDefault();
//                   isRegistering ? handleEmailRegister() : handleEmailLogin();
//                 }}>
//                   {isRegistering && (
//                     <div className="form-group">
//                       <label htmlFor="name">Full Name</label>
//                       <div className="input-with-icon">
//                         <FaUser className="input-icon" />
//                         <input
//                           type="text"
//                           id="name"
//                           placeholder="Enter your full name"
//                           value={name}
//                           onChange={(e) => {
//                             setName(e.target.value);
//                             if (error && e.target.value) setError('');
//                           }}
//                           disabled={loading}
//                         />
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="form-group">
//                     <label htmlFor="email">Email Address</label>
//                     <div className="input-with-icon">
//                       <FaEnvelope className="input-icon" />
//                       <input
//                         type="email"
//                         id="email"
//                         placeholder="you@example.com"
//                         value={email}
//                         onChange={(e) => {
//                           setEmail(e.target.value);
//                           if (error) setError('');
//                         }}
//                         disabled={loading}
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="form-group">
//                     <label htmlFor="password">Password</label>
//                     <div className="input-with-icon">
//                       <FaLock className="input-icon" />
//                       <input
//                         type="password"
//                         id="password"
//                         placeholder="Enter your password"
//                         value={password}
//                         onChange={(e) => {
//                           setPassword(e.target.value);
//                           if (error) setError('');
//                         }}
//                         disabled={loading}
//                       />
//                     </div>
//                   </div>
                  
//                   <button 
//                     type="submit" 
//                     className="login-btn"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <FaSpinner className="spinner" />
//                         <span>{isRegistering ? 'Creating Account...' : 'Signing in...'}</span>
//                       </>
//                     ) : (
//                       <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
//                     )}
//                   </button>
//                 </form>
                
//                 <div className="login-footer">
//                   {isRegistering ? (
//                     <>
//                       <p>Already have an account?</p>
//                       <button
//                         className="switch-form-btn"
//                         onClick={() => setIsRegistering(false)}
//                         disabled={loading}
//                       >
//                         Login
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <p>New to ZappCart?</p>
//                       <button
//                         className="switch-form-btn"
//                         onClick={() => setIsRegistering(true)}
//                         disabled={loading}
//                       >
//                         Create an Account
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaSpinner, FaExclamationTriangle, FaUser, FaEnvelope, FaLock, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/pages/Login.css';
import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const Login = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const modalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setIsRegistering(false);
    setError('');
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      handleLoginSuccess(userCredential.user, false);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleEmailRegister = async () => {
    if (!email || !password || !name) {
      setError('Please enter your name, email, and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: name
      });

      handleLoginSuccess(userCredential.user, true);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setCurrentUser(null);
      toast.success('Successfully logged out!', {
        position: 'bottom-center',
        autoClose: 2000
      });
      navigate('/');
      onClose();
    } catch (error) {
      setError('Failed to log out. Please try again.');
      toast.error('Failed to log out. Please try again.', {
        position: 'bottom-center'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (user, isNewAccount) => {
    setLoading(false);
    onLogin(user);
    onClose();
    
    if (isNewAccount) {
      toast.success('Your account has been created successfully!', {
        position: 'bottom-center',
        autoClose: 3000
      });
    } else {
      toast.success('Successfully logged in!', {
        position: 'bottom-center',
        autoClose: 2000
      });
    }
    
    navigate('/');
  };

  const handleAuthError = (error) => {
    setLoading(false);
    
    const errorCode = error.code;
    let errorMessage = 'An error occurred. Please try again.';
    
    if (errorCode === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (errorCode === 'auth/user-disabled') {
      errorMessage = 'This account has been disabled.';
    } else if (errorCode === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    } else if (errorCode === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.';
    } else if (errorCode === 'auth/email-already-in-use') {
      errorMessage = 'This email is already in use.';
    } else if (errorCode === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    setError(errorMessage);
    
    toast.error(errorMessage, {
      position: 'bottom-center'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal" ref={modalRef}>
        <button className="login-modal-close" onClick={onClose} disabled={loading}>
          <FaTimes />
        </button>

        <div className="login-modal-content">
          <div className="login-container">
            <div className="auth-banner">
              <div className="auth-banner-content">
                <h1>ZappCart</h1>
                <p>Your one-stop solution for fresh Meat, delivered in minutes.</p>
                <div className="auth-features">
                  <div className="auth-feature">
                    <FaUser size={20} />
                    <span>Personalized Recommendations</span>
                  </div>
                  <div className="auth-feature">
                    <FaEnvelope size={20} />
                    <span>Order Updates via Email</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="auth-form-container">
              <div className="auth-form">
                {isLoggedIn ? (
                  <>
                    <h2>Welcome, {currentUser?.displayName || 'User'}</h2>
                    <p>You are currently logged in.</p>
                    <div className="user-details">
                      <p><strong>Name:</strong> {currentUser?.displayName || 'Not set'}</p>
                      <p><strong>Email:</strong> {currentUser?.email || 'Not set'}</p>
                    </div>
                    <button
                      className="login-btn logout-btn"
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="spinner" />
                          <span>Logging out...</span>
                        </>
                      ) : (
                        <>
                          <FaSignOutAlt />
                          <span>Log Out</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <h2>{isRegistering ? 'Create an Account' : 'Welcome Back'}</h2>
                    <p>{isRegistering 
                      ? 'Sign up to start your shopping journey' 
                      : 'Sign in to continue your shopping experience'}</p>
                    
                    {error && (
                      <div className="error-message">
                        <FaExclamationTriangle />
                        <span>{error}</span>
                      </div>
                    )}
                    
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      isRegistering ? handleEmailRegister() : handleEmailLogin();
                    }}>
                      {isRegistering && (
                        <div className="form-group">
                          <label htmlFor="name">Full Name</label>
                          <div className="input-with-icon">
                            <FaUser className="input-icon" />
                            <input
                              type="text"
                              id="name"
                              placeholder="Enter your full name"
                              value={name}
                              onChange={(e) => {
                                setName(e.target.value);
                                if (error && e.target.value) setError('');
                              }}
                              disabled={loading}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-with-icon">
                          <FaEnvelope className="input-icon" />
                          <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (error) setError('');
                            }}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                          <FaLock className="input-icon" />
                          <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (error) setError('');
                            }}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      
                      <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <FaSpinner className="spinner" />
                            <span>{isRegistering ? 'Creating Account...' : 'Signing in...'}</span>
                          </>
                        ) : (
                          <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                        )}
                      </button>
                    </form>
                    
                    <div className="login-footer">
                      {isRegistering ? (
                        <>
                          <p>Already have an account?</p>
                          <button
                            className="switch-form-btn"
                            onClick={() => setIsRegistering(false)}
                            disabled={loading}
                          >
                            Login
                          </button>
                        </>
                      ) : (
                        <>
                          <p>New to ZappCart?</p>
                          <button
                            className="switch-form-btn"
                            onClick={() => setIsRegistering(true)}
                            disabled={loading}
                          >
                            Create an Account
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;