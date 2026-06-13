import React from 'react';

function OrderSummary({ products, cart }) {
  const subtotal = products.reduce((sum, p) => sum + p.price * (cart[String(p.id)] || 1), 0);
  const deliveryCharge = subtotal >= 999 ? 0 : 49;
  const discount = Math.round(subtotal * 0.05);
  const total = subtotal - discount + deliveryCharge;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-24">
      <h3 className="font-bold text-gray-800 mb-4 text-base">Order Summary</h3>
      <div className="flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({products.length} item{products.length !== 1 ? 's' : ''})</span>
          <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Discount (5%)</span>
          <span>- ₹{discount.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery</span>
          <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
        </div>
        {subtotal < 999 && <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">Add ₹{(999 - subtotal).toFixed(0)} more for free delivery!</p>}
        <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-gray-900 text-base">
          <span>Total Amount</span>
          <span>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <p className="text-xs text-green-600 text-right">You save ₹{discount.toLocaleString('en-IN')} on this order!</p>
      </div>
      <button onClick={() => alert('Checkout coming soon!')} className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition text-sm shadow-md">
        Proceed to Checkout
      </button>
      <div className="mt-3 flex justify-center gap-4 text-xs text-gray-400">
        <span>🔒 Secure</span>
        <span>↩️ Easy Returns</span>
        <span>🚚 Fast Delivery</span>
      </div>
    </div>
  );
}

export default OrderSummary;
