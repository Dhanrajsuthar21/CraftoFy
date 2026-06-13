import React, { useState } from 'react';

const ROOM_TYPES_MAP = {
  living:'Living Room', bedroom:'Bedroom', dining:'Dining Room',
  study:'Study / Office', kids:'Kids Room', kitchen:'Kitchen',
  pooja:'Pooja Room', outdoor:'Outdoor',
};
const STYLES_MAP = {
  modern:'Modern', classic:'Classic', scandinavian:'Scandinavian',
  industrial:'Industrial', bohemian:'Bohemian', royal:'Royal Indian',
};

const FURNITURE_CATALOG = {
  living: [
    { id:'sofa',       label:'Sofa',          emoji:'🛋️' },
    { id:'coffee',     label:'Coffee Table',  emoji:'☕' },
    { id:'tv-unit',    label:'TV Unit',       emoji:'📺' },
    { id:'armchair',   label:'Armchair',      emoji:'🪑' },
    { id:'bookshelf',  label:'Bookshelf',     emoji:'📚' },
    { id:'lamp',       label:'Floor Lamp',    emoji:'💡' },
    { id:'side-table', label:'Side Table',    emoji:'🕯️' },
  ],
  bedroom: [
    { id:'bed',        label:'Double Bed',    emoji:'🛏️' },
    { id:'wardrobe',   label:'Wardrobe',      emoji:'🚪' },
    { id:'dresser',    label:'Dresser',       emoji:'🪞' },
    { id:'nightstand', label:'Nightstand',    emoji:'🕯️' },
    { id:'lamp',       label:'Floor Lamp',    emoji:'💡' },
  ],
  dining: [
    { id:'dining-table',label:'Dining Table', emoji:'🍽️' },
    { id:'sideboard',  label:'Sideboard',     emoji:'🗄️' },
    { id:'display',    label:'Display Cabinet',emoji:'🏺' },
  ],
  study: [
    { id:'study-table',label:'Study Table',  emoji:'🖥️' },
    { id:'bookshelf',  label:'Bookshelf',    emoji:'📚' },
    { id:'lamp',       label:'Floor Lamp',   emoji:'💡' },
  ],
  kids: [
    { id:'kids-bed',   label:'Kids Bed',     emoji:'🧸' },
    { id:'bookshelf',  label:'Bookshelf',    emoji:'📚' },
    { id:'lamp',       label:'Lamp',         emoji:'💡' },
  ],
  default: [
    { id:'table',      label:'Table',        emoji:'🪵' },
    { id:'chair',      label:'Chair',        emoji:'🪑' },
    { id:'lamp',       label:'Floor Lamp',   emoji:'💡' },
    { id:'bookshelf',  label:'Bookshelf',    emoji:'📚' },
  ],
};

const COLOR_PALETTES = [
  { id:'warm',  label:'Warm Earthy',   colors:['#C4A882','#8B6F47','#E8DCC8','#5C4033'] },
  { id:'cool',  label:'Cool Blues',    colors:['#B8D4E8','#6B9EBF','#E8F4FF','#2C5F7A'] },
  { id:'green', label:'Natural Green', colors:['#8FAF8F','#4A7C59','#E8F5E9','#2D5A3D'] },
  { id:'mono',  label:'Monochrome',    colors:['#E5E5E5','#9E9E9E','#FFFFFF','#424242'] },
  { id:'royal', label:'Royal Gold',    colors:['#C9A227','#8B6914','#FFF8E7','#4A3600'] },
];

const STYLES = [
  { id:'modern',       label:'Modern',       desc:'Clean & minimal' },
  { id:'classic',      label:'Classic',      desc:'Timeless & ornate' },
  { id:'scandinavian', label:'Scandinavian', desc:'Light & functional' },
  { id:'industrial',   label:'Industrial',   desc:'Raw & urban' },
  { id:'bohemian',     label:'Bohemian',     desc:'Eclectic & colorful' },
  { id:'royal',        label:'Royal Indian', desc:'Rich & ornamental' },
];

