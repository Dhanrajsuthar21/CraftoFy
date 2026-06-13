import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import logo from '../../craftofy_logo.png';
import categories from '../../data/categories';

function NavBar({ cartCount, user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/products?q=' + encodeURIComponent(searchQuery.trim()));
      setSearchQuery('');
      setMenuOpen(false);
    }
  }

  return (
    <header className="bg-green-800 sticky top-0 z-50 shadow-md">
      <div className="w-full px-4 xl:px-10 py-2 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center p-0.5 shadow-sm shrink-0">
            <img src={logo} alt="Craftofy" className="w-full h-full object-contain" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight hidden sm:block">Craftofy</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 flex">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search sofas, beds, lamps..."
            className="flex-1 px-4 py-2 text-sm rounded-l-lg focus:outline-none text-gray-800 bg-white"
          />
          <button type="submit" className="bg-amber-400 hover:bg-amber-500 px-4 py-2 rounded-r-lg transition">
            <FiSearch className="text-gray-800 text-lg" />
          </button>
        </form>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/custom-order" className="hidden sm:flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg transition">
            ✏️ Custom Order
          </Link>

          {user ? (
            <Link to="/profile" className="hidden sm:flex items-center gap-1.5 text-white text-xs hover:text-amber-300 transition">
              <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-green-200 text-[10px]">Hello,</span>
                <span className="font-semibold">{user.name.split(' ')[0]}</span>
              </div>
            </Link>
          ) : (
            <Link to="/login" className="hidden sm:flex flex-col items-center text-white text-xs hover:text-amber-300 transition">
              <FiUser className="text-xl" />
              <span>Login</span>
            </Link>
          )}

          <Link to="/cart" className="flex flex-col items-center text-white text-xs hover:text-amber-300 transition relative">
            <FiShoppingCart className="text-xl" />
            <span className="hidden sm:block">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-900 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          <button className="sm:hidden text-white text-xl" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <nav className="hidden sm:block bg-green-900 border-t border-green-700">
        <div className="w-full px-4 xl:px-10 flex gap-1 overflow-x-auto scrollbar-hide py-1">
          {categories.map(cat => (
            <Link key={cat.id} to={`/category/${cat.id}`}
              className="shrink-0 text-green-200 hover:text-white text-xs px-3 py-1 rounded hover:bg-green-700 transition whitespace-nowrap">
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <div className="sm:hidden bg-green-900 border-t border-green-700 px-4 py-3 flex flex-col gap-3">
          {user ? (
            <div className="flex items-center justify-between">
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-white text-sm font-medium">Hi, {user.name.split(' ')[0]}! 👋</Link>
              <button onClick={() => { onLogout(); setMenuOpen(false); }} className="text-red-300 text-sm">Logout</button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center bg-white text-green-800 text-sm font-semibold py-2 rounded-lg">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex-1 text-center bg-amber-400 text-gray-900 text-sm font-semibold py-2 rounded-lg">Sign Up</Link>
            </div>
          )}
          <Link to="/custom-order" onClick={() => setMenuOpen(false)} className="w-full text-center bg-amber-400 text-gray-900 text-sm font-bold py-2.5 rounded-lg">
            ✏️ Custom Order
          </Link>
          <div className="grid grid-cols-3 gap-2">
            {categories.map(cat => (
              <Link key={cat.id} to={`/category/${cat.id}`} onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center gap-1 bg-green-800 rounded-lg py-2 text-white text-xs text-center">
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;
