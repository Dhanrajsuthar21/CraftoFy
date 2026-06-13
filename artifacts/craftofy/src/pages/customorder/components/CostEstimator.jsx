import React, { useState } from 'react';

const ROOM_LABELS = { living:'Living Room', bedroom:'Bedroom', dining:'Dining Room', study:'Study / Office', kids:'Kids Room', kitchen:'Kitchen', pooja:'Pooja Room', outdoor:'Outdoor' };
const STYLE_LABELS = { modern:'Modern', classic:'Classic', scandinavian:'Scandinavian', industrial:'Industrial', bohemian:'Bohemian', royal:'Royal Indian' };

const BASE_FURNITURE_COSTS = {
  sofa: 18000, bed: 22000, wardrobe: 24000, 'tv-unit': 12000,
  'dining-table': 15000, chair: 4500, dresser: 9000, nightstand: 3500,
  bookshelf: 6000, 'study-table': 8000, 'coffee': 5000, 'side-table': 3000,
  armchair: 7000, lamp: 2500, table: 6000, shelf: 5000,
  default: 6000,
};

const MATERIAL_MULTS = { sheesham: 1.5, sagwan: 1.8, mango: 1.0, rubber: 0.9, pine: 0.8, plywood: 0.7, mdf: 0.6, metal: 1.1 };
const MATERIAL_LABELS = { sheesham:'Sheesham Wood', sagwan:'Teak Wood', mango:'Mango Wood', rubber:'Rubber Wood', pine:'Pine Wood', plywood:'Plywood + Veneer', mdf:'MDF Board', metal:'Metal Frame' };

const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    emoji: '🪵',
    desc: 'Essential furniture, standard finish',
    priceMult: 0.8,
    features: ['Standard wood quality','Basic polish','Standard sizes','6-month warranty','Free delivery'],
    color: 'border-gray-200',
    badge: '',
  },
  {
    id: 'premium',
    name: 'Premium',
    emoji: '⭐',
    desc: 'Quality materials, premium finish',
    priceMult: 1.0,
    features: ['Premium hardwood','PU/NC polish','Customised sizes','1-year warranty','Free delivery + assembly','Priority support'],
    color: 'border-green-500',
    badge: 'Most Popular',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    emoji: '💎',
    desc: 'Best materials, luxury craftsmanship',
    priceMult: 1.5,
    features: ['Teak / Sheesham wood','Handcrafted polish','Bespoke design','3-year warranty','White glove delivery','Dedicated designer','3D mockup before production'],
    color: 'border-amber-500',
    badge: 'Best Quality',
  },
];

const BUDGET_MULTS = { budget: 0.7, mid: 1.0, premium: 1.3, luxury: 1.8 };

