import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { BiCategoryAlt } from 'react-icons/bi';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { MdOutlineDesignServices } from 'react-icons/md';

function BottomNav({ user, cartCount }) {
  const { pathname } = useLocation();
  function cls(path) {
    return pathname === path ? 'text-green-700 font-semibold' : 'text-gray-400';
  }
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-1.5 z-40 sm:hidden shadow-lg">
      <Link to="/" className={`flex flex-col items-center gap-0.5 text-[10px] ${cls('/')}`}>
        <FaHome className="text-xl" />
        <span>Home</span>
      </Link>
      <Link to="/products" className={`flex flex-col items-center gap-0.5 text-[10px] ${cls('/products')}`}>
        <BiCategoryAlt className="text-xl" />
        <span>Browse</span>
      </Link>
      <Link to="/custom-order" className={`flex flex-col items-center gap-0.5 text-[10px] -mt-4 ${pathname === '/custom-order' ? 'text-green-700' : 'text-white'}`}>
        <span className={`w-13 h-13 flex flex-col items-center justify-center rounded-full shadow-lg px-3 pt-2 pb-1.5 ${pathname === '/custom-order' ? 'bg-green-700 text-white' : 'bg-amber-400 text-gray-900'}`}>
          <MdOutlineDesignServices className="text-2xl" />
          <span className="text-[9px] font-bold whitespace-nowrap">Custom</span>
        </span>
      </Link>
      <Link to="/cart" className={`flex flex-col items-center gap-0.5 text-[10px] relative ${cls('/cart')}`}>
        <FiShoppingCart className="text-xl" />
        {cartCount > 0 && (
          <span className="absolute -top-1 right-3 bg-green-700 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
            {cartCount > 9 ? '9+' : cartCount}
          </span>
        )}
        <span>Cart</span>
      </Link>
      <Link to={user ? '/profile' : '/login'} className={`flex flex-col items-center gap-0.5 text-[10px] ${cls(user ? '/profile' : '/login')}`}>
        <FiUser className="text-xl" />
        <span>{user ? user.name.split(' ')[0].slice(0, 6) : 'Login'}</span>
      </Link>
    </nav>
  );
}

export default BottomNav;
