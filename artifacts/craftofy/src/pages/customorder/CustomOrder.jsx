import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiCamera, FiUpload } from 'react-icons/fi';
import { MdOutlineDesignServices } from 'react-icons/md';

import RoomCapture from './components/RoomCapture';
import RoomDetails from './components/RoomDetails';
import RoomAnalysis from './components/RoomAnalysis';
import DesignEditor from './components/DesignEditor';
import Visualization360 from './components/Visualization360';
import CostEstimator from './components/CostEstimator';
import FinalSummary from './components/FinalSummary';

/* ─── Products ─────────────────────────────────────────────── */
const PRODUCTS = [
  { id: 'bed',           label: 'Bed',                       emoji: '🛏️', base: 12000, category: 'Bedroom' },
  { id: 'wardrobe',      label: 'Wardrobe',                   emoji: '🚪', base: 18000, category: 'Bedroom' },
  { id: 'sofa',          label: 'Sofa',                       emoji: '🛋️', base: 15000, category: 'Living Room' },
  { id: 'dining-table',  label: 'Dining Table',               emoji: '🍽️', base: 14000, category: 'Dining Room' },
  { id: 'study-table',   label: 'Study / Office Table',       emoji: '🖥️', base: 7000,  category: 'Study Room' },
  { id: 'tv-unit',       label: 'TV Unit / Entertainment',    emoji: '📺', base: 9000,  category: 'Living Room' },
  { id: 'bookshelf',     label: 'Bookshelf / Bookcase',       emoji: '📚', base: 6000,  category: 'Study Room' },
  { id: 'shoe-rack',     label: 'Shoe Rack',                  emoji: '👟', base: 3500,  category: 'Entryway' },
  { id: 'dressing',      label: 'Dressing Table / Vanity',    emoji: '🪞', base: 8000,  category: 'Bedroom' },
  { id: 'chest',         label: 'Chest of Drawers',           emoji: '🗄️', base: 7500,  category: 'Bedroom' },
  { id: 'coffee-table',  label: 'Coffee / Centre Table',      emoji: '☕', base: 5000,  category: 'Living Room' },
  { id: 'crockery',      label: 'Crockery / Display Unit',    emoji: '🏺', base: 10000, category: 'Dining Room' },
  { id: 'temple',        label: 'Temple / Pooja Mandir',      emoji: '🪔', base: 8500,  category: 'Religious' },
  { id: 'kids-bed',      label: 'Kids Bed',                   emoji: '🧸', base: 10000, category: 'Kids Room' },
  { id: 'bunk-bed',      label: 'Bunk Bed',                   emoji: '🛏️', base: 16000, category: 'Kids Room' },
  { id: 'side-table',    label: 'Side / Bedside Table',       emoji: '🕯️', base: 3500,  category: 'Bedroom' },
  { id: 'console',       label: 'Console / Hallway Table',    emoji: '🖼️', base: 5000,  category: 'Entryway' },
  { id: 'bench',         label: 'Bench / Ottoman',            emoji: '🪑', base: 5000,  category: 'Living Room' },
  { id: 'kitchen-cab',   label: 'Kitchen Cabinet',            emoji: '🍳', base: 22000, category: 'Kitchen' },
  { id: 'outdoor',       label: 'Outdoor / Garden Set',       emoji: '🌿', base: 13000, category: 'Outdoor' },
];

const CUSTOM_SIZE = { id: 'custom', label: 'Custom Size (Enter Dimensions)', mult: 1.35 };

