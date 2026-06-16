import React, { Suspense, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, ContactShadows, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Palettes ──────────────────────────────────────────────── */
const PALETTES = {
  warm:  { wall:'#E5D5BB', wall2:'#D9C9A8', floor:'#B89A6A', ceil:'#F5EEE0', fur:'#9A6E4A', trim:'#5C3D22', accent:'#8B5E3C', sky:'#2a1a0e' },
  cool:  { wall:'#D8EAF8', wall2:'#C5DDEF', floor:'#7DAEC9', ceil:'#EBF5FF', fur:'#5585A2', trim:'#1C4A68', accent:'#3A7FA0', sky:'#0a1a2e' },
  green: { wall:'#D9EEE0', wall2:'#C5E5CE', floor:'#7FB894', ceil:'#E8F5EC', fur:'#3A7050', trim:'#1B3D2A', accent:'#2E6644', sky:'#0a1e0e' },
  mono:  { wall:'#EEEEEE', wall2:'#E0E0E0', floor:'#9E9E9E', ceil:'#FAFAFA', fur:'#757575', trim:'#212121', accent:'#555555', sky:'#111111' },
  royal: { wall:'#FFF3D0', wall2:'#FFE9A8', floor:'#C9A018', ceil:'#FFFBE8', fur:'#B88A00', trim:'#3A2800', accent:'#D4AF37', sky:'#1a1200' },
};

/* ─── Inside-Room Camera Controls ──────────────────────────── */
function InsideCameraControls({ roomW, roomH, roomCH, enabled }) {
  const { camera, gl } = useThree();
  const s = useRef({ dragging:false, lx:0, ly:0, yaw:0.1, pitch:-0.08 });

  useEffect(() => {
    const hw = Math.min(roomW * 0.13, 2.5);
    const hd = Math.min(roomH * 0.13, 2.2);
    camera.fov = 75;
    camera.near = 0.05;
    camera.updateProjectionMatrix();
    camera.position.set(0, 1.65, 0.5);

    function applyRotation() {
      const euler = new THREE.Euler(s.current.pitch, s.current.yaw, 0, 'YXZ');
      camera.quaternion.setFromEuler(euler);
    }
    applyRotation();

    function onDown(e) {
      s.current.dragging = true;
      s.current.lx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      s.current.ly = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    }
    function onMove(e) {
      if (!s.current.dragging || !enabled) return;
      const cx = e.clientX ?? e.touches?.[0]?.clientX ?? s.current.lx;
      const cy = e.clientY ?? e.touches?.[0]?.clientY ?? s.current.ly;
      s.current.yaw   -= (cx - s.current.lx) * 0.004;
      s.current.pitch -= (cy - s.current.ly) * 0.004;
      s.current.pitch = Math.max(-1.4, Math.min(1.4, s.current.pitch));
      s.current.lx = cx; s.current.ly = cy;
      applyRotation();
    }
    function onUp() { s.current.dragging = false; }
    function onWheel(e) {
      e.preventDefault();
      if (!enabled) return;
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const next = camera.position.clone().addScaledVector(dir, -e.deltaY * 0.006);
      next.x = Math.max(-hw, Math.min(hw, next.x));
      next.y = Math.max(0.4, Math.min(roomCH * 0.085, next.y));
      next.z = Math.max(-hd, Math.min(hd, next.z));
      camera.position.copy(next);
    }

    const el = gl.domElement;
    el.addEventListener('mousedown', onDown);
    el.addEventListener('touchstart', onDown, { passive:true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    el.addEventListener('wheel', onWheel, { passive:false });
    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [camera, gl, roomW, roomH, roomCH, enabled]);

  return null;
}

/* ─── Furniture Components ─────────────────────────────────── */
function SofaOld({ col, trim }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0,0.18,0]}>
        <boxGeometry args={[2.0,0.38,0.8]} /><meshStandardMaterial color={col} roughness={0.85} />
      </mesh>
      <mesh castShadow receiveShadow position={[0,0.58,-0.31]}>
        <boxGeometry args={[2.0,0.46,0.2]} /><meshStandardMaterial color={col} roughness={0.85} />
      </mesh>
      {[-0.9,0.9].map((x,i)=>(
        <mesh key={i} castShadow receiveShadow position={[x,0.44,0]}>
          <boxGeometry args={[0.2,0.28,0.8]} /><meshStandardMaterial color={trim} roughness={0.7} />
        </mesh>
      ))}
      {[-0.58,0.58].map((x,i)=>(
        <mesh key={i} castShadow position={[x,0.42,0.06]}>
          <boxGeometry args={[0.78,0.14,0.62]} /><meshStandardMaterial color={trim} roughness={0.9} />
        </mesh>
      ))}
      {[[-0.85,-0.34],[-0.85,0.34],[0.85,-0.34],[0.85,0.34]].map(([x,z],i)=>(
        <mesh key={i} castShadow position={[x,0.04,z]}>
          <cylinderGeometry args={[0.04,0.04,0.08,8]} /><meshStandardMaterial color="#2a1a0a" roughness={0.4} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Sofa({ col, trim }) {
  const { scene } = useGLTF(
    "https://rszjkpkwdkplgkgrlafv.supabase.co/storage/v1/object/public/modals/uploads_files_7156693_Modern_L-Shaped_Sectional_Sofa_Free%20(1)%20(1).glb"
  );
  const cloned = useMemo(() => {
    const s = scene.clone();
    s.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((mat) => {
            const name = (mat.name || '').toLowerCase();
            if (name.includes('wood') || name.includes('leg') || name.includes('trim') || name.includes('metal') || name.includes('base')) {
              mat.color = new THREE.Color(trim);
            } else {
              mat.color = new THREE.Color(col);
            }
            mat.needsUpdate = true;
          });
        }
      }
    });
    return s;
  }, [scene, col, trim]);
  return <primitive object={cloned} scale={0.8} position={[0, 0, 0]} />;
}

function Bed({ col, trim }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0,0.18,0.1]}>
        <boxGeometry args={[2.0,0.36,2.4]} /><meshStandardMaterial color={trim} roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[0,0.4,0.15]}>
        <boxGeometry args={[1.85,0.24,2.05]} /><meshStandardMaterial color="#f0ece6" roughness={0.95} />
      </mesh>
      <mesh castShadow receiveShadow position={[0,0.78,-1.06]}>
        <boxGeometry args={[2.0,1.0,0.14]} /><meshStandardMaterial color={col} roughness={0.62} />
      </mesh>
      {[-0.5,0.5].map((x,i)=>(
        <mesh key={i} castShadow position={[x,0.57,-0.78]}>
          <boxGeometry args={[0.72,0.12,0.48]} /><meshStandardMaterial color="#f8f4ee" roughness={0.95} />
        </mesh>
      ))}
      <mesh castShadow position={[0,0.55,0.35]}>
        <boxGeometry args={[1.82,0.07,1.3]} /><meshStandardMaterial color={col} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Wardrobe({ col, trim }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0,1.1,0]}>
        <boxGeometry args={[1.8,2.2,0.6]} /><meshStandardMaterial color={col} roughness={0.6} />
      </mesh>
      <mesh position={[0,1.1,0.31]}><boxGeometry args={[0.03,2.1,0.02]} /><meshStandardMaterial color={trim} /></mesh>
      {[-0.28,0.28].map((x,i)=>(
        <mesh key={i} position={[x,1.1,0.32]}>
          <cylinderGeometry args={[0.02,0.02,0.14,8]} /><meshStandardMaterial color="#c0a060" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      <mesh castShadow position={[0,2.24,0]}><boxGeometry args={[1.8,0.06,0.6]} /><meshStandardMaterial color={trim} roughness={0.5} /></mesh>
    </group>
  );
}

function DiningSet({ col, trim }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0,0.78,0]}>
        <boxGeometry args={[1.8,0.06,0.95]} /><meshStandardMaterial color={col} roughness={0.4} />
      </mesh>
      {[[-0.75,-0.38],[0.75,-0.38],[-0.75,0.38],[0.75,0.38]].map(([x,z],i)=>(
        <mesh key={i} castShadow receiveShadow position={[x,0.39,z]}>
          <boxGeometry args={[0.06,0.78,0.06]} /><meshStandardMaterial color={trim} roughness={0.5} />
        </mesh>
      ))}
      {[[-0.68,0.78],[-0.22,0.78],[0.22,0.78],[0.68,0.78]].map(([x,z],i)=>(
        <group key={i} position={[x,0,z+0.62]} rotation={[0,Math.PI,0]}>
          <mesh castShadow receiveShadow position={[0,0.24,0]}><boxGeometry args={[0.44,0.06,0.44]} /><meshStandardMaterial color={trim} roughness={0.7} /></mesh>
          <mesh castShadow receiveShadow position={[0,0.58,-0.19]}><boxGeometry args={[0.44,0.6,0.06]} /><meshStandardMaterial color={col} roughness={0.7} /></mesh>
          {[[-0.17,0.17],[-0.17,-0.17],[0.17,0.17],[0.17,-0.17]].map(([lx,lz],j)=>(
            <mesh key={j} castShadow position={[lx,0.12,lz]}><cylinderGeometry args={[0.024,0.024,0.24,6]} /><meshStandardMaterial color={trim} roughness={0.5} /></mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function TVUnit({ col, trim }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0,0.24,0]}><boxGeometry args={[2.2,0.48,0.46]} /><meshStandardMaterial color={col} roughness={0.55} /></mesh>
      {[-0.68,0,0.68].map((x,i)=>(<mesh key={i} position={[x,0.24,0.24]}><boxGeometry args={[0.65,0.42,0.02]} /><meshStandardMaterial color={trim} roughness={0.5} /></mesh>))}
      <mesh castShadow position={[0,0.96,0.05]}><boxGeometry args={[1.6,0.9,0.07]} /><meshStandardMaterial color="#0d0d0d" roughness={0.05} metalness={0.3} /></mesh>
      <mesh position={[0,0.96,0.09]}><boxGeometry args={[1.52,0.82,0.01]} /><meshStandardMaterial color="#060618" emissive="#050510" emissiveIntensity={0.8} roughness={0.02} /></mesh>
      <mesh position={[0,0.96,0.093]}><boxGeometry args={[0.8,0.45,0.005]} /><meshStandardMaterial color="#0a1a3a" emissive="#0a1a3a" emissiveIntensity={0.5} roughness={0.1} /></mesh>
    </group>
  );
}

function Bookshelf({ col, trim }) {
  const books = [['#c0392b','#2980b9','#27ae60','#8e44ad'],['#e67e22','#1abc9c','#e74c3c','#3498db']];
  return (
    <group>
      <mesh castShadow receiveShadow position={[0,1.0,0]}><boxGeometry args={[1.0,2.0,0.32]} /><meshStandardMaterial color={col} roughness={0.6} /></mesh>
      {[0.18,0.62,1.06,1.5].map((y,i)=>(
        <mesh key={i} position={[0,y,0.05]}><boxGeometry args={[0.94,0.04,0.24]} /><meshStandardMaterial color={trim} roughness={0.5} /></mesh>
      ))}
      {books.flatMap((row,ri)=>row.map((c,ci)=>(
        <mesh key={`${ri}-${ci}`} castShadow position={[-0.3+ci*0.2, 0.18+ri*0.44+0.2, 0.07]}>
          <boxGeometry args={[0.14,0.26,0.2]} /><meshStandardMaterial color={c} roughness={0.8} />
        </mesh>
      )))}
    </group>
  );
}

function CoffeeTable({ col }) {
  return (
    <group>
      <mesh castShadow receiveShadow position={[0,0.4,0]}><boxGeometry args={[1.1,0.06,0.6]} /><meshStandardMaterial color={col} roughness={0.35} metalness={0.06} /></mesh>
      {[[-0.44,-0.22],[0.44,-0.22],[-0.44,0.22],[0.44,0.22]].map(([x,z],i)=>(
        <mesh key={i} castShadow position={[x,0.2,z]}><boxGeometry args={[0.055,0.4,0.055]} /><meshStandardMaterial color="#3a2a1a" roughness={0.4} /></mesh>
      ))}
    </group>
  );
}

function FloorLamp({ col }) {
  return (
    <group>
      <mesh castShadow position={[0,0.9,0]}><cylinderGeometry args={[0.018,0.018,1.8,8]} /><meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} /></mesh>
      <mesh castShadow position={[0,1.82,0]}><cylinderGeometry args={[0.2,0.1,0.32,12]} /><meshStandardMaterial color="#f5d88a" roughness={0.6} /></mesh>
      <pointLight position={[0,1.7,0]} intensity={0.9} color="#ffe4a0" distance={5} decay={2} castShadow />
      <mesh position={[0,0.02,0]}><cylinderGeometry args={[0.12,0.14,0.04,12]} /><meshStandardMaterial color="#555" metalness={0.5} /></mesh>
    </group>
  );
}

function Generic({ w, h, d, col }) {
  return (
    <mesh castShadow receiveShadow position={[0,h/2,0]}>
      <boxGeometry args={[w,h,d]} />
      <meshStandardMaterial color={col} roughness={0.7} />
    </mesh>
  );
}

const FURNITURE_MAP = {
  sofa:         (p) => <Sofa col={p.fur} trim={p.trim} />,
  bed:          (p) => <Bed col={p.fur} trim={p.trim} />,
  'kids-bed':   (p) => <Bed col={p.accent} trim={p.trim} />,
  'bunk-bed':   (p) => <Bed col={p.fur} trim={p.trim} />,
  wardrobe:     (p) => <Wardrobe col={p.fur} trim={p.trim} />,
  'dining-table':(p)=> <DiningSet col={p.fur} trim={p.trim} />,
  'tv-unit':    (p) => <TVUnit col={p.fur} trim={p.trim} />,
  bookshelf:    (p) => <Bookshelf col={p.fur} trim={p.trim} />,
  coffee:       (p) => <CoffeeTable col={p.fur} />,
  lamp:         (p) => <FloorLamp col={p.fur} />,
};

/* ─── Default room furnishing ──────────────────────────────── */
function DefaultFurniture({ palette, onSelect, selectedId }) {
  const defaults = [
    { id:'sofa', x:0, z:-1.8, rot:0 },
    { id:'coffee', x:0, z:-0.5, rot:0 },
    { id:'tv-unit', x:0, z:2.0, rot:Math.PI },
    { id:'lamp', x:-2.4, z:-2.0, rot:0 },
  ];
  return (
    <>
      {defaults.map((item) => {
        const Factory = FURNITURE_MAP[item.id] || null;
        if (!Factory) return null;
        return (
          <group
            key={item.id}
            position={[item.x, 0, item.z]}
            rotation={[0, item.rot, 0]}
            onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
          >
            {selectedId === item.id && (
              <mesh position={[0, 0.01, 0]}>
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial color="#22c55e" transparent opacity={0.18} depthWrite={false} />
              </mesh>
            )}
            {Factory(palette)}
          </group>
        );
      })}
    </>
  );
}

/* ─── Placed furniture from step 4 ────────────────────────── */
function PlacedFurniture({ items, roomW, roomH, palette, onSelect, selectedId }) {
  const scale = 0.3;
  return (
    <>
      {items.map((item, i) => {
        const fx = (item.x + item.w / 2 - roomW / 2) * scale;
        const fz = (item.y + item.h / 2 - roomH / 2) * scale;
        const Factory = FURNITURE_MAP[item.id];
        const uid = `${item.id}-${i}`;
        return (
          <group
            key={uid}
            position={[fx, 0, fz]}
            rotation={[0, item.rot || 0, 0]}
            onClick={(e) => { e.stopPropagation(); onSelect(uid); }}
          >
            {selectedId === uid && (
              <mesh position={[0, 0.01, 0]}>
                <planeGeometry args={[2.5, 2.5]} />
                <meshBasicMaterial color="#22c55e" transparent opacity={0.18} depthWrite={false} />
              </mesh>
            )}
            {Factory ? Factory(palette) : (
              <Generic
                w={item.w * scale * 0.88}
                h={item.h * scale * 0.9 * 1.2}
                d={item.h * scale * 0.88}
                col={palette.fur}
              />
            )}
          </group>
        );
      })}
    </>
  );
}

/* ─── Room Shell ────────────────────────────────────────────── */
function RoomShell({ roomW, roomH, roomCH, palette }) {
  const c = palette;
  const w = roomW * 0.3;
  const d = roomH * 0.3;
  const h = roomCH * 0.085;
  const hw = w / 2, hd = d / 2;

  return (
    <group>
      {/* Floor with wood plank pattern */}
      <mesh receiveShadow rotation={[-Math.PI/2,0,0]} position={[0,0,0]}>
        <planeGeometry args={[w,d]} />
        <meshStandardMaterial color={c.floor} roughness={0.9} metalness={0.02} />
      </mesh>
      {/* Floor planks lines */}
      {Array.from({length:Math.ceil(d/0.22)},(_,i)=>(
        <mesh key={i} position={[0,0.001,-hd+0.11+i*0.22]} rotation={[-Math.PI/2,0,0]}>
          <planeGeometry args={[w,0.015]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.06} depthWrite={false} />
        </mesh>
      ))}

      {/* Ceiling */}
      <mesh rotation={[Math.PI/2,0,0]} position={[0,h,0]}>
        <planeGeometry args={[w,d]} />
        <meshStandardMaterial color={c.ceil} roughness={0.88} />
      </mesh>

      {/* Back wall */}
      <mesh receiveShadow position={[0,h/2,-hd]}>
        <planeGeometry args={[w,h]} />
        <meshStandardMaterial color={c.wall} roughness={0.88} />
      </mesh>
      {/* Left wall */}
      <mesh receiveShadow rotation={[0,Math.PI/2,0]} position={[-hw,h/2,0]}>
        <planeGeometry args={[d,h]} />
        <meshStandardMaterial color={c.wall2} roughness={0.88} />
      </mesh>
      {/* Right wall */}
      <mesh receiveShadow rotation={[0,-Math.PI/2,0]} position={[hw,h/2,0]}>
        <planeGeometry args={[d,h]} />
        <meshStandardMaterial color={c.wall2} roughness={0.88} />
      </mesh>

      {/* Skirting boards */}
      {[[0,0.03,-hd+0.016,[w,0.06,0.032],0],[-hw+0.016,0.03,0,[0.032,0.06,d],0],[hw-0.016,0.03,0,[0.032,0.06,d],0]].map(([x,y,z,sz],i)=>(
        <mesh key={i} position={[x,y,z]}>
          <boxGeometry args={sz}/><meshStandardMaterial color={c.trim} roughness={0.5} />
        </mesh>
      ))}

      {/* Ceiling cornice */}
      {[[0,h-0.03,-hd+0.016,[w,0.06,0.032]],[-hw+0.016,h-0.03,0,[0.032,0.06,d]],[hw-0.016,h-0.03,0,[0.032,0.06,d]]].map(([x,y,z,sz],i)=>(
        <mesh key={i} position={[x,y,z]}>
          <boxGeometry args={sz}/><meshStandardMaterial color={c.trim} roughness={0.45} />
        </mesh>
      ))}

      {/* Ceiling rose */}
      <mesh position={[0,h-0.01,0]}>
        <cylinderGeometry args={[0.22,0.18,0.06,20]} />
        <meshStandardMaterial color={c.ceil} roughness={0.3} />
      </mesh>
      {/* Ceiling light glow disc */}
      <mesh position={[0,h-0.065,0]}>
        <cylinderGeometry args={[0.2,0.2,0.01,20]} />
        <meshStandardMaterial color="#fffde0" emissive="#ffe060" emissiveIntensity={2} />
      </mesh>

      {/* Window (back wall) */}
      <mesh position={[-hw*0.4,h*0.62,-hd+0.015]}>
        <planeGeometry args={[0.85,h*0.42]} />
        <meshStandardMaterial color="#b8ddf0" roughness={0.05} transparent opacity={0.45} />
      </mesh>
      <mesh position={[-hw*0.4,h*0.62,-hd+0.015]}>
        <planeGeometry args={[0.87,h*0.44]} />
        <meshBasicMaterial color={c.trim} wireframe />
      </mesh>
      {/* Window sill */}
      <mesh position={[-hw*0.4,h*0.62-h*0.22-0.03,-hd+0.04]}>
        <boxGeometry args={[0.9,0.04,0.09]} />
        <meshStandardMaterial color={c.trim} roughness={0.4} />
      </mesh>
      {/* Window light shaft */}
      <mesh position={[-hw*0.4,h*0.55,-hd+0.5]} rotation={[Math.PI/2.2,0,0]}>
        <planeGeometry args={[0.8,1.2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.03} depthWrite={false} />
      </mesh>

      {/* Door (right side front wall) — just an archway suggestion */}
      <mesh position={[hw*0.45,h*0.38,hd-0.015]}>
        <planeGeometry args={[0.5,h*0.76]} />
        <meshStandardMaterial color={c.trim} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Door frame */}
      <mesh position={[hw*0.45,h*0.38,hd-0.02]}>
        <planeGeometry args={[0.52,h*0.78]} />
        <meshBasicMaterial color={c.accent} wireframe />
      </mesh>
    </group>
  );
}

/* ─── Lighting ──────────────────────────────────────────────── */
function Lighting({ roomW, roomH, roomCH, palette }) {
  const h = roomCH * 0.085;
  return (
    <>
      <ambientLight intensity={0.55} color="#fffcf0" />
      <pointLight position={[0,h-0.1,0]} intensity={3.5} color="#ffe8a0" distance={15} decay={1.4} castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.001} />
      <pointLight position={[-roomW*0.12,h*0.6,-roomH*0.1]} intensity={0.7} color="#ffe0b0" distance={8} decay={2} />
      <pointLight position={[roomW*0.12,h*0.6,roomH*0.1]}  intensity={0.5} color="#b0d0ff" distance={7} decay={2} />
      <pointLight position={[0,h*0.3,0]} intensity={0.4} color="#ffffff" distance={5} decay={2} />
    </>
  );
}

/* ─── Selection indicator overlay ──────────────────────────── */
function SelectionHint({ selectedId, onDeselect }) {
  if (!selectedId) return null;
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2">
      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      Object selected — drag to look around
      <button onClick={onDeselect} className="ml-2 text-red-400 hover:text-red-300">✕</button>
    </div>
  );
}