function CostEstimator({ onNext, data, setData }) {
  const [selectedPkg, setSelectedPkg] = useState(data.selectedPackage || 'premium');

  const placed = data.placedFurniture || [];
  const matMult = MATERIAL_MULTS[data.material] || 1.0;
  const budgetMult = BUDGET_MULTS[data.budget] || 1.0;
  const pkgMult = PACKAGES.find(p => p.id === selectedPkg)?.priceMult || 1.0;

  const lineItems = placed.length > 0
    ? placed.map(item => {
        const base = BASE_FURNITURE_COSTS[item.id] || BASE_FURNITURE_COSTS.default;
        return { ...item, unitCost: Math.round(base * matMult * budgetMult) };
      })
    : [
        { id: 'sofa', emoji: '🛋️', label: 'Sofa (3-seater)', unitCost: Math.round(18000 * matMult * budgetMult) },
        { id: 'coffee', emoji: '🪵', label: 'Coffee Table', unitCost: Math.round(5000 * matMult * budgetMult) },
        { id: 'tv-unit', emoji: '📺', label: 'TV Unit', unitCost: Math.round(12000 * matMult * budgetMult) },
      ];

  const subtotal = lineItems.reduce((s, i) => s + i.unitCost, 0);
  const designFee = Math.round(subtotal * 0.05);
  const installFee = Math.round(subtotal * 0.03);
  const pkgTotal = Math.round((subtotal + designFee + installFee) * pkgMult);
  const gst = Math.round(pkgTotal * 0.12);
  const grand = pkgTotal + gst;

  const roomLabel = ROOM_LABELS[data.roomType] || 'Room';
  const styleLabel = STYLE_LABELS[data.style] || '';
  const matLabel = MATERIAL_LABELS[data.material] || 'Standard';

  function handleNext() {
    const estimate = { price: grand, subtotal, gst, package: selectedPkg };
    setData(d => ({ ...d, selectedPackage: selectedPkg, estimate }));
    onNext();
  }

  return (
    <div>
      <div className="text-center mb-5">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">💰</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Cost Estimate</h2>
        <p className="text-sm text-gray-500 mt-1">AI-generated price breakdown for your {roomLabel}</p>
      </div>

      {/* Room summary chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">🏠 {roomLabel}</span>
        {styleLabel && <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-1 rounded-full">🎨 {styleLabel}</span>}
        <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full">🪵 {matLabel}</span>
      </div>

      {/* Package selector */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-700 mb-2.5">Choose Package</p>
        <div className="grid grid-cols-3 gap-2">
          {PACKAGES.map(pkg => (
            <button key={pkg.id} onClick={() => setSelectedPkg(pkg.id)}
              className={`relative p-3 rounded-2xl border-2 text-left transition ${selectedPkg === pkg.id ? pkg.color + ' bg-gray-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
              {pkg.badge && (
                <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${pkg.id === 'premium' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'}`}>
                  {pkg.badge}
                </span>
              )}
              <div className="text-xl mb-1">{pkg.emoji}</div>
              <p className="text-xs font-bold text-gray-800">{pkg.name}</p>
              <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">{pkg.desc}</p>
              <p className="text-xs font-bold text-green-700 mt-1">
                ₹{grand.toLocaleString('en-IN')}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Line item breakdown */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-4">
        <p className="text-xs font-bold text-gray-700 mb-3">📋 Item-wise Breakdown</p>
        <div className="space-y-2">
          {lineItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{item.emoji}</span>
                <span className="text-xs text-gray-700">{item.label}</span>
              </div>
              <span className="text-xs font-bold text-gray-800">₹{item.unitCost.toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="border-t border-dashed border-gray-200 my-2 pt-2 space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Furniture Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Design Fee (5%)</span>
              <span>₹{designFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Installation (3%)</span>
              <span>₹{installFee.toLocaleString('en-IN')}</span>
            </div>
            {selectedPkg !== 'basic' && (
              <div className="flex justify-between text-xs text-gray-500">
                <span>{selectedPkg === 'luxury' ? 'Luxury' : 'Premium'} Upgrade</span>
                <span>+{Math.round((pkgMult - 1) * 100)}%</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-gray-500">
              <span>GST (12%)</span>
              <span>₹{gst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 mt-1">
              <span className="text-sm">Total Estimate</span>
              <span className="text-base text-green-700">₹{grand.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Package features */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <p className="text-xs font-bold text-gray-700 mb-2">✅ Included in {PACKAGES.find(p => p.id === selectedPkg)?.name} Package</p>
        <div className="grid grid-cols-2 gap-1">
          {PACKAGES.find(p => p.id === selectedPkg)?.features.map((f, i) => (
            <p key={i} className="text-xs text-gray-600 flex items-center gap-1">
              <span className="text-green-500 shrink-0">✓</span> {f}
            </p>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
        <p className="text-xs text-amber-700">
          ⚠️ <b>Note:</b> This is an AI estimate. Final price is confirmed after a free consultation call with our designer.
        </p>
      </div>

      <button onClick={handleNext} className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition text-sm">
        Proceed to Final Summary →
      </button>
    </div>
  );
}

export default CostEstimator;
