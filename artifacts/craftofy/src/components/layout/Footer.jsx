import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../craftofy_logo.png';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-10 pb-6 mt-8">
      <div className="w-full px-4 xl:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center p-0.5 shrink-0">
                <img src={logo} alt="Craftofy" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-bold text-lg">Craftofy</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Premium interior design products crafted with love. Transform your home into a sanctuary.
            </p>
            <div className="flex gap-2 mt-2">
              {['📘','📸','🐦','▶️'].map((s,i) => (
                <button key={i} className="w-7 h-7 bg-gray-700 hover:bg-green-700 rounded-full text-xs flex items-center justify-center transition">{s}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Categories</h4>
            <ul className="space-y-2 text-xs">
              {[['Living Room','/category/living-room'],['Bedroom','/category/bedroom'],['Dining Room','/category/dining'],['Lighting','/category/lighting'],['Wall Decor','/category/wall-decor'],['Rugs & Flooring','/category/rugs'],['Outdoor','/category/outdoor']].map(([label, to]) => (
                <li key={label}><Link to={to} className="hover:text-green-400 transition">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Customer Help</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/my-orders" className="hover:text-green-400 transition">My Orders</Link></li>
              <li><Link to="/my-orders" className="hover:text-green-400 transition">Track Order</Link></li>
              <li><Link to="/custom-order" className="hover:text-green-400 transition">Custom Order</Link></li>
              <li><Link to="/profile" className="hover:text-green-400 transition">Returns & Refunds</Link></li>
              <li><Link to="/profile" className="hover:text-green-400 transition">Contact Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-green-400 transition">About Us</Link></li>
              <li><Link to="/" className="hover:text-green-400 transition">Careers</Link></li>
              <li><Link to="/" className="hover:text-green-400 transition">Blog</Link></li>
              <li><Link to="/admin" className="hover:text-green-400 transition">Admin Panel</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Policies</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-green-400 transition">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-green-400 transition">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-green-400 transition">Shipping Policy</Link></li>
            </ul>
            <h4 className="text-white font-semibold text-sm mt-4 mb-2">Contact</h4>
            <p className="text-xs text-gray-400">📞 1800-CRAFTOFY</p>
            <p className="text-xs text-gray-400 mt-1">✉️ support@craftofy.in</p>
            <p className="text-xs text-gray-400 mt-1">🕘 Mon–Sat, 9AM–6PM</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 py-4 border-t border-b border-gray-800 mb-4">
          {[['🔒','Secure Payments'],['↩️','10-Day Returns'],['🚚','Pan-India Delivery'],['🛡️','Quality Warranty'],['⭐','4.8★ Rated']].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="text-base">{icon}</span>{label}
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 Craftofy. All rights reserved.</p>
          <div className="flex gap-4">
            <span>🇮🇳 Made in India</span>
            <span>Made with ❤️ for interior lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
