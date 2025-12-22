import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import About from './pages/About'
import Profile from './pages/Profile'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import ProductDetails from './pages/ProductDetails'
import AdminLogin from './pages/admin/Login'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminForecasting from './pages/admin/Forecasting'
import { ToastProvider } from './lib/ToastContext'
import { CartProvider } from './lib/CartContext'
import ChatbotWidget from './components/ChatbotWidget'

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </ToastProvider>
  )
}

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {!isAdminPath && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="forecasting" element={<AdminForecasting />} />
          </Route>
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      <ChatbotWidget />
    </div>
  )
}

export default App