/* ─── Scene ─────────────────────────────────────────────────── */
function Scene({ data, selectedId, setSelectedId }) {
  const palette = PALETTES[data.palette || 'warm'];
  const roomW  = parseFloat(data.length) || 15;
  const roomH  = parseFloat(data.width)  || 12;
  const roomCH = parseFloat(data.height) || 10;
  const placed = data.placedFurniture || [];

  return (
    <>
      <InsideCameraControls roomW={roomW} roomH={roomH} roomCH={roomCH} enabled={true} />
      <Lighting roomW={roomW} roomH={roomH} roomCH={roomCH} palette={palette} />
      <RoomShell roomW={roomW} roomH={roomH} roomCH={roomCH} palette={palette} />

      {placed.length > 0
        ? <PlacedFurniture items={placed} roomW={roomW} roomH={roomH} palette={palette}
            onSelect={setSelectedId} selectedId={selectedId} />
        : <DefaultFurniture palette={palette}
            onSelect={setSelectedId} selectedId={selectedId} />
      }

      {/* Click anywhere else → deselect */}
      <mesh
        position={[0, 0.001, 0]}
        rotation={[-Math.PI/2, 0, 0]}
        onClick={() => setSelectedId(null)}
      >
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.45}
        scale={Math.max(roomW, roomH) * 0.32}
        blur={2.0}
        far={1.8}
        color="#1a0e00"
      />
    </>
  );
}

