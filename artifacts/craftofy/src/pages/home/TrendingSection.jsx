import React from 'react';
import { Link } from 'react-router-dom';

const trends = [
  { label: 'Minimalist Living', emoji: '🪑', bg: 'bg-stone-100', link: '/products?q=chair' },
  { label: 'Boho Bedroom', emoji: '🛏️', bg: 'bg-amber-50', link: '/products?q=bed' },
  { label: 'Industrial Lighting', emoji: '💡', bg: 'bg-gray-100', link: '/products?q=lamp' },
  { label: 'Scandinavian Dining', emoji: '🍽️', bg: 'bg-green-50', link: '/products?q=table' },
];

function TrendingSection() {
  return (
    <section className="mt-6 px-2 sm:px-4">
      <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3">Trending Styles</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {trends.map((t, i) => (
          <Link key={i} to={t.link} className={`${t.bg} rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition text-center`}>
            <span className="text-4xl">{t.emoji}</span>
            <span className="text-xs font-semibold text-gray-700">{t.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default TrendingSection;
