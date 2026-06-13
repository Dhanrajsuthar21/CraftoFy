import React from 'react';

const ROOM_TYPES = [
  { id:'living',   label:'Living Room',   emoji:'🛋️' },
  { id:'bedroom',  label:'Bedroom',       emoji:'🛏️' },
  { id:'dining',   label:'Dining Room',   emoji:'🍽️' },
  { id:'study',    label:'Study / Office',emoji:'📚' },
  { id:'kids',     label:'Kids Room',     emoji:'🧸' },
  { id:'kitchen',  label:'Kitchen',       emoji:'🍳' },
  { id:'pooja',    label:'Pooja Room',    emoji:'🪔' },
  { id:'outdoor',  label:'Outdoor',       emoji:'🌿' },
];

const BUDGETS = [
  { id:'budget',  label:'Budget',    range:'₹15K–30K'  },
  { id:'mid',     label:'Mid-Range', range:'₹30K–75K'  },
  { id:'premium', label:'Premium',   range:'₹75K–1.5L' },
  { id:'luxury',  label:'Luxury',    range:'₹1.5L+'    },
];

export default function RoomDetails({ onNext, data, setData }) {
  function set(key, val) { setData(d => ({ ...d, [key]: val })); }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">📐</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Room Details</h2>
        <p className="text-sm text-gray-500 mt-1">All fields are optional — fill what you know, skip the rest</p>
      </div>

      <div className="space-y-5">
        {/* Room type — optional */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-sm font-bold text-gray-700">Room Type</label>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Optional — AI can auto-detect</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ROOM_TYPES.map(r => (
              <button
                key={r.id}
                onClick={() => set('roomType', data.roomType === r.id ? '' : r.id)}
                className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 transition text-center ${
                  data.roomType === r.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <span className="text-2xl">{r.emoji}</span>
                <span className="text-[10px] font-semibold text-gray-700 leading-tight">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2.5 block">
            Room Dimensions <span className="text-gray-400 font-normal">(in feet, optional)</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[['length','Length','e.g. 15'],['width','Width','e.g. 12'],['height','Height','e.g. 10']].map(([k,lbl,ph]) => (
              <div key={k}>
                <label className="text-xs text-gray-500 mb-1 block">{lbl}</label>
                <input
                  type="number"
                  placeholder={ph}
                  value={data[k] || ''}
                  onChange={e => set(k, e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Budget — optional */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2.5 block">
            Budget Range <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {BUDGETS.map(b => (
              <button
                key={b.id}
                onClick={() => set('budget', data.budget === b.id ? '' : b.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition ${
                  data.budget === b.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <span className="text-sm font-semibold text-gray-800">{b.label}</span>
                <span className="text-xs text-amber-600 font-bold">{b.range}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color prefs */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1 block">
            Color Preferences <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Warm browns, cream walls, natural tones..."
            value={data.colorPref || ''}
            onChange={e => set('colorPref', e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Skip or Continue */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onNext()}
          className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition text-sm"
        >
          Skip →
        </button>
        <button
          onClick={() => onNext()}
          className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition text-sm"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
