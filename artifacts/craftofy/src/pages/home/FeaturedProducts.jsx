import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFurnitureProducts } from '../../api/productApi';
import ProductCard from '../products/ProductCard';
import { SkeletonCard } from '../../components/ui/Loading';

function FeaturedProducts({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFurnitureProducts(10).then(p => { setProducts(p); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <section className="mt-6 px-2 sm:px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">Featured Products</h2>
        <Link to="/products" className="text-green-700 text-xs font-semibold hover:underline">View All →</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {loading ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />) : products.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
      </div>
    </section>
  );
}

export default FeaturedProducts;
