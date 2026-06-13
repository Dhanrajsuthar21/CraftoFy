import React from 'react';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

function CartItem({ product, qty, onRemove, onQtyChange }) {
  const total = (product.price * qty).toFixed(2);
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex gap-3">
      <Link to={`/product/${product.id}`} className="shrink-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
          <img src={product.thumbnail} alt={product.title} className="w-full h-full object-contain" />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight hover:text-green-700 transition">{product.title}</h3>
        </Link>
        <p className="text-xs text-gray-400 mt-0.5 capitalize">{product.category}</p>
        <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
          <div>
            <span className="text-base font-bold text-gray-900">₹{parseFloat(total).toLocaleString('en-IN')}</span>
            {qty > 1 && <span className="text-xs text-gray-400 ml-1.5">₹{product.price} × {qty}</span>}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden text-sm">
              <button onClick={() => onQtyChange(qty - 1)} disabled={qty <= 1} className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition font-bold">−</button>
              <span className="px-3 py-1 font-semibold">{qty}</span>
              <button onClick={() => onQtyChange(qty + 1)} className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition font-bold">+</button>
            </div>
            <button onClick={onRemove} className="bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-lg transition" title="Remove">
              <MdDelete className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
