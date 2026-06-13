import React from 'react';
import { Link } from 'react-router-dom';

const offers = [
  { title: 'Up to 40% OFF', sub: 'On premium furniture', bg: 'from-amber-500 to-orange-500', emoji: '🏷️', link: '/products' },
  { title: 'Free Delivery', sub: 'On orders above ₹999', bg: 'from-green-600 to-teal-600', emoji: '🚚', link: '/products' },
];

function OfferBanner() {
  return (
    <section className="mt-6 px-2 sm:px-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {offers.map((o, i) => (
        <Link key={i} to={o.link} className={`bg-gradient-to-r ${o.bg} rounded-xl p-4 flex items-center justify-between shadow hover:shadow-lg transition`}>
          <div>
            <p className="text-white font-bold text-lg leading-tight">{o.title}</p>
            <p className="text-white/80 text-xs mt-0.5">{o.sub}</p>
          </div>
          <span className="text-4xl opacity-90">{o.emoji}</span>
        </Link>
      ))}
    </section>
  );
}

export default OfferBanner;
