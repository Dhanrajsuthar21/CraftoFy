import React, { useEffect, useRef, useState } from 'react';

const ROOM_LABELS = { living:'Living Room', bedroom:'Bedroom', dining:'Dining Room', study:'Study', kids:'Kids Room', kitchen:'Kitchen', pooja:'Pooja Room', outdoor:'Outdoor' };

const PALETTE_COLORS = {
  warm:   { wall:'#E8DCC8', floor:'#C4A882', accent:'#8B6F47', furniture:'#A0785A', trim:'#5C4033' },
  cool:   { wall:'#E8F4FF', floor:'#B8D4E8', accent:'#2C5F7A', furniture:'#6B9EBF', trim:'#1A3F5C' },
  green:  { wall:'#E8F5E9', floor:'#C8E6C9', accent:'#2D5A3D', furniture:'#4A7C59', trim:'#1B3D2A' },
  mono:   { wall:'#F5F5F5', floor:'#E0E0E0', accent:'#424242', furniture:'#9E9E9E', trim:'#212121' },
  royal:  { wall:'#FFF8E7', floor:'#E8C858', accent:'#4A3600', furniture:'#C9A227', trim:'#2A1E00' },
};

function useThreeScene(canvasRef, data) {
  const animRef = useRef();
  const sceneRef = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const palette = PALETTE_COLORS[data.palette || 'warm'];
    const roomW = parseFloat(data.length) || 15;
    const roomH = parseFloat(data.width) || 12;
    const roomCH = parseFloat(data.height) || 10;

    let THREE;
    let renderer, scene, camera;
    let angle = 0;
    let isDragging = false, lastX = 0, lastY = 0;
    let camAngleH = 0.4, camAngleV = 0.3;

    async function init() {
      try {
        THREE = await import('three');
      } catch {
        drawFallback(canvas, palette);
        return;
      }

      const w = canvas.parentElement.clientWidth || 400;
      const h = 280;
      canvas.width = w;
      canvas.height = h;

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setClearColor(0x1a1a2e);
      sceneRef.current.renderer = renderer;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a2e);
      scene.fog = new THREE.Fog(0x1a1a2e, 20, 50);

      camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
      const camDist = Math.max(roomW, roomH) * 0.8;
      camera.position.set(camDist * Math.sin(camAngleH) * Math.cos(camAngleV), camDist * Math.sin(camAngleV) + 1, camDist * Math.cos(camAngleH) * Math.cos(camAngleV));
      camera.lookAt(0, 1, 0);
      sceneRef.current.camera = camera;
      sceneRef.current.scene = scene;

      // Ambient light
      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambient);

      // Main light (ceiling)
      const mainLight = new THREE.PointLight(0xfff5e0, 1.5, 30);
      mainLight.position.set(0, roomCH * 0.3 - 0.5, 0);
      mainLight.castShadow = true;
      scene.add(mainLight);

      // Floor
      const floorGeo = new THREE.PlaneGeometry(roomW * 0.3, roomH * 0.3);
      const floorMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(palette.floor) });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      // Walls
      const wallMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(palette.wall) });
      const wallH = roomCH * 0.09;
      const halfW = roomW * 0.15;
      const halfH = roomH * 0.15;

      // Back wall
      const backWall = new THREE.Mesh(new THREE.BoxGeometry(roomW * 0.3 + 0.1, wallH, 0.08), wallMat);
      backWall.position.set(0, wallH / 2, -halfH);
      backWall.receiveShadow = true;
      scene.add(backWall);

      // Left wall
      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, wallH, roomH * 0.3), wallMat);
      leftWall.position.set(-halfW, wallH / 2, 0);
      leftWall.receiveShadow = true;
      scene.add(leftWall);

      // Right wall
      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, wallH, roomH * 0.3), wallMat);
      rightWall.position.set(halfW, wallH / 2, 0);
      rightWall.receiveShadow = true;
      scene.add(rightWall);

      // Skirting board
      const skirtMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(palette.trim) });
      ['back','left','right'].forEach(side => {
        const sg = side === 'back' ? new THREE.BoxGeometry(roomW * 0.3, 0.05, 0.05) :
                   new THREE.BoxGeometry(0.05, 0.05, roomH * 0.3);
        const sm = new THREE.Mesh(sg, skirtMat);
        if (side === 'back') sm.position.set(0, 0.025, -halfH + 0.04);
        else if (side === 'left') sm.position.set(-halfW + 0.04, 0.025, 0);
        else sm.position.set(halfW - 0.04, 0.025, 0);
        scene.add(sm);
      });

      // Furniture from placed items
      const furnitureMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(palette.furniture) });
      const cushionMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(palette.accent) });

      const placed = data.placedFurniture || [];
      placed.slice(0, 8).forEach(item => {
        const scale = 0.3;
        const fx = (item.x - roomW / 2) * scale + item.w * scale / 2;
        const fz = (item.y - roomH / 2) * scale + item.h * scale / 2;
        const fh = 0.25;
        const fw = item.w * scale * 0.9;
        const fd = item.h * scale * 0.9;

        const baseGeo = new THREE.BoxGeometry(fw, fh, fd);
        const mesh = new THREE.Mesh(baseGeo, furnitureMat);
        mesh.position.set(fx, fh / 2, fz);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        if (item.id === 'sofa' || item.id === 'bed') {
          const topGeo = new THREE.BoxGeometry(fw * 0.9, fh * 0.5, fd * 0.7);
          const top = new THREE.Mesh(topGeo, cushionMat);
          top.position.set(fx, fh + fh * 0.25, fz);
          top.castShadow = true;
          scene.add(top);
        }
      });

      // If no furniture, add default sofa
      if (placed.length === 0) {
        const sofa = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.5), furnitureMat);
        sofa.position.set(0, 0.15, -halfH * 0.5);
        sofa.castShadow = true;
        scene.add(sofa);
        const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.15, 0.35), cushionMat);
        cushion.position.set(0, 0.37, -halfH * 0.5);
        scene.add(cushion);
      }

      // Ceiling lamp
      const lampGeo = new THREE.CylinderGeometry(0.05, 0.15, 0.2, 8);
      const lampMat = new THREE.MeshLambertMaterial({ color: 0xf5f0e0, emissive: 0xfff5b0, emissiveIntensity: 0.5 });
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.set(0, wallH - 0.15, 0);
      scene.add(lamp);

      // Animate
      function animate() {
        animRef.current = requestAnimationFrame(animate);
        if (!isDragging) angle += 0.002;
        const dist = Math.max(roomW, roomH) * 0.8;
        camera.position.set(dist * Math.sin(camAngleH + angle) * Math.cos(camAngleV), dist * Math.sin(camAngleV) + 1, dist * Math.cos(camAngleH + angle) * Math.cos(camAngleV));
        camera.lookAt(0, wallH * 0.4, 0);
        renderer.render(scene, camera);
      }
      animate();

      // Mouse / touch drag
      function onPointerDown(e) {
        isDragging = true;
        lastX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
        lastY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      }
      function onPointerMove(e) {
        if (!isDragging) return;
        const cx = e.clientX ?? e.touches?.[0]?.clientX ?? lastX;
        const cy = e.clientY ?? e.touches?.[0]?.clientY ?? lastY;
        camAngleH -= (cx - lastX) * 0.005;
        camAngleV = Math.max(0.1, Math.min(1.2, camAngleV + (cy - lastY) * 0.005));
        lastX = cx; lastY = cy;
      }
      function onPointerUp() { isDragging = false; }
      canvas.addEventListener('mousedown', onPointerDown);
      canvas.addEventListener('mousemove', onPointerMove);
      canvas.addEventListener('mouseup', onPointerUp);
      canvas.addEventListener('touchstart', onPointerDown, { passive: true });
      canvas.addEventListener('touchmove', onPointerMove, { passive: true });
      canvas.addEventListener('touchend', onPointerUp);
      sceneRef.current.cleanup = () => {
        canvas.removeEventListener('mousedown', onPointerDown);
        canvas.removeEventListener('mousemove', onPointerMove);
        canvas.removeEventListener('mouseup', onPointerUp);
        canvas.removeEventListener('touchstart', onPointerDown);
        canvas.removeEventListener('touchmove', onPointerMove);
        canvas.removeEventListener('touchend', onPointerUp);
        renderer.dispose();
      };
    }

    init();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (sceneRef.current.cleanup) sceneRef.current.cleanup();
    };
  }, [data.palette, data.length, data.width]);
}

