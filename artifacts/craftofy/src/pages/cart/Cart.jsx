import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { getProductById } from '../../api/productApi';
import CartItem from './CartItem';
import OrderSummary from './OrderSummary';

function Cart({ cart, onRemoveFromCart, onUpdateQty }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = Object.keys(cart);
    if (!ids.length) { setProducts([]); setLoading(false); return; }
    Promise.all(ids.map(id => getProductById(id))).then(data => { setProducts(data); setLoading(false); }).catch(() => setLoading(false));
  }, [cart]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 pb-24">
        <h1 className="text-xl font-bold text-gray-800 mb-4">My Cart</h1>
        <div className="flex flex-col gap-3">
          {[1,2].map(i => (
            <div key={i} className="bg-white rounded-xl p-3 shadow-sm animate-pulse flex gap-3">
              <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-1/2" /><div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
        <FiShoppingCart className="text-7xl text-gray-200" />
        <h2 className="text-xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-sm text-gray-400 max-w-xs">Looks like you haven't added any products yet.</p>
        <Link to="/products" className="bg-green-700 hover:bg-green-800 text-white text-sm font-bold px-8 py-3 rounded-full transition shadow-md">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 pb-28 sm:pb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-800">My Cart <span className="ml-2 text-sm font-normal text-gray-500">({products.length} item{products.length !== 1 ? 's' : ''})</span></h1>
        <Link to="/products" className="text-green-700 text-sm hover:underline">Continue Shopping</Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        <div className="flex-1 flex flex-col gap-3 w-full">
          {products.map(product => (
            <CartItem key={product.id} product={product} qty={cart[String(product.id)] || 1}
              onRemove={() => onRemoveFromCart(String(product.id))}
              onQtyChange={newQty => { if (newQty < 1) return; onUpdateQty(String(product.id), newQty); }}
            />
          ))}
        </div>
        <div className="w-full sm:w-80 shrink-0"><OrderSummary products={products} cart={cart} /></div>
      </div>
      <div className="fixed bottom-16 sm:hidden left-0 right-0 px-4 py-3 bg-white border-t border-gray-100 shadow-lg z-30">
        <button onClick={() => alert('Checkout coming soon!')} className="w-full bg-green-700 text-white font-bold py-3 rounded-xl text-sm shadow-md">Proceed to Checkout</button>
      </div>
    </div>
  );
}

export default Cart;
