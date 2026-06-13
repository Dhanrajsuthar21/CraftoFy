import React from 'react';

const ROOM_TYPES = [
  { id: 'living', label: 'Living Room', emoji: '🛋️' },
  { id: 'bedroom', label: 'Bedroom', emoji: '🛏️' },
  { id: 'dining', label: 'Dining Room', emoji: '🍽️' },
  { id: 'study', label: 'Study / Office', emoji: '📚' },
  { id: 'kids', label: 'Kids Room', emoji: '🧸' },
  { id: 'kitchen', label: 'Kitchen', emoji: '🍳' },
  { id: 'pooja', label: 'Pooja Room', emoji: '🪔' },
  { id: 'outdoor', label: 'Outdoor', emoji: '🌿' },
];

const STYLES = [
  { id: 'modern', label: 'Modern', desc: 'Clean lines, minimal' },
  { id: 'classic', label: 'Classic', desc: 'Timeless, ornate' },
  { id: 'scandinavian', label: 'Scandinavian', desc: 'Light, functional' },
  { id: 'industrial', label: 'Industrial', desc: 'Raw, urban' },
  { id: 'bohemian', label: 'Bohemian', desc: 'Eclectic, colorful' },
  { id: 'royal', label: 'Royal Indian', desc: 'Rich, ornamental' },
];

const BUDGETS = [
  { id: 'budget', label: 'Budget', range: '₹15K–30K' },
  { id: 'mid', label: 'Mid-Range', range: '₹30K–75K' },
  { id: 'premium', label: 'Premium', range: '₹75K–1.5L' },
  { id: 'luxury', label: 'Luxury', range: '₹1.5L+' },
];

function RoomDetails({ onNext, data, setData }) {
  function set(key, val) { setData(d => ({ ...d, [key]: val })); }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">📐</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Room Details</h2>
        <p className="text-sm text-gray-500 mt-1">Help our AI understand your space better (optional but recommended)</p>
      </div>

      <div className="space-y-5">
        {/* Room type */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2.5 block">Room Type *</label>
          <div className="grid grid-cols-4 gap-2">
            {ROOM_TYPES.map(r => (
              <button key={r.id} onClick={() => set('roomType', r.id)}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 transition text-center ${data.roomType === r.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                <span className="text-2xl">{r.emoji}</span>
                <span className="text-[10px] font-semibold text-gray-700 leading-tight">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2.5 block">Room Dimensions (in feet)</label>
          <div className="grid grid-cols-3 gap-3">
            {[['length','Length','e.g. 15'],['width','Width','e.g. 12'],['height','Height','e.g. 10']].map(([k,lbl,ph]) => (
              <div key={k}>
                <label className="text-xs text-gray-500 mb-1 block">{lbl}</label>
                <input type="number" placeholder={ph} value={data[k] || ''} onChange={e => set(k, e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
              </div>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2.5 block">Preferred Style</label>
          <div className="grid grid-cols-3 gap-2">
            {STYLES.map(s => (
              <button key={s.id} onClick={() => set('style', s.id)}
                className={`p-3 rounded-xl border-2 text-left transition ${data.style === s.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                <p className="text-xs font-bold text-gray-800">{s.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2.5 block">Budget Range</label>
          <div className="grid grid-cols-2 gap-2">
            {BUDGETS.map(b => (
              <button key={b.id} onClick={() => set('budget', b.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition ${data.budget === b.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                <span className="text-sm font-semibold text-gray-800">{b.label}</span>
                <span className="text-xs text-amber-600 font-bold">{b.range}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color pref */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">Color Preferences</label>
          <input type="text" placeholder="e.g. Warm browns, cream walls, natural tones..."
            value={data.colorPref || ''} onChange={e => set('colorPref', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
        </div>
      </div>

      <button
        onClick={() => onNext()}
        disabled={!data.roomType}
        className="mt-6 w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition text-sm"
      >
        Continue to AI Analysis →
      </button>
    </div>
  );
}

export default RoomDetails;