export default function DesignEditor({ onNext, data, setData }) {
  const roomType = data.roomType || 'living';
  const available = FURNITURE_CATALOG[roomType] || FURNITURE_CATALOG.default;

  const [selected, setSelected] = useState(() => {
    if (data.placedFurniture?.length) return data.placedFurniture.map(f => f.id);
    return available.slice(0, 3).map(f => f.id);
  });
  const [palette, setPalette] = useState(data.palette || 'warm');
  const [style, setStyle] = useState(data.style || 'modern');

  function toggle(id) {
    setSelected(cur => cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]);
  }

  function handleNext() {
    const roomW = parseFloat(data.length) || 15;
    const roomH = parseFloat(data.width)  || 12;
    const scale = 0.3;
    const spacingX = roomW / (selected.length + 1);

    const placed = selected.map((id, i) => {
      const item = available.find(a => a.id === id) || { id, label: id, emoji:'🪑', w:1.5, h:1 };
      return {
        ...item,
        w: item.w || 1.5,
        h: item.h || 1.0,
        x: spacingX * (i + 1) - (item.w || 1.5) / 2,
        y: roomH * 0.3,
      };
    });

    setData(d => ({ ...d, placedFurniture: placed, palette, style }));
    onNext();
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-5">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">🎨</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Furniture & Style</h2>
        <p className="text-sm text-gray-500 mt-1">
          Choose furniture for your {ROOM_TYPES_MAP[roomType] || 'room'} and pick a color palette
        </p>
      </div>

      {/* Room info chips */}
      <div className="flex gap-2 flex-wrap mb-5">
        <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">🏠 {ROOM_TYPES_MAP[roomType]}</span>
        <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full">
          📐 {parseFloat(data.length)||15} × {parseFloat(data.width)||12} ft
        </span>
      </div>

      {/* Furniture selector */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-sm font-bold text-gray-700">Select Furniture</p>
          <span className="text-xs text-gray-400">{selected.length} selected</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {available.map(item => {
            const isOn = selected.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition text-left ${
                  isOn ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300 bg-white'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm transition ${isOn ? 'bg-green-600' : 'bg-gray-100'}`}>
                  {isOn ? <span className="text-white text-xs font-bold">✓</span> : item.emoji}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Style selector */}
      <div className="mb-5">
        <p className="text-sm font-bold text-gray-700 mb-2.5">Interior Style</p>
        <div className="grid grid-cols-3 gap-2">
          {STYLES.map(s => (
            <button key={s.id} onClick={() => setStyle(s.id)}
              className={`p-3 rounded-xl border-2 text-left transition ${style === s.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
              <p className="text-xs font-bold text-gray-800">{s.label}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color palette selector */}
      <div className="mb-6">
        <p className="text-sm font-bold text-gray-700 mb-2.5">Color Palette</p>
        <div className="space-y-2">
          {COLOR_PALETTES.map(p => (
            <button
              key={p.id}
              onClick={() => setPalette(p.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition ${palette === p.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300 bg-white'}`}
            >
              {/* Color swatches */}
              <div className="flex gap-1.5 shrink-0">
                {p.colors.map((c, i) => (
                  <div key={i} className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ background: c }} />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-800">{p.label}</span>
              {palette === p.id && <span className="ml-auto text-green-600 text-sm font-bold">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Preview of 3D hint */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
        <span className="text-2xl">🏗️</span>
        <div>
          <p className="text-sm font-bold text-indigo-700">Ready to see in 3D!</p>
          <p className="text-xs text-gray-500">{selected.length} furniture pieces · <span className="capitalize">{palette}</span> palette → Immersive 360° view next</p>
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={selected.length === 0}
        className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition text-sm"
      >
        Enter 3D Room →
      </button>
    </div>
  );
}
