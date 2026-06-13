import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../../api/productApi';
import Loading from '../../components/ui/Loading';
import NotFound from '../../components/ui/NotFound';
import { AiFillStar } from 'react-icons/ai';
import { FiShoppingCart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdLocalShipping, MdVerified } from 'react-icons/md';

function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true); setImgIndex(0);
    getProductById(id).then(p => { setProduct(p); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading text="Loading product..." />;
  if (!product) return <NotFound message="Product not found" />;

  const images = product.images?.length ? product.images : [product.thumbnail];
  const discount = product.discountPercentage ? Math.round(product.discountPercentage) : 20;
  const originalPrice = Math.round(product.price * (100 / (100 - discount)));

  function handleAddToCart() { onAddToCart(String(product.id), qty); setAdded(true); setTimeout(() => setAdded(false), 2000); }
  function handleBuyNow() { onAddToCart(String(product.id), qty); navigate('/cart'); }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 pb-28 sm:pb-10 pt-4">
      <p className="text-xs text-gray-400 mb-4">
        <Link to="/" className="hover:underline">Home</Link> / <Link to="/products" className="hover:underline">Products</Link> / <span className="text-gray-700">{product.title}</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="sm:w-2/5">
          <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square border border-gray-100">
            <img src={images[imgIndex]} alt={product.title} className="w-full h-full object-contain" />
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow"><FiChevronLeft /></button>
                <button onClick={() => setImgIndex(i => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow"><FiChevronRight /></button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setImgIndex(i)} className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${i === imgIndex ? 'border-green-600' : 'border-gray-200'}`}>
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="sm:w-3/5">
          <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded font-medium capitalize">{product.category}</span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2 mb-2 leading-tight">{product.title}</h1>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1"><AiFillStar className="text-xs" />{product.rating?.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">{product.stock} in stock</span>
            <span className="text-gray-300">|</span>
            <span className="text-green-600 text-sm flex items-center gap-1"><MdVerified /> Verified Product</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">₹{product.price?.toLocaleString('en-IN')}</span>
              <span className="text-lg text-gray-400 line-through">₹{originalPrice?.toLocaleString('en-IN')}</span>
              <span className="text-green-700 font-bold text-sm bg-green-100 px-2 py-0.5 rounded">{discount}% OFF</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{product.description}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
            {product.brand && <><span className="text-gray-500">Brand</span><span className="font-medium text-gray-800">{product.brand}</span></>}
            {product.warrantyInformation && <><span className="text-gray-500">Warranty</span><span className="font-medium text-gray-800">{product.warrantyInformation}</span></>}
            {product.shippingInformation && <><span className="text-gray-500">Shipping</span><span className="font-medium text-gray-800">{product.shippingInformation}</span></>}
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium text-gray-700">Qty:</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition text-lg font-bold">−</button>
              <span className="px-4 py-1.5 font-semibold text-gray-800">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition text-lg font-bold">+</button>
            </div>
          </div>
          <div className="flex gap-3 mb-4">
            <button onClick={handleAddToCart} className={`flex-1 flex items-center justify-center gap-2 border-2 font-bold py-3 rounded-xl transition text-sm ${added ? 'border-green-600 bg-green-50 text-green-700' : 'border-amber-400 bg-amber-400 hover:bg-amber-500 text-gray-900'}`}>
              <FiShoppingCart />{added ? 'Added!' : 'Add to Cart'}
            </button>
            <button onClick={handleBuyNow} className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition text-sm">Buy Now</button>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><MdLocalShipping className="text-green-600" /> Free Delivery</span>
            <span>↩️ 30-Day Returns</span>
            <span>🔒 Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
