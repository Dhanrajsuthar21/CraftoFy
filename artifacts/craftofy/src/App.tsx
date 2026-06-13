import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import NavBar from './components/layout/NavBar';
import BottomNav from './components/layout/BottomNav';
import Footer from './components/layout/Footer';

import Home from './pages/home/Home';
import ProductListPage from './pages/products/ProductListPage';
import ProductDetails from './pages/products/ProductDetails';
import Cart from './pages/cart/Cart';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Profile from './pages/profile/Profile';
import CustomOrder from './pages/customorder/CustomOrder';
import MyOrders from './pages/orders/MyOrders';
import AdminPanel from './pages/admin/AdminPanel';
import NotFound from './components/ui/NotFound';

function App() {
  const savedCart = JSON.parse(localStorage.getItem('craftofy_cart') || '{}');
  const [cart, setCart] = useState(savedCart);

  const savedUser = JSON.parse(localStorage.getItem('craftofy_user') || 'null');
  const [user, setUser] = useState(savedUser);

  function saveCart(newCart: any) {
    setCart(newCart);
    localStorage.setItem('craftofy_cart', JSON.stringify(newCart));
  }

  function addToCart(productId: any, qty = 1) {
    const id = String(productId);
    saveCart({ ...cart, [id]: (cart[id] || 0) + qty });
  }

  function removeFromCart(productId: any) {
    const newCart = { ...cart };
    delete newCart[String(productId)];
    saveCart(newCart);
  }

  function updateQty(productId: any, qty: number) {
    const id = String(productId);
    if (qty < 1) { removeFromCart(id); return; }
    saveCart({ ...cart, [id]: qty });
  }

  function handleLogin(u: any) { setUser(u); }

  function handleLogout() {
    localStorage.removeItem('craftofy_user');
    setUser(null);
  }

  function handleUserUpdate(updatedUser: any) {
    setUser(updatedUser);
  }

  const cartCount = Object.values(cart).reduce((s: any, v: any) => s + v, 0) as number;
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');
  const hideBottomNav = ['/login', '/signup'].includes(location.pathname) || isAdmin;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isAdmin && <NavBar cartCount={cartCount} user={user} onLogout={handleLogout} />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onAddToCart={addToCart} />} />
          <Route path="/products" element={<ProductListPage onAddToCart={addToCart} />} />
          <Route path="/category/:categoryId" element={<ProductListPage onAddToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetails onAddToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} onRemoveFromCart={removeFromCart} onUpdateQty={updateQty} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} onUpdate={handleUserUpdate} />} />
          <Route path="/custom-order" element={<CustomOrder />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdmin && !hideBottomNav && <Footer />}
      {!hideBottomNav && <BottomNav user={user} cartCount={cartCount} />}
    </div>
  );
}

export default App;