/* ─── Compass HUD ───────────────────────────────────────────── */
function CompassHUD() {
  return (
    <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full border-2 border-white/30 bg-black/50 flex items-center justify-center text-white text-xs font-bold select-none">
      N
    </div>
  );
}

/* ─── Main exported component ───────────────────────────────── */
export default function Visualization360({ onNext, data }) {
  const [selectedId, setSelectedId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const roomLabel = {
    living:'Living Room', bedroom:'Bedroom', dining:'Dining Room',
    study:'Study', kids:'Kids Room', kitchen:'Kitchen',
    pooja:'Pooja Room', outdoor:'Outdoor',
  }[data.roomType] || 'Room';

  const palette = PALETTES[data.palette || 'warm'];

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setIsFullscreen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const canvasContainer = (
    <div
      className="relative bg-gray-950 cursor-grab active:cursor-grabbing select-none"
      style={isFullscreen
        ? { position:'fixed', inset:0, zIndex:9999, borderRadius:0, height:'100vh' }
        : { borderRadius:'1rem', overflow:'hidden', height:420 }
      }
    >
      <Canvas
        shadows
        gl={{ antialias:true, toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:1.15 }}
        dpr={[1,1.5]}
        style={{ background: palette.sky }}
      >
        <Suspense fallback={null}>
          <Scene data={data} selectedId={selectedId} setSelectedId={setSelectedId} />
        </Suspense>
      </Canvas>

      {/* Selection hint */}
      <SelectionHint selectedId={selectedId} onDeselect={() => setSelectedId(null)} />

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 text-white/60 text-[10px] font-medium space-y-0.5 select-none pointer-events-none">
        <p>🖱️ Drag — Look around</p>
        <p>⚡ Scroll — Move forward/back</p>
        <p>👆 Tap furniture — Select</p>
      </div>

      {/* Fullscreen toggle */}
      <button
        onClick={() => setIsFullscreen(f => !f)}
        className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
      >
        {isFullscreen ? '⬜ Exit' : '⛶ Fullscreen'}
      </button>

      {/* Room label */}
      <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg pointer-events-none">
        📷 {roomLabel} — 360° View
      </div>

      <CompassHUD />
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl">🏗️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">360° Immersive View</h2>
        <p className="text-sm text-gray-500 mt-1">
          You are inside your <span className="font-semibold text-green-700">{roomLabel}</span> — drag to look around
        </p>
      </div>

      {/* Palette chips */}
      <div className="flex gap-2 justify-center flex-wrap mb-3">
        {Object.entries(palette).slice(0,5).map(([k,c])=>(
          <div key={k} title={k} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background:c }} />
        ))}
        <span className="text-xs text-gray-500 self-center capitalize">{data.palette || 'warm'} palette</span>
      </div>

      {/* The 3D canvas */}
      {canvasContainer}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 my-4">
        {[
          { icon:'🛋️', label:'Furniture', value:`${(data.placedFurniture||[]).length||4} pieces` },
          { icon:'📐', label:'Room', value:`${parseFloat(data.length)||15}×${parseFloat(data.width)||12} ft` },
          { icon:'🎨', label:'Style', value:({modern:'Modern',classic:'Classic',scandinavian:'Nordic',industrial:'Indust.',bohemian:'Boho',royal:'Royal'}[data.style]||'Modern') },
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