const SIZES = {
  default:        [{ id: 'sm', label: 'Small',     mult: 0.8 }, { id: 'md', label: 'Standard', mult: 1.0 }, { id: 'lg', label: 'Large', mult: 1.25 }, CUSTOM_SIZE],
  bed:            [{ id: 'single', label: 'Single (3×6 ft)', mult: 0.75 }, { id: 'double', label: 'Double (4×6 ft)', mult: 1.0 }, { id: 'queen', label: 'Queen (5×6.5 ft)', mult: 1.2 }, { id: 'king', label: 'King (6×6.5 ft)', mult: 1.4 }, CUSTOM_SIZE],
  sofa:           [{ id: '1', label: '1 Seater', mult: 0.5 }, { id: '2', label: '2 Seater', mult: 0.75 }, { id: '3', label: '3 Seater', mult: 1.0 }, { id: '3+2', label: '3+2 Set', mult: 1.7 }, { id: 'l', label: 'L-Shape', mult: 1.9 }, CUSTOM_SIZE],
  wardrobe:       [{ id: '2d', label: '2 Door', mult: 0.8 }, { id: '3d', label: '3 Door', mult: 1.0 }, { id: '4d', label: '4 Door', mult: 1.3 }, { id: 'sliding', label: 'Sliding Door', mult: 1.4 }, CUSTOM_SIZE],
  'dining-table': [{ id: '4s', label: '4 Seater', mult: 0.8 }, { id: '6s', label: '6 Seater', mult: 1.0 }, { id: '8s', label: '8 Seater', mult: 1.3 }, { id: '10s', label: '10 Seater', mult: 1.6 }, CUSTOM_SIZE],
  'kitchen-cab':  [{ id: 'small', label: 'Small (upto 6 ft)', mult: 0.7 }, { id: 'medium', label: 'Medium (6–10 ft)', mult: 1.0 }, { id: 'large', label: 'Large (10–15 ft)', mult: 1.4 }, { id: 'modular', label: 'Full Modular Kitchen', mult: 2.0 }, CUSTOM_SIZE],
  'tv-unit':      [{ id: '4ft', label: '4 ft Unit', mult: 0.7 }, { id: '6ft', label: '6 ft Unit', mult: 1.0 }, { id: '8ft', label: '8 ft Unit', mult: 1.3 }, { id: 'wall', label: 'Full Wall Unit', mult: 1.8 }, CUSTOM_SIZE],
  'study-table':  [{ id: 'compact', label: 'Compact (3 ft)', mult: 0.75 }, { id: 'standard', label: 'Standard (4 ft)', mult: 1.0 }, { id: 'large', label: 'Large (5 ft)', mult: 1.25 }, { id: 'l-shape', label: 'L-Shape', mult: 1.6 }, CUSTOM_SIZE],
  'bunk-bed':     [{ id: 'single', label: 'Single-Single', mult: 1.0 }, { id: 'single-double', label: 'Single-Double', mult: 1.2 }, { id: 'with-desk', label: 'With Study Desk', mult: 1.4 }, CUSTOM_SIZE],
  'kids-bed':     [{ id: 'toddler', label: 'Toddler (2×4 ft)', mult: 0.6 }, { id: 'single', label: 'Single (3×6 ft)', mult: 0.85 }, { id: 'themed', label: 'Themed Design', mult: 1.2 }, CUSTOM_SIZE],
  temple:         [{ id: 'wall', label: 'Wall-Mounted', mult: 0.7 }, { id: 'floor', label: 'Floor Standing', mult: 1.0 }, { id: 'cabinet', label: 'Cabinet Style', mult: 1.25 }, CUSTOM_SIZE],
  outdoor:        [{ id: '2s', label: '2-Seater Set', mult: 0.7 }, { id: '4s', label: '4-Seater Set', mult: 1.0 }, { id: '6s', label: '6-Seater Set', mult: 1.4 }, CUSTOM_SIZE],
};

const MATERIALS = [
  { id: 'sheesham', label: 'Sheesham / Rosewood', emoji: '🪵', mult: 1.5,  tier: 'Premium',  desc: 'Premium hardwood — very durable, beautiful grain' },
  { id: 'sagwan',   label: 'Sagwan / Teak',        emoji: '🌳', mult: 1.8,  tier: 'Luxury',   desc: 'Best quality — water-resistant, long-lasting' },
  { id: 'mango',    label: 'Aam / Mango Wood',     emoji: '🥭', mult: 1.0,  tier: 'Standard', desc: 'Budget-friendly, eco-friendly, good finish' },
  { id: 'rubber',   label: 'Rubber Wood',          emoji: '🌿', mult: 0.9,  tier: 'Standard', desc: 'Affordable, smooth texture, termite resistant' },
  { id: 'pine',     label: 'Pine Wood',            emoji: '🌲', mult: 0.8,  tier: 'Budget',   desc: 'Light weight, modern look, easy to move' },
  { id: 'plywood',  label: 'Plywood + Veneer',     emoji: '📋', mult: 0.7,  tier: 'Budget',   desc: 'Cost effective, smooth finish, widely used' },
  { id: 'mdf',      label: 'MDF Board',            emoji: '📦', mult: 0.6,  tier: 'Budget',   desc: 'Great for painted finishes, affordable' },
  { id: 'metal',    label: 'Metal Frame + Wood',   emoji: '⚙️', mult: 1.1,  tier: 'Standard', desc: 'Industrial look, very sturdy structure' },
];

