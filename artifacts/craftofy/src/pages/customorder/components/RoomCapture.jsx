import React, { useRef, useState } from 'react';
import { FiCamera, FiUpload, FiRefreshCw } from 'react-icons/fi';

function RoomCapture({ onNext, data, setData }) {
  const inputRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setData(d => ({ ...d, capturedImage: url, imageName: file.name }));
  }

  function handleChange(e) {
    handleFile(e.target.files?.[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  function clear() {
    setData(d => ({ ...d, capturedImage: null, imageName: null }));
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">📷</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Capture Your Room</h2>
        <p className="text-sm text-gray-500 mt-1">Take a photo or upload an image of the room you want to design</p>
      </div>

      {!data.capturedImage ? (
        <>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition mb-4 ${dragOver ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-gray-50'}`}
          >
            <div className="text-4xl mb-3">🏠</div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Drag & drop your room photo here</p>
            <p className="text-xs text-gray-400">or choose from the options below</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => { inputRef.current.removeAttribute('capture'); inputRef.current.click(); }}
              className="flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 text-gray-700 font-semibold py-4 rounded-xl transition text-sm"
            >
              <FiUpload className="text-lg text-green-600" />
              Upload Photo
            </button>
            <button
              onClick={() => { inputRef.current.setAttribute('capture', 'environment'); inputRef.current.click(); }}
              className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-4 rounded-xl transition text-sm"
            >
              <FiCamera className="text-lg" />
              Open Camera
            </button>
          </div>

          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-2">📸 Tips for a great scan</p>
            <ul className="space-y-1">
              {['Stand at the corner to capture the full room','Ensure good lighting — avoid harsh shadows','Include all walls, floor, and existing furniture','Keep the camera level for accurate dimensions'].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="w-4 h-4 bg-amber-400 text-white rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div>
          <div className="relative rounded-2xl overflow-hidden border-4 border-green-500 shadow-lg mb-4">
            <img src={data.capturedImage} alt="Room" className="w-full object-cover max-h-72" />
            <div className="absolute inset-0 pointer-events-none opacity-20"
              style={{ backgroundImage: 'linear-gradient(rgba(34,197,94,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.6) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg">✓ Captured</div>
          </div>

          <div className="flex gap-3 mb-4">
            <button onClick={clear} className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition text-sm">
              <FiRefreshCw size={14}/> Retake
            </button>
            <button
              onClick={() => onNext()}
              className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl transition text-sm"
            >
              Use This Photo →
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-sm font-bold text-green-700">Photo ready for AI analysis</p>
              <p className="text-xs text-gray-500">Our AI will map your room's dimensions and layout</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomCapture;
