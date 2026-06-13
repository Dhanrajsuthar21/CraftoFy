import React, { useState, useRef } from 'react';

const ROOM_TYPES_MAP = { living:'Living Room', bedroom:'Bedroom', dining:'Dining Room', study:'Study / Office', kids:'Kids Room', kitchen:'Kitchen', pooja:'Pooja Room', outdoor:'Outdoor' };
const STYLES_MAP = { modern:'Modern', classic:'Classic', scandinavian:'Scandinavian', industrial:'Industrial', bohemian:'Bohemian', royal:'Royal Indian' };

const FURNITURE_ITEMS = {
  living: [
    { id: 'sofa', label: 'Sofa', emoji: '🛋️', w: 3, h: 1.5 },
    { id: 'coffee', label: 'Coffee Table', emoji: '🪵', w: 1.5, h: 1 },
    { id: 'tv-unit', label: 'TV Unit', emoji: '📺', w: 2.5, h: 0.8 },
    { id: 'armchair', label: 'Arm Chair', emoji: '🪑', w: 1, h: 1 },
    { id: 'bookshelf', label: 'Bookshelf', emoji: '📚', w: 1, h: 0.4 },
    { id: 'side-table', label: 'Side Table', emoji: '🕯️', w: 0.8, h: 0.8 },
  ],
  bedroom: [
    { id: 'bed', label: 'Double Bed', emoji: '🛏️', w: 2.5, h: 2 },
    { id: 'wardrobe', label: 'Wardrobe', emoji: '🚪', w: 2, h: 0.7 },
    { id: 'dresser', label: 'Dresser', emoji: '🪞', w: 1.2, h: 0.5 },
    { id: 'nightstand', label: 'Nightstand', emoji: '🕯️', w: 0.6, h: 0.5 },
    { id: 'study-table', label: 'Study Table', emoji: '🖥️', w: 1.5, h: 0.7 },
  ],
  dining: [
    { id: 'dining-table', label: 'Dining Table', emoji: '🍽️', w: 2.5, h: 1.2 },
    { id: 'chair1', label: 'Chair ×1', emoji: '🪑', w: 0.6, h: 0.6 },
    { id: 'sideboard', label: 'Sideboard', emoji: '🗄️', w: 2, h: 0.5 },
    { id: 'display', label: 'Display Cabinet', emoji: '🏺', w: 1, h: 0.5 },
  ],
  default: [
    { id: 'table', label: 'Table', emoji: '🪵', w: 1.5, h: 1 },
    { id: 'chair', label: 'Chair', emoji: '🪑', w: 0.8, h: 0.8 },
    { id: 'shelf', label: 'Shelf', emoji: '📚', w: 1.5, h: 0.4 },
    { id: 'lamp', label: 'Floor Lamp', emoji: '💡', w: 0.5, h: 0.5 },
  ],
};

const COLOR_PALETTES = [
  { id: 'warm', label: 'Warm Earthy', colors: ['#C4A882','#8B6F47','#E8DCC8','#5C4033','#D4B896'] },
  { id: 'cool', label: 'Cool Blues', colors: ['#B8D4E8','#6B9EBF','#E8F4FF','#2C5F7A','#A8CCDD'] },
  { id: 'green', label: 'Natural Green', colors: ['#8FAF8F','#4A7C59','#E8F5E9','#2D5A3D','#C8E6C9'] },
  { id: 'mono', label: 'Monochrome', colors: ['#E5E5E5','#9E9E9E','#FFFFFF','#424242','#BDBDBD'] },
  { id: 'royal', label: 'Royal Gold', colors: ['#C9A227','#8B6914','#FFF8E7','#4A3600','#E8C858'] },
];

