// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import '../../styles/pages/admin/AdminDashboard.css';
import { FaTachometerAlt, FaBox, FaTag, FaShoppingBag, FaUsers, FaChartLine, FaCog, FaSignOutAlt, FaSearch } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
    topSellingProducts: []
  });
  
  // Products state
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  
  // Categories state
  const [categories, setCategories] = useState([]);
  
  // Customers state
  const [customers, setCustomers] = useState([]);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
        // In a real app, you'd check if the user has admin role
        // For this example, we'll assume the current logged-in user is an admin
        setIsAdmin(true);
        
        // Fetch initial dashboard data
        fetchDashboardStats();
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate]);
  
  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);
  
  useEffect(() => {
    // Filter orders based on search query
    if (orderSearchQuery.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        order => 
          order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
          order.customer.fullName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
          order.status.toLowerCase().includes(orderSearchQuery.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [orderSearchQuery, orders]);
  
  const fetchDashboardStats = async () => {
    try {
      // Fetch total products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setFilteredProducts(productsData);
      
      // Fetch categories
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
      
      // Fetch recent orders
      const ordersQuery = query(
        collection(db, 'orders'),
        orderBy('orderDate', 'desc'),
        limit(10)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      
      // Fetch customers
      const customersSnapshot = await getDocs(collection(db, 'users'));
      const customersData = customersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(customersData);
      
      // Calculate revenue from orders
      const totalRevenue = ordersData.reduce((sum, order) => sum + order.totalAmount, 0);
      
      // Get top selling products
      // In a real app, you'd have better logic to determine this
      // For this example, we'll just take a few random products
      const topSelling = productsData.slice(0, 5);
      
      // Set all stats
      setStats({
        totalOrders: ordersData.length,
        totalProducts: productsData.length,
        totalCustomers: customersData.length,
        totalRevenue,
        recentOrders: ordersData.slice(0, 5),
        topSellingProducts: topSelling
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus
      });
      
      // Update local orders state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // Also update filtered orders
      setFilteredOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };
  
  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        
        // Update local products state
        setProducts(prevProducts => 
          prevProducts.filter(product => product.id !== productId)
        );
        
        // Also update filtered products
        setFilteredProducts(prevProducts => 
          prevProducts.filter(product => product.id !== productId)
        );
        
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="admin-unauthorized">
        <h2>Unauthorized Access</h2>
        <p>You do not have permission to access this page.</p>
        <Link to="/" className="back-to-home">Back to Home</Link>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-brand">
          <h2>Licious Admin</h2>
        </div>
        
        <div className="admin-menu">
          <button 
            className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FaTachometerAlt /> <span>Dashboard</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <FaBox /> <span>Products</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <FaTag /> <span>Categories</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaShoppingBag /> <span>Orders</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <FaUsers /> <span>Customers</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FaChartLine /> <span>Reports</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> <span>Settings</span>
          </button>
        </div>
        
        <button className="sign-out-button" onClick={handleSignOut}>
          <FaSignOutAlt /> <span>Sign Out</span>
        </button>
      </div>
      
      <div className="admin-content">
        <div className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="admin-user">
            <span>Admin User</span>
          </div>
        </div>
        
        <div className="admin-main">
          {activeTab === 'dashboard' && (
            <div className="dashboard-tab">
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon orders">
                    <FaShoppingBag />
                  </div>
                  <div className="stat-details">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{stats.totalOrders}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon products">
                    <FaBox />
                  </div>
                  <div className="stat-details">
                    <h3>Total Products</h3>
                    <p className="stat-value">{stats.totalProducts}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon customers">
                    <FaUsers />
                  </div>
                  <div className="stat-details">
                    <h3>Total Customers</h3>
                    <p className="stat-value">{stats.totalCustomers}</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon revenue">
                    <FaChartLine />
                  </div>
                  <div className="stat-details">
                    <h3>Total Revenue</h3>
                    <p className="stat-value">₹{stats.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-sections">
                <div className="dashboard-section">
                  <h2>Recent Orders</h2>
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentOrders.map(order => (
                          <tr key={order.id}>
                            <td>#{order.id.slice(0, 8)}</td>
                            <td>{order.customer.fullName}</td>
                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td>₹{order.totalAmount.toFixed(2)}</td>
                            <td>
                              <span className={`status-badge ${order.status}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="view-all-link">
                    <button onClick={() => setActiveTab('orders')}>View All Orders</button>
                  </div>
                </div>
                
                <div className="dashboard-section">
                  <h2>Top Selling Products</h2>
                  <div className="table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.topSellingProducts.map(product => (
                          <tr key={product.id}>
                            <td>
                              <div className="product-cell">
                                <img src={product.image} alt={product.name} />
                                <span>{product.name}</span>
                              </div>
                            </td>
                            <td>{product.category}</td>
                            <td>₹{product.price}</td>
                            <td>
                              <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="view-all-link">
                    <button onClick={() => setActiveTab('products')}>View All Products</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'products' && (
            <div className="products-tab">
              <div className="tab-actions">
                <div className="search-bar">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Link to="/admin/add-product" className="add-button">
                  + Add New Product
                </Link>
              </div>
              
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className="product-cell">
                            <img src={product.image} alt={product.name} />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.category}</td>
                        <td>₹{product.price}</td>
                        <td>
                          <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link to={`/admin/edit-product/${product.id}`} className="edit-button">
                              Edit
                            </Link>
                            <button 
                              className="delete-button"
                              onClick={() => deleteProduct(product.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="orders-tab">
              <div className="tab-actions">
                <div className="search-bar">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="filter-buttons">
                  <button 
                    className="filter-button all active"
                    onClick={() => setFilteredOrders(orders)}
                  >
                    All
                  </button>
                  <button 
                    className="filter-button pending"
                    onClick={() => setFilteredOrders(orders.filter(order => order.status === 'pending'))}
                  >
                    Pending
                  </button>
                  <button 
                    className="filter-button processing"
                    onClick={() => setFilteredOrders(orders.filter(order => order.status === 'processing'))}
                  >
                    Processing
                  </button>
                  <button 
                    className="filter-button shipped"
                    onClick={() => setFilteredOrders(orders.filter(order => order.status === 'shipped'))}
                  >
                    Shipped
                  </button>
                  <button 
                    className="filter-button delivered"
                    onClick={() => setFilteredOrders(orders.filter(order => order.status === 'delivered'))}
                  >
                    Delivered
                  </button>
                </div>
              </div>
              
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id.slice(0, 8)}</td>
                        <td>{order.customer.fullName}</td>
                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>₹{order.totalAmount.toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link to={`/admin/orders/${order.id}`} className="view-button">
                              View
                            </Link>
                            <select 
                              className="status-select"
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'categories' && (
            <div className="categories-tab">
              <div className="tab-actions">
                <Link to="/admin/add-category" className="add-button">
                  + Add New Category
                </Link>
              </div>
              
              <div className="categories-grid">
                {categories.map(category => (
                  <div key={category.id} className="category-card">
                    <div className="category-image">
                      <img src={category.image} alt={category.name} />
                    </div>
                    <div className="category-info">
                      <h3>{category.name}</h3>
                      <p>{category.productCount || 0} Products</p>
                    </div>
                    <div className="category-actions">
                      <Link to={`/admin/edit-category/${category.id}`} className="edit-button">
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'customers' && (
            <div className="customers-tab">
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Orders</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(customer => (
                      <tr key={customer.id}>
                        <td>{customer.fullName}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone || 'N/A'}</td>
                        <td>{customer.orderCount || 0}</td>
                        <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <div className="action-buttons">
                            <Link to={`/admin/customers/${customer.id}`} className="view-button">
                              View
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'reports' && (
            <div className="reports-tab">
              <div className="coming-soon">
                <h2>Reports Coming Soon!</h2>
                <p>This feature is currently under development.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="coming-soon">
                <h2>Settings Coming Soon!</h2>
                <p>This feature is currently under development.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;