import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  { title: 'Design Your Dream Home', subtitle: 'Premium furniture & decor crafted with love', cta: 'Shop Living Room', link: '/category/living-room', bg: 'from-green-800 to-green-600', emoji: '🛋️' },
  { title: 'Sleep in Style', subtitle: 'Elegant bedroom collections starting ₹4,999', cta: 'Explore Bedroom', link: '/category/bedroom', bg: 'from-amber-700 to-amber-500', emoji: '🛏️' },
  { title: 'Light Up Your Space', subtitle: 'Stunning lighting for every room & mood', cta: 'View Lighting', link: '/category/lighting', bg: 'from-slate-700 to-slate-500', emoji: '💡' },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);
  const slide = slides[current];
  return (
    <div className={`relative bg-gradient-to-r ${slide.bg} rounded-2xl mx-2 sm:mx-4 mt-3 overflow-hidden transition-all duration-700`}>
      <div className="px-6 py-8 sm:px-10 sm:py-12 relative z-10">
        <p className="text-green-200 text-xs font-semibold uppercase tracking-widest mb-2">New Season Arrivals</p>
        <h1 className="text-white text-2xl sm:text-4xl font-bold leading-tight mb-2 max-w-xs sm:max-w-md">{slide.title}</h1>
        <p className="text-white/80 text-sm mb-5">{slide.subtitle}</p>
        <div className="flex gap-3">
          <Link to={slide.link} className="inline-block bg-white text-green-800 text-sm font-bold px-5 py-2.5 rounded-full shadow hover:bg-amber-50 transition">{slide.cta}</Link>
          <Link to="/products" className="inline-block border border-white/60 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-white/10 transition">All Products</Link>
        </div>
      </div>
      <div className="absolute right-6 bottom-0 text-[7rem] sm:text-[10rem] opacity-20 leading-none select-none pointer-events-none">{slide.emoji}</div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition ${i === current ? 'bg-white' : 'bg-white/40'}`} />
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;
