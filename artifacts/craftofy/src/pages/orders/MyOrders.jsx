import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineDesignServices } from 'react-icons/md';
import { FiPackage } from 'react-icons/fi';

const STEPS = [
  { key: 'accepted', label: 'Order Accepted', icon: '✅' },
  { key: 'design', label: 'Design Confirmation', icon: '📐' },
  { key: 'manufacturing', label: 'Factory / Manufacturing', icon: '🏭' },
  { key: 'carving', label: 'Wood Carving & Assembly', icon: '🪵' },
  { key: 'polishing', label: 'Polishing & Finishing', icon: '✨' },
  { key: 'quality', label: 'Quality Check', icon: '🔍' },
  { key: 'dispatch', label: 'Dispatched', icon: '📦' },
  { key: 'delivery', label: 'Out for Delivery', icon: '🚚' },
  { key: 'delivered', label: 'Delivered', icon: '🏠' },
];

function OrderTimeline({ order }) {
  const [expanded, setExpanded] = useState(true);
  const currentStepIndex = STEPS.findIndex(s => s.key === (order.currentStep || 'accepted'));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={() => setExpanded(e => !e)} className="w-full flex items-start justify-between px-4 py-4 hover:bg-gray-50 transition text-left">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-lg">{order.productEmoji || '🛋️'}</span>
            <span className="font-bold text-gray-800 text-sm">{order.productLabel || 'Custom Furniture'}</span>
          </div>
          <p className="text-xs text-gray-400">Order #{String(order.id).slice(-6).toUpperCase()} • {order.date}</p>
          <p className="text-xs mt-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${order.currentStep === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current inline-block animate-pulse" />
              {STEPS.find(s => s.key === (order.currentStep || 'accepted'))?.label || 'Order Accepted'}
            </span>
          </p>
        </div>
        <div className="text-right shrink-0 ml-3">
          {order.estimate && <p className="font-bold text-gray-800 text-sm">₹{(order.estimate.price || order.estimate.low || 0).toLocaleString('en-IN')}</p>}
          <p className="text-gray-400 text-xs mt-0.5">{expanded ? '▲ Hide' : '▼ Track'}</p>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <div className="relative mt-3">
            {STEPS.map((step, i) => {
              const isDone = i < currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={step.key} className="flex items-start gap-3 mb-2 last:mb-0">
                  <div className="flex flex-col items-center shrink-0" style={{ width: 20 }}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center z-10 ${isDone ? 'bg-amber-500 border-amber-500' : isCurrent ? 'bg-white border-amber-500 shadow-md' : 'bg-white border-gray-200'}`}>
                      {isDone && <span className="text-white text-[8px] font-bold">✓</span>}
                      {isCurrent && <span className="w-2 h-2 bg-amber-500 rounded-full block animate-pulse" />}
                    </div>
                    {i < STEPS.length - 1 && <div className={`w-0.5 h-5 mt-0.5 ${isDone ? 'bg-amber-400' : 'bg-gray-200'}`} />}
                  </div>
                  <div className="pb-1">
                    <p className={`text-sm font-medium leading-tight ${isCurrent ? 'text-amber-600 font-bold' : isDone ? 'text-gray-700' : 'text-gray-400'}`}>
                      {step.icon} {step.label}
                      {isCurrent && <span className="ml-2 text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">Current</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 bg-gray-50 rounded-xl p-3 text-xs text-gray-600 space-y-1">
            {order.material && <p>🪵 Material: <b className="text-gray-800">{order.material}</b></p>}
            {order.polish && <p>✨ Finish: <b className="text-gray-800">{order.polish}</b></p>}
            {order.roomType && <p>🏠 Room: <b className="text-gray-800">{order.roomType}</b></p>}
            {order.timeline && <p>⏱️ Timeline: <b className="text-gray-800">{order.timeline}</b></p>}
            {order.phone && <p>📞 Contact: <b className="text-gray-800">{order.phone}</b></p>}
          </div>
        </div>
      )}
    </div>
  );
}

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('craftofy_custom_orders') || '[]');
    const withSteps = saved.map((o, i) => ({
      ...o,
      productLabel: o.productLabel || o.roomType || o.category || 'Custom Furniture',
      productEmoji: o.productEmoji || '🛋️',
      currentStep: o.currentStep || STEPS[Math.min(i, STEPS.length - 1)].key,
    }));
    setOrders(withSteps.reverse());
  }, []);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center pb-24">
        <FiPackage className="text-7xl text-gray-200" />
        <h2 className="text-xl font-bold text-gray-700">No orders yet</h2>
        <p className="text-sm text-gray-400 max-w-xs">Place a custom order and track it right here, step by step.</p>
        <Link to="/custom-order" className="bg-green-700 text-white font-bold px-8 py-3 rounded-full text-sm">Place Custom Order</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 pt-4 pb-28 sm:pb-10">
      <div className="flex items-center gap-3 mb-5">
        <MdOutlineDesignServices className="text-3xl text-green-700" />
        <div>
          <h1 className="text-xl font-bold text-gray-800">My Custom Orders</h1>
          <p className="text-sm text-gray-400">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {orders.map(order => <OrderTimeline key={order.id} order={order} />)}
      </div>
      <div className="mt-6 text-center">
        <Link to="/custom-order" className="text-green-700 text-sm font-semibold hover:underline">+ Place Another Custom Order</Link>
      </div>
    </div>
  );
}

export default MyOrders;
