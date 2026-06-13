import axios from 'axios';

const BASE = 'https://dummyjson.com';

export function getFurnitureProducts(limit = 100) {
  const cats = ['furniture', 'home-decoration'];
  return Promise.all(
    cats.map(cat =>
      axios.get(`${BASE}/products/category/${cat}?limit=50`).then(r => r.data.products).catch(() => [])
    )
  ).then(results => results.flat().slice(0, limit));
}

export function getProductById(id) {
  return axios.get(`${BASE}/products/${id}`).then(r => r.data);
}

export function searchProducts(query) {
  if (!query || query === 'all') return getFurnitureProducts(100);
  return axios.get(`${BASE}/products/search?q=${encodeURIComponent(query)}`).then(r =>
    r.data.products.filter(p => ['furniture', 'home-decoration'].includes(p.category))
  );
}

export function getProductsByCategory(cat) {
  return axios.get(`${BASE}/products/category/${cat}?limit=50`).then(r => r.data.products);
}

export function getProductData() { return getFurnitureProducts(); }
export function getProductId(id) { return getProductById(id); }