function FloorPlan({ placed, roomW, roomH, onSelect, selectedId }) {
  const scale = Math.min(300 / roomW, 220 / roomH);
  const canvasW = roomW * scale;
  const canvasH = roomH * scale;

  return (
    <div className="flex justify-center">
      <div
        className="relative border-4 border-gray-700 bg-stone-100 rounded-sm shadow-inner"
        style={{ width: canvasW, height: canvasH, backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: `${scale}px ${scale}px` }}
      >
        {/* Door indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-500 rounded-t" />
        {/* Window indicator */}
        <div className="absolute top-0 left-1/4 w-10 h-1 bg-blue-400 rounded-b" />

        {placed.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            onClick={() => onSelect(item.id === selectedId ? null : item.id)}
            className={`absolute flex flex-col items-center justify-center cursor-pointer rounded transition select-none ${item.id === selectedId ? 'ring-2 ring-green-500' : ''}`}
            style={{
              left: item.x * scale,
              top: item.y * scale,
              width: item.w * scale,
              height: item.h * scale,
              backgroundColor: item.id === selectedId ? 'rgba(34,197,94,0.2)' : 'rgba(180,150,100,0.3)',
              border: '1px solid rgba(100,80,50,0.4)',
            }}
          >
            <span style={{ fontSize: Math.min(item.w, item.h) * scale * 0.5 }}>{item.emoji}</span>
            {item.w * scale > 40 && <span className="text-[8px] font-medium text-gray-700 leading-none">{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DesignEditor({ onNext, data, setData }) {
  const roomType = data.roomType || 'living';
  const available = FURNITURE_ITEMS[roomType] || FURNITURE_ITEMS.default;

  const [placed, setPlaced] = useState(() => {
    if (data.placedFurniture) return data.placedFurniture;
    const roomW = parseFloat(data.length) || 15;
    const roomH = parseFloat(data.width) || 12;
    const defaults = (FURNITURE_ITEMS[roomType] || FURNITURE_ITEMS.default).slice(0, 3);
    let x = 0.5, y = 0.5;
    return defaults.map((item, i) => {
      const pos = { ...item, x, y };
      x += item.w + 0.5;
      if (x + item.w > roomW - 0.5) { x = 0.5; y += 2; }
      return pos;
    });
  });

  const [selectedId, setSelectedId] = useState(null);
  const [palette, setPalette] = useState(data.palette || 'warm');
  const roomW = parseFloat(data.length) || 15;
  const roomH = parseFloat(data.width) || 12;

  function addItem(item) {
    const existing = placed.filter(p => p.id === item.id).length;
    if (existing >= 2) return;
    const newItem = { ...item, x: 0.5, y: 0.5 + existing * (item.h + 0.3) };
    const updated = [...placed, newItem];
    setPlaced(updated);
    setData(d => ({ ...d, placedFurniture: updated }));
  }

  function removeSelected() {
    if (!selectedId) return;
    const updated = placed.filter(p => p.id !== selectedId);
    setPlaced(updated);
    setSelectedId(null);
    setData(d => ({ ...d, placedFurniture: updated }));
  }

  function handleNext() {
    setData(d => ({ ...d, placedFurniture: placed, palette }));
    onNext();
  }

  const selectedPalette = COLOR_PALETTES.find(p => p.id === palette) || COLOR_PALETTES[0];

  return (
    <div>
      <div className="text-center mb-5">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">🗺️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">2D Layout Editor</h2>
        <p className="text-sm text-gray-500 mt-1">Place furniture in your {ROOM_TYPES_MAP[roomType] || 'room'} floor plan</p>
      </div>

      {/* Room info bar */}
      <div className="flex gap-2 flex-wrap mb-4">
        <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">🏠 {ROOM_TYPES_MAP[roomType]}</span>
        {data.style && <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2.5 py-1 rounded-full">🎨 {STYLES_MAP[data.style]}</span>}
        <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full">📐 {roomW}×{roomH} ft</span>
      </div>

      {/* Floor plan */}
      <div className="bg-stone-50 border border-gray-200 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-600">Floor Plan (Top View)</p>
          <div className="flex gap-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-amber-400 inline-block rounded"/>Door</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 bg-blue-400 inline-block rounded"/>Window</span>
          </div>
        </div>
        <FloorPlan placed={placed} roomW={roomW} roomH={roomH} onSelect={setSelectedId} selectedId={selectedId} />
        {selectedId && (
          <div className="flex justify-center mt-2">
            <button onClick={removeSelected} className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition">✕ Remove selected</button>
          </div>
        )}
      </div>

      {/* Add furniture */}
      <div className="mb-4">
        <p className="text-xs font-bold text-gray-700 mb-2">Add Furniture</p>
        <div className="grid grid-cols-3 gap-2">
          {available.map(item => (
            <button key={item.id} onClick={() => addItem(item)}
              className="flex items-center gap-2 border border-gray-200 hover:border-green-400 hover:bg-green-50 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 transition">
              <span className="text-base">{item.emoji}</span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color palette */}
      <div className="mb-5">
        <p className="text-xs font-bold text-gray-700 mb-2">Color Palette</p>
        <div className="flex gap-2 flex-wrap">
          {COLOR_PALETTES.map(p => (
            <button key={p.id} onClick={() => setPalette(p.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition ${palette === p.id ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
              <div className="flex gap-0.5">
                {p.colors.slice(0, 3).map((c, i) => <span key={i} className="w-3.5 h-3.5 rounded-full border border-white/50" style={{ backgroundColor: c }}/>)}
              </div>
              <span className="text-xs font-medium text-gray-700">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleNext} className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition text-sm">
        View 3D Visualization →
      </button>
    </div>
  );
}

export default DesignEditor;
