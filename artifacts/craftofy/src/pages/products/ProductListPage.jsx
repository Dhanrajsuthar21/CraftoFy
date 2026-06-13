import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { getFurnitureProducts, searchProducts } from '../../api/productApi';
import ProductCard from './ProductCard';
import { SkeletonCard } from '../../components/ui/Loading';
import categories from '../../data/categories';

const SORTS = [
  { label: 'Relevance', value: 'default' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
];

function ProductListPage({ onAddToCart }) {
  const [searchParams] = useSearchParams();
  const { categoryId } = useParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('default');
  const category = categoryId ? categories.find(c => c.id === categoryId) : null;

  useEffect(() => {
    setLoading(true);
    const fetch = query ? searchProducts(query) : getFurnitureProducts(50);
    fetch.then(data => { setProducts(data); setLoading(false); }).catch(() => setLoading(false));
  }, [query, categoryId]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price_asc') return a.price - b.price;
    if (sort === 'price_desc') return b.price - a.price;
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const title = category ? `${category.icon} ${category.name}` : query ? `Results for "${query}"` : 'All Products';

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 pb-20 sm:pb-6 pt-4">
      <p className="text-xs text-gray-400 mb-3">
        <Link to="/" className="hover:underline">Home</Link> / <span className="text-gray-700 font-medium">{title}</span>
      </p>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="text-lg font-bold text-gray-800">{title}</h1>
          {!loading && <p className="text-xs text-gray-500">{sorted.length} products found</p>}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
          {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {loading ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />) :
          sorted.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-600 font-semibold">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
            </div>
          ) : sorted.map(p => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
      </div>
    </div>
  );
}

export default ProductListPage;
