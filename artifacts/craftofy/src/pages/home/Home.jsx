import React from 'react';
import HeroBanner from './HeroBanner';
import CategorySection from './CategorySection';
import OfferBanner from './OfferBanner';
import FeaturedProducts from './FeaturedProducts';
import TrendingSection from './TrendingSection';

function Home({ onAddToCart }) {
  return (
    <div className="pb-20 sm:pb-4">
      <HeroBanner />
      <CategorySection />
      <OfferBanner />
      <FeaturedProducts onAddToCart={onAddToCart} />
      <TrendingSection />
      <section className="mt-8 px-2 sm:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '🚚', title: 'Free Delivery', sub: 'Orders above ₹999' },
            { icon: '↩️', title: 'Easy Returns', sub: '30-day hassle-free' },
            { icon: '🔒', title: 'Secure Payment', sub: '100% safe checkout' },
            { icon: '🏆', title: 'Premium Quality', sub: 'Handpicked products' },
          ].map((b, i) => (
            <div key={i} className="bg-white rounded-xl p-3 flex items-center gap-3 border border-gray-100 shadow-sm">
              <span className="text-2xl">{b.icon}</span>
              <div>
                <p className="text-xs font-bold text-gray-800">{b.title}</p>
                <p className="text-[10px] text-gray-500">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
