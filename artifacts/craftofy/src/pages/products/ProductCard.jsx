import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';

function ProductCard({ product, onAddToCart }) {
  const discount = product.discountPercentage ? Math.round(product.discountPercentage) : 20;
  const originalPrice = Math.round(product.price * (100 / (100 - discount)));

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden flex flex-col group">
      <Link to={`/product/${product.id}`} className="relative block">
        <div className="aspect-square bg-gray-50 overflow-hidden">
          <img src={product.thumbnail} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        </div>
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{discount}% OFF</span>
        )}
      </Link>
      <div className="p-2.5 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-1 hover:text-green-700 transition">{product.title}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-1.5">
          <span className="bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <AiFillStar className="text-[9px]" /> {product.rating?.toFixed(1) || '4.5'}
          </span>
          <span className="text-gray-400 text-[10px]">({product.stock || 100}+ sold)</span>
        </div>
        <div className="flex items-baseline gap-1.5 mt-auto">
          <span className="text-sm sm:text-base font-bold text-gray-900">₹{product.price?.toLocaleString('en-IN')}</span>
          <span className="text-xs text-gray-400 line-through">₹{originalPrice?.toLocaleString('en-IN')}</span>
        </div>
        <p className="text-[10px] text-green-600 font-medium mt-1">🚚 Free Delivery</p>
        {onAddToCart && (
          <button onClick={() => onAddToCart(product.id, 1)} className="mt-2 w-full bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-bold py-2 rounded-lg transition flex items-center justify-center gap-1">
            <FiShoppingCart className="text-sm" /> Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
