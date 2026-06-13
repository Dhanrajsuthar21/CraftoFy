import React, { useEffect, useState } from 'react';

const ANALYSIS_STEPS = [
  { label: 'Detecting room boundaries & walls', icon: '🔍', duration: 900 },
  { label: 'Measuring floor dimensions', icon: '📏', duration: 800 },
  { label: 'Identifying existing furniture', icon: '🛋️', duration: 1000 },
  { label: 'Analysing natural lighting', icon: '💡', duration: 700 },
  { label: 'Mapping ventilation & traffic flow', icon: '🌬️', duration: 900 },
  { label: 'Generating furniture layout options', icon: '📐', duration: 1100 },
  { label: 'Applying your style preferences', icon: '🎨', duration: 800 },
  { label: 'Building 3D model of your room', icon: '🏗️', duration: 1000 },
];

function RoomAnalysis({ onNext, data }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let step = 0;
    function runNext() {
      if (step >= ANALYSIS_STEPS.length) { setDone(true); return; }
      setCurrentStep(step);
      setTimeout(() => { step++; runNext(); }, ANALYSIS_STEPS[step].duration);
    }
    const t = setTimeout(runNext, 400);
    return () => clearTimeout(t);
  }, []);

  const progress = Math.round((Math.min(currentStep, ANALYSIS_STEPS.length) / ANALYSIS_STEPS.length) * 100);

  return (
    <div>
      <div className="text-center mb-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 ${done ? 'bg-green-100' : 'bg-blue-100'}`}>
          <span className="text-3xl">{done ? '🎉' : '🤖'}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">{done ? 'Analysis Complete!' : 'AI Analysing Your Room'}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {done ? 'Your personalised design plan is ready' : 'Please wait while our AI maps your space...'}
        </p>
      </div>

      {/* Captured image with scanning overlay */}
      {data.capturedImage && (
        <div className="relative rounded-2xl overflow-hidden mb-5 border-2 border-green-400 shadow-md">
          <img src={data.capturedImage} alt="Room" className="w-full object-cover max-h-48" />
          <div className="absolute inset-0"
            style={{
              background: 'linear-gradient(rgba(0,50,0,0.25), rgba(0,50,0,0.25))',
              backgroundImage: !done ? 'linear-gradient(rgba(34,197,94,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.2) 1px, transparent 1px)' : undefined,
              backgroundSize: '24px 24px',
            }}
          />
          {!done && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
                {ANALYSIS_STEPS[Math.min(currentStep, ANALYSIS_STEPS.length - 1)].label}
              </div>
            </div>
          )}
          {done && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-green-600/80 text-white font-bold px-4 py-2 rounded-full text-sm">✓ Scan Complete</div>
            </div>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Analysing...</span>
          <span className="font-bold text-green-700">{done ? 100 : progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full transition-all duration-500"
            style={{ width: `${done ? 100 : progress}%` }}
          />
        </div>
      </div>

      {/* Steps list */}
      <div className="space-y-2 mb-5">
        {ANALYSIS_STEPS.map((step, i) => {
          const isCompleted = done || i < currentStep;
          const isCurrent = !done && i === currentStep;
          const isPending = !done && i > currentStep;
          return (
            <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition ${isCompleted ? 'bg-green-50 text-green-700' : isCurrent ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isCompleted ? 'bg-green-600 text-white' : isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {isCompleted ? '✓' : isCurrent ? <span className="animate-pulse">●</span> : i + 1}
              </div>
              <span className="text-xs">{step.icon} {step.label}</span>
              {isCurrent && <span className="ml-auto text-[10px] font-bold text-blue-600 animate-pulse">Running...</span>}
            </div>
          );
        })}
      </div>

      {done && (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Furniture Spots', value: '6–8', icon: '🛋️' },
                { label: 'Lighting Points', value: '4', icon: '💡' },
                { label: 'Design Options', value: '3', icon: '🎨' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="text-base font-bold text-green-700">{stat.value}</div>
                  <div className="text-[10px] text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => onNext()} className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition text-sm">
            View Your Design →
          </button>
        </div>
      )}
    </div>
  );
}

export default RoomAnalysis;
