// // src/App.js
// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// // Context Providers
// import { CartProvider } from './context/CartContext';
// import { AuthProvider, useAuth } from './context/AuthContext';

// // Main Pages
// import Home from './pages/Home';
// import ProductDetail from './pages/ProductDetail';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';
// import OrderConfirmation from './pages/OrderConfirmation';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import ForgotPassword from './pages/ForgotPassword';
// import Profile from './pages/Profile';
// import CategoryPage from './pages/CategoryPage';
// import CategoryProductsPage from './pages/CategoryProductsPage';

// // Admin Pages
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AddProduct from './pages/admin/AddProduct';
// import EditProduct from './pages/admin/EditProduct';
// import AddCategory from './pages/admin/AddCategory';
// import EditCategory from './pages/admin/EditCategory';
// import OrderDetail from './pages/admin/OrderDetail';
// import CustomerDetail from './pages/admin/CustomerDetail';

// // Components
// import Header from './components/Header';
// import Footer from './components/Footer';
// import ProtectedRoute from './components/ProtectedRoute';

// // Styles
// import './styles/global.css';

// // ScrollToTop component to scroll to top on route change
// const ScrollToTop = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// };

// // App routes component (used inside AuthProvider)
// const AppRoutes = () => {
//   const { currentUser, userProfile, loading } = useAuth();
//   const location = useLocation();

//   // Check if current route is admin route
//   const isAdminRoute = location.pathname.startsWith('/admin');

//   // Check if user is admin
//   const isAdmin = userProfile?.isAdmin || false;

//   if (loading) {
//     return (
//       <div className="app-loading">
//         <div className="loading-spinner"></div>
//         <p>Loading...</p>
//       </div>
//     );
//   }

//   return (
//     <CartProvider>
//       <ScrollToTop />
//       <div className="app">
//         {/* Don't show header on admin pages */}
//         {!isAdminRoute && <Header />}

//         <main className={isAdminRoute ? 'admin-main' : ''}>
//         <Routes>
//   {/* Public Routes */}
//   <Route path="/" element={<Home />} />
//   <Route path="/product/:id" element={<ProductDetail />} />
//   <Route path="/cart" element={<Cart />} />
//   <Route path="/login" element={<Login />} />
//   <Route path="/register" element={<Register />} />
//   <Route path="/forgot-password" element={<ForgotPassword />} />

//   {/* Category Routes */}
//   <Route path="/categories" element={<CategoryPage />} />
//   <Route path="/category/:categoryId" element={<CategoryProductsPage />} />

//   {/* Protected Routes (require authentication) */}
//   <Route 
//     path="/checkout" 
//     element={
//       <ProtectedRoute>
//         <Checkout />
//       </ProtectedRoute>
//     } 
//   />
//   <Route 
//     path="/order-confirmation" 
//     element={
//       <ProtectedRoute>
//         <OrderConfirmation />
//       </ProtectedRoute>
//     } 
//   />
//   <Route 
//     path="/profile" 
//     element={
//       <ProtectedRoute>
//         <Profile />
//       </ProtectedRoute>
//     } 
//   />

//   {/* Admin Routes (require admin role) */}
//   <Route 
//     path="/admin" 
//     element={
//       <ProtectedRoute isAdmin={true}>
//         <AdminDashboard />
//       </ProtectedRoute>
//     } 
//   />
//   <Route 
//     path="/admin/add-product" 
//     element={
//       <ProtectedRoute isAdmin={true}>
//         <AddProduct />
//       </ProtectedRoute>
//     } 
//   />
//   <Route 
//     path="/admin/edit-product/:id" 
//     element={
//       <ProtectedRoute isAdmin={true}>
//         <EditProduct />
//       </ProtectedRoute>
//     } 
//   />
//   <Route 
//     path="/admin/add-category" 
//     element={
//       <ProtectedRoute isAdmin={true}>
//         <AddCategory />
//       </ProtectedRoute>
//     } 
//   />
//   <Route 
//     path="/admin/edit-category/:id" 
//     element={
//       <ProtectedRoute isAdmin={true}>
//         <EditCategory />
//       </ProtectedRoute>
//     } 
//   />
//   <Route 
//     path="/admin/orders/:id" 
//     element={
//       <ProtectedRoute isAdmin={true}>
//         <OrderDetail />
//       </ProtectedRoute>
//     } 
//   />
//   <Route 
//     path="/admin/customers/:id" 
//     element={
//       <ProtectedRoute isAdmin={true}>
//         <CustomerDetail />
//       </ProtectedRoute>
//     } 
//   />

//   {/* Fallback route for 404 */}
//   <Route path="*" element={
//     <div className="not-found">
//       <h1>404 - Page Not Found</h1>
//       <p>The page you are looking for does not exist.</p>
//     </div>
//   } />
// </Routes>

//         </main>

//         {/* Don't show footer on admin pages */}
//         {!isAdminRoute && <Footer />}
//       </div>
//     </CartProvider>
//   );
// };

// // Main App component
// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <AppRoutes />
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;

// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Context Providers
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Main Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import CategoryPage from './pages/CategoryPage';
import CategoryProductsPage from './pages/CategoryProductsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import AddCategory from './pages/admin/AddCategory';
import EditCategory from './pages/admin/EditCategory';
import OrderDetail from './pages/admin/OrderDetail';
import CustomerDetail from './pages/admin/CustomerDetail';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import WhatWeStandFor from './components/WhatWeStandFor';
import Blog from './components/Blog';
import WhyChooseZappCart from './components/WhyChooseZappCart';
import Support from './components/Support';
import Newsroom from './components/Newsroom';
import Contact from './components/Contact';
import PaymentSuccess from './components/PaymentSuccess';
import PaymentFailure from './components/PaymentFailure';
// Styles
import './styles/global.css';

// ScrollToTop component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// App routes component (used inside AuthProvider)
const AppRoutes = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Check if user is admin
  const isAdmin = userProfile?.isAdmin || false;

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <CartProvider>
      <ScrollToTop />
      <div className="app">

        {!isAdminRoute && <Header />}

        <main className={isAdminRoute ? 'admin-main' : ''}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/what-we-stand-for" element={<WhatWeStandFor />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/why-zappcart" element={<WhyChooseZappCart />} />
            <Route path="/support" element={<Support />} />
            {/* Newsroom route */}
            <Route path="/newsroom" element={<Newsroom />} />
            {/* Contact route */}
            <Route path="/contact" element={<Contact />} />

            {/* Category Routes */}
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/category/:categoryId" element={<CategoryProductsPage />} />

            {/* Checkout route - Now public (not protected) */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />
            {/* Protected Routes (require authentication) */}
            <Route
              path="/order-confirmation"
              element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes (require admin role) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute isAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-product"
              element={
                <ProtectedRoute isAdmin={true}>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-product/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-category"
              element={
                <ProtectedRoute isAdmin={true}>
                  <AddCategory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-category/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <EditCategory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customers/:id"
              element={
                <ProtectedRoute isAdmin={true}>
                  <CustomerDetail />
                </ProtectedRoute>
              }
            />

            {/* Fallback route for 404 */}
            <Route path="*" element={
              <div className="not-found">
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
              </div>
            } />
          </Routes>

        </main>

        {/* Don't show footer on admin pages */}
        {!isAdminRoute && <Footer />}
      </div>
    </CartProvider>
  );
};

// Main App component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;