const POLISH_TYPES = [
  { id: 'nc',       label: 'NC Polish (Natural)',   emoji: '✨', mult: 1.0,  desc: 'Clear coat, natural wood look preserved' },
  { id: 'pu',       label: 'PU Polish (Glossy)',    emoji: '💎', mult: 1.15, desc: 'High-gloss, scratch resistant, premium look' },
  { id: 'matte',    label: 'Matte Polish',          emoji: '🎨', mult: 1.0,  desc: 'Subtle, non-reflective, elegant finish' },
  { id: 'walnut',   label: 'Walnut / Dark Stain',   emoji: '🍫', mult: 1.05, desc: 'Rich dark brown tone, luxury appearance' },
  { id: 'white',    label: 'White Paint / Lacquer', emoji: '🤍', mult: 1.1,  desc: 'Clean, modern Scandinavian style' },
  { id: 'laminate', label: 'Laminate / Veneer',     emoji: '🟫', mult: 0.9,  desc: 'Various patterns, durable surface coating' },
  { id: 'distress', label: 'Distressed / Rustic',   emoji: '🪵', mult: 1.05, desc: 'Vintage aged look, trendy & unique' },
  { id: 'color',    label: 'Solid Color Paint',     emoji: '🎨', mult: 0.95, desc: 'Any custom color of your choice' },
];

const EXTRAS = {
  bed:            ['Box Storage Below Bed', 'Hydraulic Lift Storage', 'Side Rails', 'Headboard with Storage', 'Attached Side Tables'],
  sofa:           ['Recliner Mechanism', 'Pull-out Sofa Cum Bed', 'Cup Holders', 'USB Charging Port', 'Removable Covers'],
  wardrobe:       ['Full-Length Mirror Door', 'Dressing Table Section', 'Shoe Rack Section', 'Sliding Doors', 'LED Lighting Inside', 'Lock & Key'],
  'study-table':  ['Bookshelf Hutch on Top', 'CPU/Tower Stand', 'Keyboard Drawer', 'Cable Management', 'Drawer Pedestal'],
  'dining-table': ['Leaf Extension Board', 'Chairs Included', 'Bench Seating', 'Lazy Susan Centre Plate'],
  'kitchen-cab':  ['Soft-Close Drawers', 'Pull-out Baskets', 'Corner Unit', 'Glass Shutters', 'Chimney Space Provision'],
  'tv-unit':      ['Back Panel / Wall Mount', 'Wire Management Box', 'LED Strip Backlight', 'Floating Design', 'Drawer Storage'],
  temple:         ['LED Lighting', 'Bells & Brass Work', 'Marble Platform', 'Storage Drawer', 'Glass Shutters'],
  default:        ['Drawer Storage', 'Adjustable Shelves', 'Caster Wheels / Rollers', 'Anti-tip Hardware', 'Custom Engraving'],
};

function getSizes(pid) { return SIZES[pid] || SIZES.default; }
function getExtras(pid) { return EXTRAS[pid] || EXTRAS.default; }

function calcPrice(state) {
  const prod = PRODUCTS.find(p => p.id === state.product);
  const mat  = MATERIALS.find(m => m.id === state.material);
  const pol  = POLISH_TYPES.find(p => p.id === state.polish);
  const sz   = getSizes(state.product).find(s => s.id === state.size);
  if (!prod || !mat || !pol || !sz) return null;
  const extrasTotal = (state.extras || []).length * 800;
  const raw = prod.base * mat.mult * pol.mult * sz.mult + extrasTotal;
  return Math.round(raw / 100) * 100;
}

/* ─── Manual Wizard ─────────────────────────────────────── */
const MANUAL_STEPS = ['Product', 'Size', 'Material', 'Polish', 'Extras', 'Contact'];