function drawFallback(canvas, palette) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width || 400;
  const h = canvas.height || 280;
  ctx.fillStyle = palette.wall;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = palette.floor;
  ctx.fillRect(0, h * 0.65, w, h * 0.35);
  ctx.strokeStyle = palette.trim;
  ctx.lineWidth = 2;
  ctx.strokeRect(4, 4, w - 8, h - 8);
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = palette.accent;
  ctx.textAlign = 'center';
  ctx.fillText('3D Preview', w / 2, h / 2 - 8);
  ctx.font = '12px sans-serif';
  ctx.fillText('(Install three.js to enable)', w / 2, h / 2 + 12);
}

function Visualization360({ onNext, data, setData }) {
  const canvasRef = useRef();
  const [view, setView] = useState('3d');
  useThreeScene(canvasRef, data);

  const palette = PALETTE_COLORS[data.palette || 'warm'];
  const roomLabel = ROOM_LABELS[data.roomType] || 'Room';

  return (
    <div>
      <div className="text-center mb-5">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">🏗️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">3D Visualization</h2>
        <p className="text-sm text-gray-500 mt-1">Explore your {roomLabel} in 3D — drag to rotate</p>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4 w-fit mx-auto">
        {[['3d','3D View','🏗️'],['plan','2D Plan','🗺️']].map(([v,lbl,icon]) => (
          <button key={v} onClick={() => setView(v)} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${view === v ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500'}`}>{icon} {lbl}</button>
        ))}
      </div>

      {view === '3d' ? (
        <div className="rounded-2xl overflow-hidden border-2 border-indigo-200 shadow-lg mb-4 bg-gray-900 cursor-grab active:cursor-grabbing">
          <canvas ref={canvasRef} className="w-full" style={{ height: 280, display: 'block' }} />
          <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
            <span className="text-gray-400 text-xs">🖱️ Drag to rotate</span>
            <div className="flex gap-1.5">
              {Object.entries(palette).slice(0, 4).map(([k, c]) => (
                <div key={k} className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: c }} title={k} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border-2 border-purple-200 mb-4">
          <div className="bg-stone-100 p-4 relative" style={{ height: 280 }}>
            <div className="absolute inset-4 border-4 border-gray-600 rounded"
              style={{ backgroundColor: palette.floor, backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
              {(data.placedFurniture || []).slice(0, 6).map((item, i) => {
                const roomW = parseFloat(data.length) || 15;
                const roomH = parseFloat(data.width) || 12;
                const bw = 260, bh = 220;
                return (
                  <div key={i} className="absolute flex items-center justify-center"
                    style={{
                      left: `${(item.x / roomW) * 100}%`,
                      top: `${(item.y / roomH) * 100}%`,
                      width: `${(item.w / roomW) * 100}%`,
                      height: `${(item.h / roomH) * 100}%`,
                      backgroundColor: palette.furniture + '80',
                      border: `1px solid ${palette.accent}`,
                      borderRadius: 4,
                    }}>
                    <span style={{ fontSize: Math.min((item.w / roomW) * bw, (item.h / roomH) * bh) * 0.4 }}>{item.emoji}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Furniture Pieces', value: (data.placedFurniture || []).length || 3, icon: '🛋️' },
          { label: 'Room Size', value: `${parseFloat(data.length)||15}×${parseFloat(data.width)||12}ft`, icon: '📐' },
          { label: 'Style', value: (data.style || 'modern').charAt(0).toUpperCase() + (data.style || 'modern').slice(1), icon: '🎨' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-sm font-bold text-gray-800">{s.value}</div>
            <div className="text-[10px] text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <button onClick={() => onNext()} className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition text-sm">
        View Cost Estimate →
      </button>
    </div>
  );
}

export default Visualization360;
