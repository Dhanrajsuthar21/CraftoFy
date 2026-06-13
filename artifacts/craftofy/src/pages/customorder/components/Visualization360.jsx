import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  ContactShadows,
  PerspectiveCamera,
} from '@react-three/drei';
import * as THREE from 'three';

/* ── Palette ──────────────────────────────────────────────────── */
const PALETTE_COLORS = {
  warm:  { wall: '#E8DCC8', floor: '#C4A882', accent: '#8B6F47', fur: '#A0785A', trim: '#5C4033', ceil: '#F5F0E8' },
  cool:  { wall: '#E8F4FF', floor: '#B8D4E8', accent: '#2C5F7A', fur: '#6B9EBF', trim: '#1A3F5C', ceil: '#F0F8FF' },
  green: { wall: '#E8F5E9', floor: '#C8E6C9', accent: '#2D5A3D', fur: '#4A7C59', trim: '#1B3D2A', ceil: '#F1FBF2' },
  mono:  { wall: '#F5F5F5', floor: '#E0E0E0', accent: '#424242', fur: '#9E9E9E', trim: '#212121', ceil: '#FAFAFA' },
  royal: { wall: '#FFF8E7', floor: '#D4A830', accent: '#4A3600', fur: '#C9A227', trim: '#2A1E00', ceil: '#FFFDF0' },
};

