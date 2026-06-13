import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ROOM_LABELS = { living:'Living Room', bedroom:'Bedroom', dining:'Dining Room', study:'Study / Office', kids:'Kids Room', kitchen:'Kitchen', pooja:'Pooja Room', outdoor:'Outdoor' };
const STYLE_LABELS = { modern:'Modern', classic:'Classic', scandinavian:'Scandinavian', industrial:'Industrial', bohemian:'Bohemian', royal:'Royal Indian' };
const PACKAGE_LABELS = { basic:'Basic', premium:'Premium ⭐', luxury:'Luxury 💎' };
const BUDGET_LABELS = { budget:'₹15K–30K', mid:'₹30K–75K', premium:'₹75K–1.5L', luxury:'₹1.5L+' };

export default function FinalSummary({ onBack, data }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', timeline: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[0-9]{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.timeline) e.timeline = 'Please select a timeline';
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const order = {
      id: Date.now(),
      ...form,
      roomType: data.roomType,
      style: data.style,
      budget: data.budget,
      material: data.material,
      palette: data.palette,
      furnitureCount: (data.placedFurniture || []).length,
      selectedPackage: data.selectedPackage || 'premium',
      estimate: data.estimate,
      productLabel: ROOM_LABELS[data.roomType] || 'AI Room Design',
      productEmoji: '🤖',
      type: 'AI Scan',
      currentStep: 'accepted',
      date: new Date().toLocaleDateString('en-IN'),
    };

    const existing = JSON.parse(localStorage.getItem('craftofy_custom_orders') || '[]');
    existing.push(order);
    localStorage.setItem('craftofy_custom_orders', JSON.stringify(existing));

    setSubmitted(true);
  }

  const roomLabel = ROOM_LABELS[data.roomType] || 'Room';

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🎉</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
          Your AI Room Design order for <b className="text-green-700">{roomLabel}</b> has been submitted. Our team will call you within 24 hours.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 text-left">
          <p className="text-xs font-bold text-green-700 mb-3 text-center">📋 Order Summary</p>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between"><span>Order ID</span><span className="font-bold text-gray-800">#{String(Date.now()).slice(-8)}</span></div>
            <div className="flex justify-between"><span>Room</span><span className="font-bold text-gray-800">{roomLabel}</span></div>
            <div className="flex justify-between"><span>Package</span><span className="font-bold text-gray-800">{PACKAGE_LABELS[data.selectedPackage] || 'Premium'}</span></div>
            {data.estimate?.price && <div className="flex justify-between border-t border-green-200 pt-2 mt-1"><span className="font-semibold">Estimate</span><span className="font-bold text-green-700 text-sm">₹{data.estimate.price.toLocaleString('en-IN')}</span></div>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6 text-center">
          {[
            { step: '1', label: 'Team Review', time: 'Within 24h', icon: '📞' },
            { step: '2', label: 'Design Call', time: 'Within 3 days', icon: '🎨' },
            { step: '3', label: 'Production', time: '25–45 days', icon: '🪵' },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
              <div className="text-xl mb-1">{s.icon}</div>
              <p className="text-xs font-bold text-gray-800">{s.label}</p>
              <p className="text-[10px] text-green-600 font-semibold">{s.time}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/my-orders" className="block w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition text-sm">
            📦 Track My Order
          </Link>
          <Link to="/" className="block w-full border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm">
            🏠 Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-5">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">📋</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Final Summary</h2>
        <p className="text-sm text-gray-500 mt-1">Review your design selections and enter contact details</p>
      </div>

      {/* Design summary card */}
      <div className="bg-gradient-to-r from-green-800 to-green-600 text-white rounded-2xl p-4 mb-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🤖</span>
          <div>
            <p className="font-bold text-base">AI Room Design</p>
            <p className="text-green-200 text-xs">{roomLabel}</p>
          </div>
          {data.estimate?.price && (
            <div className="ml-auto text-right">
              <p className="text-green-200 text-xs">Est. Price</p>
              <p className="text-xl font-bold">₹{data.estimate.price.toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ['🎨', 'Style', STYLE_LABELS[data.style] || '—'],
            ['📦', 'Package', PACKAGE_LABELS[data.selectedPackage] || 'Premium'],
            ['💰', 'Budget', BUDGET_LABELS[data.budget] || '—'],
            ['🛋️', 'Furniture', `${(data.placedFurniture || []).length || 3} items`],
          ].map(([icon, lbl, val]) => (
            <div key={lbl} className="bg-white/10 rounded-lg px-2 py-1.5">
              <span className="text-green-300">{icon} {lbl}</span>
              <p className="font-semibold text-white mt-0.5">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact form */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-4">
        <h3 className="font-bold text-gray-800 mb-4 text-sm">📞 Your Contact Details</h3>

        <div className="grid grid-cols-2 gap-4">
          {[
            { k:'name', lbl:'Full Name *', ph:'Ramesh Sharma', type:'text', full:true },
            { k:'phone', lbl:'Mobile Number *', ph:'9876543210', type:'tel', full:false },
            { k:'email', lbl:'Email Address *', ph:'you@example.com', type:'email', full:false },
          ].map(({ k, lbl, ph, type, full }) => (
            <div key={k} className={full ? 'col-span-2' : ''}>
              <label className="text-xs font-medium text-gray-600 mb-1 block">{lbl}</label>
              <input type={type} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors[k] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}/>
              {errors[k] && <p className="text-red-500 text-xs mt-1">{errors[k]}</p>}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="text-xs font-medium text-gray-600 mb-1 block">Delivery Address</label>
          <textarea value={form.address} onChange={e => set('address', e.target.value)} rows={2}
            placeholder="Flat / House no, Street, City, State, Pincode..."
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"/>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-5">
        <label className="text-sm font-bold text-gray-700 mb-2.5 block">When do you need it? *</label>
        <div className="grid grid-cols-3 gap-2">
          {['2–4 weeks','1–2 months','2–3 months','3–4 months','Above 4 months','Flexible'].map(t => (
            <button key={t} onClick={() => set('timeline', t)}
              className={`text-xs py-2.5 px-3 rounded-xl border-2 font-medium transition ${form.timeline === t ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-green-300'}`}>
              {t}
            </button>
          ))}
        </div>
        {errors.timeline && <p className="text-red-500 text-xs mt-1">{errors.timeline}</p>}
      </div>

      {/* Consent */}
      <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5 text-xs text-gray-500">
        By placing this order you agree that our team may contact you via phone/WhatsApp/email for design consultation. No advance payment is needed at this stage.
      </div>

      <button onClick={handleSubmit} className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-xl transition text-sm shadow-md">
        🎉 Place My AI Design Order
      </button>
    </div>
  );
}
