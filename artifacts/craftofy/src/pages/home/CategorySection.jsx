import React from 'react';
import { Link } from 'react-router-dom';
import categories from '../../data/categories';

function CategorySection() {
  const featured = categories.filter(c => c.featured);
  const rest = categories.filter(c => !c.featured);
  return (
    <section className="mt-6 px-2 sm:px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">Shop by Category</h2>
        <Link to="/products" className="text-green-700 text-xs font-semibold hover:underline">View All →</Link>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
        {featured.map(cat => (
          <Link key={cat.id} to={`/category/${cat.id}`} className={`bg-gradient-to-br ${cat.color} rounded-xl p-3 flex flex-col items-center gap-1.5 hover:shadow-md transition text-center`}>
            <span className="text-3xl">{cat.icon}</span>
            <span className="text-[11px] font-semibold text-gray-700 leading-tight">{cat.name}</span>
          </Link>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {rest.map(cat => (
          <Link key={cat.id} to={`/category/${cat.id}`} className="flex items-center gap-1.5 bg-gray-100 hover:bg-green-50 hover:border-green-200 border border-transparent rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 transition">
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