function ManualWizard({ onBack }) {
  const [step, setStep] = useState(0);
  const [state, setStateRaw] = useState({
    product: '', size: '', customL: '', customW: '', customH: '',
    material: '', polish: '', extras: [], notes: '',
    name: '', phone: '', email: '', pincode: '', address: '', timeline: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function set(k, v) { setStateRaw(s => ({ ...s, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); }
  const price = calcPrice(state);
  const selectedProduct = PRODUCTS.find(p => p.id === state.product);
  const selectedSize = getSizes(state.product).find(s => s.id === state.size);

  function next() {
    const e = {};
    if (step === 0 && !state.product) e.product = 'Please select a product';
    if (step === 1) {
      if (!state.size) e.size = 'Please select a size';
      if (state.size === 'custom' && (!state.customL || !state.customW || !state.customH)) e.size = 'Enter all custom dimensions';
    }
    if (step === 2 && !state.material) e.material = 'Please select a material';
    if (step === 3 && !state.polish) e.polish = 'Please select a polish type';
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => Math.min(s + 1, MANUAL_STEPS.length - 1));
  }

  function back() { setStep(s => Math.max(s - 1, 0)); setErrors({}); }

  function submit() {
    const e = {};
    if (!state.name.trim()) e.name = 'Name required';
    if (!/^[0-9]{10}$/.test(state.phone)) e.phone = 'Valid 10-digit number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) e.email = 'Valid email';
    if (!state.timeline) e.timeline = 'Please select timeline';
    if (Object.keys(e).length) { setErrors(e); return; }

    const order = {
      ...state,
      id: Date.now(),
      type: 'Manual',
      estimate: price ? { price } : null,
      productLabel: selectedProduct?.label || 'Custom Furniture',
      productEmoji: selectedProduct?.emoji || '🛋️',
      roomType: state.product,
      currentStep: 'accepted',
      date: new Date().toLocaleDateString('en-IN'),
    };
    const existing = JSON.parse(localStorage.getItem('craftofy_custom_orders') || '[]');
    existing.push(order);
    localStorage.setItem('craftofy_custom_orders', JSON.stringify(existing));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🎉</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
        <p className="text-gray-500 text-sm mb-1">Thank you, <b className="text-green-700">{state.name}</b>!</p>
        <p className="text-gray-400 text-xs mb-5 max-w-xs mx-auto">Our team will call you within 24 hours to confirm your order details and design.</p>
        {price && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5 max-w-xs mx-auto">
            <p className="text-xs text-green-600 font-semibold mb-1">Your Order</p>
            <p className="text-xl font-bold text-gray-800">{selectedProduct?.emoji} {selectedProduct?.label}</p>
            {selectedSize && <p className="text-sm text-gray-500 mt-0.5">{selectedSize.label}</p>}
            <div className="border-t border-green-200 mt-3 pt-3">
              <p className="text-xs text-gray-500">Estimated Price</p>
              <p className="text-2xl font-bold text-green-700">₹{price.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Link to="/my-orders" className="block bg-green-700 text-white font-bold py-3 rounded-xl text-sm">📦 Track My Order</Link>
          <button onClick={onBack} className="border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm hover:bg-gray-50 transition">← Place Another Order</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-3 sm:px-0 pt-4 pb-28 sm:pb-10">
      <button onClick={onBack} className="flex items-center gap-1 text-green-700 text-sm font-semibold mb-4 hover:underline"><FiChevronLeft /> Back</button>

      {/* Step progress */}
      <div className="flex gap-1 mb-6">
        {MANUAL_STEPS.map((s, i) => (
          <div key={i} className="flex-1">
            <div className={`h-1.5 rounded-full transition-all ${i <= step ? 'bg-green-600' : 'bg-gray-200'}`} />
            <p className={`text-[9px] mt-1 font-medium text-center hidden sm:block ${i === step ? 'text-green-600' : 'text-gray-400'}`}>{s}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <h2 className="font-bold text-gray-700 text-sm mb-4">Step {step + 1}: {MANUAL_STEPS[step]}</h2>

        {/* STEP 0: Product */}
        {step === 0 && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRODUCTS.map(p => (
                <button key={p.id} onClick={() => { set('product', p.id); set('size', ''); set('extras', []); }}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition text-left ${state.product === p.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                  <span className="text-xl shrink-0">{p.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{p.label}</p>
                    <p className="text-[10px] text-gray-400">from ₹{p.base.toLocaleString('en-IN')}</p>
                  </div>
                </button>
              ))}
            </div>
            {errors.product && <p className="text-red-500 text-xs mt-2">{errors.product}</p>}
          </div>
        )}

        {/* STEP 1: Size */}
        {step === 1 && (
          <div>
            <div className="flex flex-col gap-2">
              {getSizes(state.product).map(sz => (
                <button key={sz.id} onClick={() => set('size', sz.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition ${state.size === sz.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                  <span className="text-sm font-semibold text-gray-800">{sz.label}</span>
                  {selectedProduct && <span className="text-xs text-amber-600 font-bold">₹{Math.round(selectedProduct.base * sz.mult).toLocaleString('en-IN')}+</span>}
                </button>
              ))}
            </div>
            {state.size === 'custom' && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[['customL','Length (cm)'],['customW','Width (cm)'],['customH','Height (cm)']].map(([k, lbl]) => (
                  <div key={k}>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">{lbl}</label>
                    <input type="number" value={state[k]} onChange={e => set(k, e.target.value)} placeholder="e.g. 180"
                      className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
                  </div>
                ))}
              </div>
            )}
            {errors.size && <p className="text-red-500 text-xs mt-2">{errors.size}</p>}
          </div>
        )}

        {/* STEP 2: Material */}
        {step === 2 && (
          <div className="flex flex-col gap-2">
            {MATERIALS.map(m => (
              <button key={m.id} onClick={() => set('material', m.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition text-left ${state.material === m.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                <span className="text-2xl shrink-0">{m.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">{m.label}</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${m.tier === 'Luxury' ? 'bg-amber-100 text-amber-700' : m.tier === 'Premium' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{m.tier}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                </div>
                {price !== null && state.material === m.id && <span className="text-sm font-bold text-green-700 shrink-0">₹{price.toLocaleString('en-IN')}</span>}
              </button>
            ))}
            {errors.material && <p className="text-red-500 text-xs mt-2">{errors.material}</p>}
          </div>
        )}

        {/* STEP 3: Polish */}
        {step === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {POLISH_TYPES.map(p => (
              <button key={p.id} onClick={() => set('polish', p.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition text-left ${state.polish === p.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                <span className="text-xl shrink-0">{p.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{p.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{p.desc}</p>
                </div>
              </button>
            ))}
            {errors.polish && <p className="text-red-500 text-xs mt-2">{errors.polish}</p>}
          </div>
        )}

        {/* STEP 4: Extras */}
        {step === 4 && (
          <div>
            <p className="text-xs text-gray-500 mb-3">Select optional add-ons (each +₹800):</p>
            <div className="flex flex-col gap-2">
              {getExtras(state.product).map(e => (
                <button key={e} onClick={() => {
                  const cur = state.extras;
                  set('extras', cur.includes(e) ? cur.filter(x => x !== e) : [...cur, e]);
                }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition text-left ${state.extras.includes(e) ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${state.extras.includes(e) ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                    {state.extras.includes(e) && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="text-sm text-gray-800 font-medium">{e}</span>
                  <span className="ml-auto text-xs text-amber-600 font-semibold shrink-0">+₹800</span>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Special Instructions (optional)</label>
              <textarea value={state.notes} onChange={e => set('notes', e.target.value)} rows={3}
                placeholder="Any special requests, reference images info, room dimensions, color preferences..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"/>
            </div>
          </div>
        )}

        {/* STEP 5: Contact */}
        {step === 5 && (
          <div>
            {price && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 font-semibold">Estimated Price</p>
                  <p className="text-xl font-bold text-green-700">₹{price.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>{MATERIALS.find(m => m.id === state.material)?.label}</p>
                  <p>{POLISH_TYPES.find(p => p.id === state.polish)?.label}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { k: 'name', lbl: 'Full Name *', ph: 'Ramesh Sharma', type: 'text' },
                { k: 'phone', lbl: 'Mobile Number *', ph: '9876543210', type: 'tel' },
                { k: 'email', lbl: 'Email *', ph: 'you@example.com', type: 'email' },
                { k: 'pincode', lbl: 'Pincode', ph: '110001', type: 'text' },
              ].map(f => (
                <div key={f.k}>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">{f.lbl}</label>
                  <input type={f.type} value={state[f.k]} onChange={e => set(f.k, e.target.value)} placeholder={f.ph}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors[f.k] ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}/>
                  {errors[f.k] && <p className="text-red-500 text-xs mt-1">{errors[f.k]}</p>}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Delivery Address</label>
              <textarea value={state.address} onChange={e => set('address', e.target.value)} rows={2}
                placeholder="Flat / House no, Street, City, State..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"/>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">When do you need it? *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Within 2 weeks', '2–4 weeks', '1–2 months', '2–3 months', 'Above 3 months', 'Flexible'].map(t => (
                  <button key={t} onClick={() => set('timeline', t)}
                    className={`text-xs py-2.5 px-3 rounded-xl border-2 font-medium transition ${state.timeline === t ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-green-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
              {errors.timeline && <p className="text-red-500 text-xs mt-2">{errors.timeline}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={back} className="flex items-center gap-1 border-2 border-gray-200 text-gray-600 font-semibold px-5 py-3 rounded-xl hover:bg-gray-50 transition text-sm"><FiChevronLeft /> Back</button>
        )}
        {step < MANUAL_STEPS.length - 1 ? (
          <button onClick={next} className="flex-1 flex items-center justify-center gap-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition text-sm">Next <FiChevronRight /></button>
        ) : (
          <button onClick={submit} className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition text-sm shadow-md">✉️ Place Custom Order</button>
        )}
      </div>

      {/* Mini summary bar */}
      {step > 0 && (
        <div className="mt-4 bg-gray-50 rounded-xl px-4 py-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {selectedProduct && <span>{selectedProduct.emoji} {selectedProduct.label}</span>}
          {state.size && state.size !== 'custom' && <span>📐 {selectedSize?.label}</span>}
          {state.material && <span>🪵 {MATERIALS.find(m => m.id === state.material)?.label}</span>}
          {state.polish && <span>✨ {POLISH_TYPES.find(p => p.id === state.polish)?.label}</span>}
          {state.extras.length > 0 && <span>➕ {state.extras.length} extra{state.extras.length !== 1 ? 's' : ''}</span>}
          {price && <span className="text-green-700 font-bold">₹{price.toLocaleString('en-IN')}</span>}
        </div>
      )}
    </div>
  );
}

/* ─── AI Scanner — 7-step flow ─────────────────────────── */
const AI_STEPS = [
  { id: 'capture',  label: 'Capture Room',    icon: '📷' },
  { id: 'details',  label: 'Room Details',    icon: '📐' },
  { id: 'analysis', label: 'AI Analysis',     icon: '🤖' },
  { id: 'editor',   label: 'Design Editor',   icon: '🗺️' },
  { id: 'viz',      label: '3D View',         icon: '🏗️' },
  { id: 'cost',     label: 'Cost Estimate',   icon: '💰' },
  { id: 'summary',  label: 'Final Summary',   icon: '📋' },
];

const STORAGE_KEY = 'craftofy_ai_scanner_data';

function AiScanner({ onBack }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  });

  function updateData(updater) {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function goNext() {
    setStep(s => Math.min(s + 1, AI_STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    if (step === 0) { onBack(); return; }
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const currentStepId = AI_STEPS[step].id;

  return (
    <div className="max-w-lg mx-auto px-3 sm:px-0 pt-4 pb-28 sm:pb-10">
      <button onClick={goBack} className="flex items-center gap-1 text-green-700 text-sm font-semibold mb-4 hover:underline"><FiChevronLeft /> Back</button>

      {/* Step progress */}
      <div className="flex gap-1 mb-1">
        {AI_STEPS.map((s, i) => (
          <div key={i} className="flex-1">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'bg-green-600' : 'bg-gray-200'}`} />
          </div>
        ))}
      </div>
      <div className="flex justify-between mb-5">
        <p className="text-xs text-gray-400">Step {step + 1} of {AI_STEPS.length}</p>
        <p className="text-xs font-bold text-green-700">{AI_STEPS[step].icon} {AI_STEPS[step].label}</p>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        {currentStepId === 'capture'  && <RoomCapture  onNext={goNext} data={data} setData={updateData} />}
        {currentStepId === 'details'  && <RoomDetails  onNext={goNext} data={data} setData={updateData} />}
        {currentStepId === 'analysis' && <RoomAnalysis onNext={goNext} data={data} setData={updateData} />}
        {currentStepId === 'editor'   && <DesignEditor onNext={goNext} data={data} setData={updateData} />}
        {currentStepId === 'viz'      && <Visualization360 onNext={goNext} data={data} setData={updateData} />}
        {currentStepId === 'cost'     && <CostEstimator  onNext={goNext} data={data} setData={updateData} />}
        {currentStepId === 'summary'  && <FinalSummary onBack={onBack} data={data} />}
      </div>

      {/* Step bubbles */}
      <div className="flex justify-center gap-2 mt-5">
        {AI_STEPS.map((s, i) => (
          <button key={i} onClick={() => i < step && setStep(i)}
            disabled={i > step}
            className={`flex flex-col items-center gap-0.5 transition ${i > step ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
            title={s.label}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition ${i < step ? 'bg-green-600 text-white' : i === step ? 'bg-green-700 text-white ring-2 ring-green-300' : 'bg-gray-200 text-gray-400'}`}>
              {i < step ? '✓' : s.icon}
            </div>
            <span className={`text-[9px] font-medium ${i === step ? 'text-green-700' : 'text-gray-400'}`}>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Entry ─────────────────────────────────────────── */
function CustomOrder() {
  const [mode, setMode] = useState('landing');
  if (mode === 'ai') return <AiScanner onBack={() => setMode('landing')} />;
  if (mode === 'manual') return <ManualWizard onBack={() => setMode('landing')} />;

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 pt-4 pb-28 sm:pb-10">
      <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl p-5 sm:p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <MdOutlineDesignServices className="text-3xl text-amber-300 shrink-0" />
          <div>
            <h1 className="text-xl font-bold">Custom Order</h1>
            <p className="text-green-200 text-sm">Build your dream interior — handcrafted for you</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {['Free Design Consultation', 'Expert Craftsmen', 'Pan-India Delivery'].map(t => (
            <span key={t} className="bg-white/20 text-xs font-medium rounded-full px-2.5 py-1">✓ {t}</span>
          ))}
        </div>
      </div>

      <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Choose how to get started</p>

      <div className="flex flex-col gap-4">
        <button onClick={() => setMode('ai')}
          className="bg-white border-2 border-gray-100 hover:border-green-400 rounded-2xl p-5 text-left transition shadow-sm hover:shadow-md group">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-100 transition">
              <span className="text-3xl">📷</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-800">AI Room Scanner</h3>
                <span className="text-[10px] bg-amber-400 text-gray-900 font-bold px-2 py-0.5 rounded-full">NEW ✨</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Capture your room → AI analyses the space → Design in 2D/3D → Get instant cost estimate → Place order
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['7-Step Flow', '2D Editor', '3D Visualization', 'AI Cost Estimate'].map(t => (
                  <span key={t} className="text-[10px] bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 font-medium">{t}</span>
                ))}
              </div>
            </div>
            <FiChevronRight className="text-gray-300 group-hover:text-green-600 transition text-xl shrink-0 mt-1" />
          </div>
        </button>

        <button onClick={() => setMode('manual')}
          className="bg-white border-2 border-gray-100 hover:border-green-400 rounded-2xl p-5 text-left transition shadow-sm hover:shadow-md group">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition">
              <span className="text-3xl">✏️</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">Custom Order Form</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Choose your product, size, wood type, polish finish & extras — get an instant price estimate and place your order in minutes
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['20+ Products', '8 Wood Types', 'Instant Price'].map(t => (
                  <span key={t} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 font-medium">{t}</span>
                ))}
              </div>
            </div>
            <FiChevronRight className="text-gray-300 group-hover:text-green-600 transition text-xl shrink-0 mt-1" />
          </div>
        </button>
      </div>

      <div className="mt-5 bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between border border-gray-100">
        <div>
          <p className="text-sm font-semibold text-gray-700">Already placed an order?</p>
          <p className="text-xs text-gray-400">Track your order status step by step</p>
        </div>
        <Link to="/my-orders" className="bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap">My Orders →</Link>
      </div>
    </div>
  );
}

export default CustomOrder;