/* ── Furniture pieces ─────────────────────────────────────────── */
function Sofa({ pos, rot, col, trim }) {
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[1.8, 0.36, 0.7]} />
        <meshStandardMaterial color={col} roughness={0.8} />
      </mesh>
      {/* Back rest */}
      <mesh castShadow receiveShadow position={[0, 0.54, -0.28]}>
        <boxGeometry args={[1.8, 0.45, 0.18]} />
        <meshStandardMaterial color={col} roughness={0.8} />
      </mesh>
      {/* Left arm */}
      <mesh castShadow receiveShadow position={[-0.84, 0.42, 0]}>
        <boxGeometry args={[0.12, 0.24, 0.7]} />
        <meshStandardMaterial color={trim} roughness={0.7} />
      </mesh>
      {/* Right arm */}
      <mesh castShadow receiveShadow position={[0.84, 0.42, 0]}>
        <boxGeometry args={[0.12, 0.24, 0.7]} />
        <meshStandardMaterial color={trim} roughness={0.7} />
      </mesh>
      {/* Cushion left */}
      <mesh castShadow position={[-0.52, 0.4, 0.04]}>
        <boxGeometry args={[0.72, 0.12, 0.58]} />
        <meshStandardMaterial color={trim} roughness={0.9} />
      </mesh>
      {/* Cushion right */}
      <mesh castShadow position={[0.52, 0.4, 0.04]}>
        <boxGeometry args={[0.72, 0.12, 0.58]} />
        <meshStandardMaterial color={trim} roughness={0.9} />
      </mesh>
      {/* Legs */}
      {[[-0.8,-0.3],[-0.8,0.3],[0.8,-0.3],[0.8,0.3]].map(([x,z],i)=>(
        <mesh key={i} castShadow position={[x, 0.03, z]}>
          <cylinderGeometry args={[0.035, 0.035, 0.06, 8]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.4} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Bed({ pos, rot, col, trim }) {
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      {/* Frame */}
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <boxGeometry args={[1.8, 0.3, 2.2]} />
        <meshStandardMaterial color={trim} roughness={0.6} />
      </mesh>
      {/* Mattress */}
      <mesh castShadow receiveShadow position={[0, 0.35, 0.1]}>
        <boxGeometry args={[1.65, 0.22, 1.9]} />
        <meshStandardMaterial color="#f5f0ea" roughness={0.95} />
      </mesh>
      {/* Headboard */}
      <mesh castShadow receiveShadow position={[0, 0.72, -1.02]}>
        <boxGeometry args={[1.8, 0.9, 0.12]} />
        <meshStandardMaterial color={col} roughness={0.65} />
      </mesh>
      {/* Pillow 1 */}
      <mesh castShadow position={[-0.42, 0.52, -0.75]}>
        <boxGeometry args={[0.62, 0.1, 0.44]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
      {/* Pillow 2 */}
      <mesh castShadow position={[0.42, 0.52, -0.75]}>
        <boxGeometry args={[0.62, 0.1, 0.44]} />
        <meshStandardMaterial color="#ffffff" roughness={0.95} />
      </mesh>
      {/* Blanket */}
      <mesh castShadow position={[0, 0.49, 0.3]}>
        <boxGeometry args={[1.62, 0.06, 1.2]} />
        <meshStandardMaterial color={col} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Wardrobe({ pos, rot, col, trim }) {
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <mesh castShadow receiveShadow position={[0, 1.05, 0]}>
        <boxGeometry args={[1.6, 2.1, 0.55]} />
        <meshStandardMaterial color={col} roughness={0.6} />
      </mesh>
      {/* Door divider */}
      <mesh position={[0, 1.05, 0.28]}>
        <boxGeometry args={[0.025, 2.0, 0.02]} />
        <meshStandardMaterial color={trim} roughness={0.5} />
      </mesh>
      {/* Handles */}
      {[-0.3, 0.3].map((x,i)=>(
        <mesh key={i} position={[x, 1.05, 0.29]}>
          <cylinderGeometry args={[0.018, 0.018, 0.12, 8]} />
          <meshStandardMaterial color="#c0a060" roughness={0.2} metalness={0.8} />
        </mesh>
      ))}
      {/* Top panel */}
      <mesh castShadow position={[0, 2.14, 0]}>
        <boxGeometry args={[1.6, 0.06, 0.55]} />
        <meshStandardMaterial color={trim} roughness={0.5} />
      </mesh>
    </group>
  );
}

function DiningTable({ pos, rot, col, trim }) {
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      {/* Tabletop */}
      <mesh castShadow receiveShadow position={[0, 0.76, 0]}>
        <boxGeometry args={[1.8, 0.06, 0.9]} />
        <meshStandardMaterial color={col} roughness={0.4} metalness={0.05} />
      </mesh>
      {/* Legs */}
      {[[-0.78,-0.36],[0.78,-0.36],[-0.78,0.36],[0.78,0.36]].map(([x,z],i)=>(
        <mesh key={i} castShadow receiveShadow position={[x, 0.38, z]}>
          <boxGeometry args={[0.07, 0.76, 0.07]} />
          <meshStandardMaterial color={trim} roughness={0.5} />
        </mesh>
      ))}
      {/* Chairs */}
      {[[-0.78,0.7,0],[-0.28,0.7,0],[0.28,0.7,0],[0.78,0.7,0]].map(([x,z,r],i)=>(
        <group key={i} position={[x, 0, z + 0.68]} rotation={[0, Math.PI, 0]}>
          <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
            <boxGeometry args={[0.42, 0.06, 0.42]} />
            <meshStandardMaterial color={trim} roughness={0.7} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.54, -0.18]}>
            <boxGeometry args={[0.42, 0.6, 0.06]} />
            <meshStandardMaterial color={col} roughness={0.7} />
          </mesh>
          {[[-0.16,0.16],[-0.16,-0.16],[0.16,0.16],[0.16,-0.16]].map(([lx,lz],j)=>(
            <mesh key={j} castShadow position={[lx, 0.11, lz]}>
              <cylinderGeometry args={[0.022,0.022,0.22,6]} />
              <meshStandardMaterial color={trim} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function CoffeeTable({ pos, rot, col }) {
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
        <boxGeometry args={[1.1, 0.05, 0.6]} />
        <meshStandardMaterial color={col} roughness={0.35} metalness={0.05} />
      </mesh>
      {[[-0.45,-0.22],[0.45,-0.22],[-0.45,0.22],[0.45,0.22]].map(([x,z],i)=>(
        <mesh key={i} castShadow position={[x, 0.19, z]}>
          <boxGeometry args={[0.05, 0.38, 0.05]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function TVUnit({ pos, rot, col, trim }) {
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
        <boxGeometry args={[2.0, 0.44, 0.42]} />
        <meshStandardMaterial color={col} roughness={0.55} />
      </mesh>
      {/* Panel doors */}
      {[-0.62, 0, 0.62].map((x,i)=>(
        <mesh key={i} position={[x, 0.22, 0.22]}>
          <boxGeometry args={[0.58, 0.38, 0.02]} />
          <meshStandardMaterial color={trim} roughness={0.5} />
        </mesh>
      ))}
      {/* TV screen */}
      <mesh castShadow position={[0, 0.88, 0.04]}>
        <boxGeometry args={[1.5, 0.88, 0.06]} />
        <meshStandardMaterial color="#111111" roughness={0.1} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.88, 0.07]}>
        <boxGeometry args={[1.42, 0.8, 0.01]} />
        <meshStandardMaterial color="#0a0a1a" emissive="#0a0a1a" emissiveIntensity={0.5} roughness={0.05} />
      </mesh>
    </group>
  );
}

function Bookshelf({ pos, rot, col, trim }) {
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.9, 0]}>
        <boxGeometry args={[0.9, 1.8, 0.3]} />
        <meshStandardMaterial color={col} roughness={0.6} />
      </mesh>
      {[0.2, 0.6, 1.0, 1.4].map((y,i)=>(
        <mesh key={i} position={[0, y, 0.04]}>
          <boxGeometry args={[0.84, 0.04, 0.22]} />
          <meshStandardMaterial color={trim} roughness={0.5} />
        </mesh>
      ))}
      {/* Books */}
      {[[0.35,'#c0392b'],[0.55,'#2980b9'],[0.75,'#27ae60'],[0.95,'#8e44ad'],[1.15,'#e67e22'],
        [0.35,'#1abc9c'],[0.55,'#e74c3c'],[0.75,'#3498db']].map(([y,c],i)=>(
        <mesh key={i} castShadow position={[(-0.28 + (i % 4) * 0.16), y + 0.2, 0.06]}>
          <boxGeometry args={[0.13, 0.24, 0.18]} />
          <meshStandardMaterial color={c} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function FloorLamp({ pos, col }) {
  return (
    <group position={pos}>
      <mesh castShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.6, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.18, 0.1, 0.3, 12]} />
        <meshStandardMaterial color="#f5d88a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.03, 12]} />
        <meshStandardMaterial color="#555555" metalness={0.5} roughness={0.4} />
      </mesh>
      <pointLight position={[0, 1.55, 0]} intensity={0.8} color="#ffe4a0" distance={4} decay={2} castShadow />
    </group>
  );
}

function GenericFurniture({ pos, rot, w, h, d, col }) {
  return (
    <mesh castShadow receiveShadow position={[pos[0], pos[1] + h/2, pos[2]]} rotation={[0, rot, 0]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={col} roughness={0.7} />
    </mesh>
  );
}

/* ── Place furniture from step-4 layout ──────────────────────── */
function FurnitureFromLayout({ items, roomW, roomH, palette }) {
  const col = palette.fur;
  const trim = palette.trim;
  const scale = 0.3;
  const halfW = roomW * scale / 2;
  const halfH = roomH * scale / 2;

  return (
    <>
      {items.map((item, i) => {
        const fx = (item.x + item.w / 2 - roomW / 2) * scale;
        const fz = (item.y + item.h / 2 - roomH / 2) * scale;
        const pos = [fx, 0, fz];
        const rot = item.rot || 0;
        const id = item.id;

        if (id === 'sofa') return <Sofa key={i} pos={pos} rot={rot} col={col} trim={trim} />;
        if (id === 'bed' || id === 'kids-bed' || id === 'bunk-bed') return <Bed key={i} pos={pos} rot={rot} col={col} trim={trim} />;
        if (id === 'wardrobe') return <Wardrobe key={i} pos={pos} rot={rot} col={col} trim={trim} />;
        if (id === 'dining-table') return <DiningTable key={i} pos={pos} rot={rot} col={col} trim={trim} />;
        if (id === 'coffee' || id === 'coffee-table') return <CoffeeTable key={i} pos={pos} rot={rot} col={col} />;
        if (id === 'tv-unit') return <TVUnit key={i} pos={pos} rot={rot} col={col} trim={trim} />;
        if (id === 'bookshelf') return <Bookshelf key={i} pos={pos} rot={rot} col={col} trim={trim} />;
        if (id === 'lamp') return <FloorLamp key={i} pos={pos} col={col} />;

        return (
          <GenericFurniture
            key={i}
            pos={pos}
            rot={rot}
            w={item.w * scale * 0.88}
            h={item.h * scale * 0.88 * 1.2}
            d={item.h * scale * 0.88}
            col={col}
          />
        );
      })}
    </>
  );
}

/* ── Default furniture when no layout ────────────────────────── */
function DefaultRoom({ palette }) {
  const c = palette;
  return (
    <>
      <Sofa pos={[0, 0, -1.5]} rot={0} col={c.fur} trim={c.trim} />
      <CoffeeTable pos={[0, 0, -0.5]} rot={0} col={c.accent} />
      <TVUnit pos={[0, 0, 1.8]} rot={Math.PI} col={c.fur} trim={c.trim} />
      <FloorLamp pos={[-2.2, 0, -1.8]} col={c.fur} />
    </>
  );
}

/* ── Room shell ───────────────────────────────────────────────── */
function Room({ roomW, roomH, roomCH, palette }) {
  const c = palette;
  const w = roomW * 0.3;
  const d = roomH * 0.3;
  const h = roomCH * 0.09;
  const hw = w / 2, hd = d / 2;

  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={c.floor} roughness={0.85} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={c.ceil} roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh receiveShadow position={[0, h / 2, -hd]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color={c.wall} roughness={0.9} />
      </mesh>

      {/* Left wall */}
      <mesh receiveShadow rotation={[0, Math.PI / 2, 0]} position={[-hw, h / 2, 0]}>
        <planeGeometry args={[d, h]} />
        <meshStandardMaterial color={c.wall} roughness={0.9} />
      </mesh>

      {/* Right wall */}
      <mesh receiveShadow rotation={[0, -Math.PI / 2, 0]} position={[hw, h / 2, 0]}>
        <planeGeometry args={[d, h]} />
        <meshStandardMaterial color={c.wall} roughness={0.9} />
      </mesh>

      {/* Skirting boards */}
      {[
        [[0, 0.025, -hd + 0.015], [w, 0.05, 0.03], 0],
        [[-hw + 0.015, 0.025, 0], [0.03, 0.05, d], 0],
        [[hw - 0.015, 0.025, 0], [0.03, 0.05, d], 0],
      ].map(([pos, size, r], i) => (
        <mesh key={i} position={pos} rotation={[0, r, 0]}>
          <boxGeometry args={size} />
          <meshStandardMaterial color={c.trim} roughness={0.5} />
        </mesh>
      ))}

      {/* Ceiling cornice */}
      {[
        [[0, h - 0.025, -hd + 0.015], [w, 0.05, 0.03]],
        [[-hw + 0.015, h - 0.025, 0], [0.03, 0.05, d]],
        [[hw - 0.015, h - 0.025, 0], [0.03, 0.05, d]],
      ].map(([pos, size], i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={size} />
          <meshStandardMaterial color={c.trim} roughness={0.5} />
        </mesh>
      ))}

      {/* Ceiling light fixture */}
      <mesh position={[0, h - 0.01, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.06, 16]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.3} />
      </mesh>
      <mesh position={[0, h - 0.06, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.01, 16]} />
        <meshStandardMaterial color="#fffde0" emissive="#ffe88a" emissiveIntensity={1.5} roughness={0.2} />
      </mesh>

      {/* Door */}
      <mesh receiveShadow position={[hw * 0.3, h * 0.35, hd - 0.01]}>
        <planeGeometry args={[0.4, h * 0.7]} />
        <meshStandardMaterial color={c.trim} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Window */}
      <mesh receiveShadow position={[-hw * 0.35, h * 0.6, -hd + 0.01]}>
        <planeGeometry args={[0.7, h * 0.45]} />
        <meshStandardMaterial color="#a8d8f0" roughness={0.05} metalness={0.1} transparent opacity={0.5} />
      </mesh>
      <mesh position={[-hw * 0.35, h * 0.6, -hd + 0.01]}>
        <planeGeometry args={[0.72, h * 0.46]} />
        <meshStandardMaterial color={c.trim} wireframe roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ── Lighting ─────────────────────────────────────────────────── */
function Lighting({ roomW, roomH, roomCH, palette }) {
  const h = roomCH * 0.09;
  return (
    <>
      <ambientLight intensity={0.45} color="#fff5e0" />
      {/* Ceiling main */}
      <pointLight position={[0, h - 0.1, 0]} intensity={2.5} color="#ffe8a0" distance={12} decay={1.5} castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.001} />
      {/* Warm fill */}
      <pointLight position={[roomW * 0.12, h * 0.65, -roomH * 0.1]} intensity={0.6} color="#ffcf80" distance={8} decay={2} />
      {/* Cool fill from window side */}
      <pointLight position={[-roomW * 0.12, h * 0.55, -roomH * 0.1]} intensity={0.5} color="#b8d8ff" distance={7} decay={2} />
      {/* Subtle rim light from front */}
      <directionalLight position={[0, 2, 5]} intensity={0.3} color="#ffffff" />
    </>
  );
}

/* ── Label overlay ────────────────────────────────────────────── */
function RoomInfoOverlay({ data }) {
  const rLabel = { living:'Living Room', bedroom:'Bedroom', dining:'Dining Room', study:'Study', kids:'Kids Room', kitchen:'Kitchen', pooja:'Pooja Room', outdoor:'Outdoor' };
  const sLabel = { modern:'Modern', classic:'Classic', scandinavian:'Scandinavian', industrial:'Industrial', bohemian:'Bohemian', royal:'Royal Indian' };
  const pLabel = { warm:'Warm Earthy', cool:'Cool Blues', green:'Natural Green', mono:'Monochrome', royal:'Royal Gold' };
  const pal = PALETTE_COLORS[data.palette || 'warm'];
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 pointer-events-none">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-white font-bold text-sm">{rLabel[data.roomType] || 'Room'}</p>
          <p className="text-gray-300 text-xs">{sLabel[data.style] || ''} · {parseFloat(data.length)||15}×{parseFloat(data.width)||12} ft</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Object.values(pal).slice(0,4).map((c,i)=>(
              <div key={i} className="w-4 h-4 rounded-full border border-white/30" style={{ background: c }} />
            ))}
          </div>
          <span className="text-gray-300 text-xs">{pLabel[data.palette||'warm']}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Scene ───────────────────────────────────────────────── */
function Scene({ data }) {
  const palette = PALETTE_COLORS[data.palette || 'warm'];
  const roomW = parseFloat(data.length) || 15;
  const roomH = parseFloat(data.width) || 12;
  const roomCH = parseFloat(data.height) || 10;
  const placed = data.placedFurniture || [];
  const midH = roomCH * 0.09 / 2;

  return (
    <>
      <PerspectiveCamera makeDefault position={[4.5, 3.2, 5]} fov={52} />
      <Lighting roomW={roomW} roomH={roomH} roomCH={roomCH} palette={palette} />
      <Room roomW={roomW} roomH={roomH} roomCH={roomCH} palette={palette} />
      {placed.length > 0
        ? <FurnitureFromLayout items={placed} roomW={roomW} roomH={roomH} palette={palette} />
        : <DefaultRoom palette={palette} />
      }
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.35}
        scale={Math.max(roomW, roomH) * 0.35}
        blur={1.8}
        far={2}
        color="#2a1a0a"
      />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.6}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={2.5}
        maxDistance={Math.max(roomW, roomH) * 0.55}
        target={[0, midH * 0.6, 0]}
      />
    </>
  );
}

/* ── Exported component ────────────────────────────────────────── */
export default function Visualization360({ onNext, data, setData }) {
  const roomLabel = {living:'Living Room',bedroom:'Bedroom',dining:'Dining Room',study:'Study',kids:'Kids Room',kitchen:'Kitchen',pooja:'Pooja Room',outdoor:'Outdoor'}[data.roomType] || 'Room';

  return (
    <div>
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">🏗️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">360° 3D Room View</h2>
        <p className="text-sm text-gray-500 mt-1">
          Your <span className="font-semibold text-green-700">{roomLabel}</span> — drag to orbit, scroll to zoom
        </p>
      </div>

      {/* Hint bar */}
      <div className="flex gap-3 justify-center mb-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">🖱️ Drag to rotate</span>
        <span className="flex items-center gap-1">🔍 Scroll to zoom</span>
        <span className="flex items-center gap-1 text-green-600 font-semibold">● Auto-rotating</span>
      </div>

      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-200 shadow-xl bg-gray-950 cursor-grab active:cursor-grabbing"
           style={{ height: 380 }}>
        <Canvas
          shadows
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
          dpr={[1, 1.5]}
        >
          <Suspense fallback={null}>
            <Scene data={data} />
          </Suspense>
        </Canvas>
        <RoomInfoOverlay data={data} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 my-4">
        {[
          { icon:'🛋️', label:'Furniture', value:`${(data.placedFurniture||[]).length || 3} items` },
          { icon:'📐', label:'Room Size', value:`${parseFloat(data.length)||15}×${parseFloat(data.width)||12} ft` },
          { icon:'🎨', label:'Palette', value:({warm:'Warm',cool:'Cool Blues',green:'Green',mono:'Mono',royal:'Royal'}[data.palette||'warm']||'Warm') },
        ].map((s,i)=>(
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-sm font-bold text-gray-800">{s.value}</div>
            <div className="text-[10px] text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onNext()}
        className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition text-sm"
      >
        View Cost Estimate →
      </button>
    </div>
  );
}
