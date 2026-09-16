'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

// 1. Generate 3-Lobed Interlocking Paver Shape (Tri-Hex Profile)
function createTriHexShape() {
  const shape = new THREE.Shape();
  const radius = 0.55;
  const lobeRadius = 0.28;

  // 3 central symmetry angles (0°, 120°, 240°)
  const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];

  angles.forEach((angle, index) => {
    const cx = radius * Math.cos(angle);
    const cy = radius * Math.sin(angle);

    // Create rounded lobe outer arc
    const startAngle = angle - Math.PI / 3;
    const endAngle = angle + Math.PI / 3;
    const steps = 12;

    for (let i = 0; i <= steps; i++) {
      const a = startAngle + (i / steps) * (endAngle - startAngle);
      const x = cx + lobeRadius * Math.cos(a);
      const y = cy + lobeRadius * Math.sin(a);

      if (index === 0 && i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
  });

  shape.closePath();
  return shape;
}

// 2. Single 3D Extruded Paver Block Component
function PaverBlock({ position, material }) {
  const shape = useMemo(() => createTriHexShape(), []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.22, // Block thickness
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.02, // Chamfered top edge
      bevelThickness: 0.02,
    }),
    []
  );

  const geometry = useMemo(() => {
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, [shape, extrudeSettings]);

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]} // Lay flat on ground
      castShadow
      receiveShadow
    />
  );
}

// 3. Tessellated Interlocking Paver Grid Assembly
function PaverGridAssembly() {
  const groupRef = useRef();

  // Dual-tone concrete materials
  const materials = useMemo(
    () => ({
      greyConcrete: new THREE.MeshStandardMaterial({
        color: '#F2F2F2',
        roughness: 0.85,
        metalness: 0.05,
      }),
      redConcrete: new THREE.MeshStandardMaterial({
        color: '#F2F2F2',
        roughness: 0.85,
        metalness: 0.05,
      }),
      sandJoint: new THREE.MeshStandardMaterial({
        color: '#F2F2F2',
        roughness: 0.95,
      }),
    }),
    []
  );

  // Generate grid positions for interlocking layout
  const gridPositions = useMemo(() => {
    const items = [];
    const rows = 5;
    const cols = 6;
    const spacingX = 1.15;
    const spacingY = 1.0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const xOffset = (r % 2) * (spacingX / 2);
        const x = (c - cols / 2) * spacingX + xOffset;
        const z = (r - rows / 2) * spacingY;
        const isAlternate = (r + c) % 2 === 0;

        items.push({
          pos: [x, 0.12, z],
          mat: isAlternate ? materials.greyConcrete : materials.redConcrete,
        });
      }
    }
    return items;
  }, [materials]);

  // Subtle Y-axis rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Sub-base Sand Layer */}
      <mesh position={[0, -0.05, 0]} material={materials.sandJoint} receiveShadow>
        <boxGeometry args={[7.5, 0.1, 5.5]} />
      </mesh>

      {/* Interlocked Paver Blocks */}
      {gridPositions.map((item, idx) => (
        <PaverBlock key={idx} position={item.pos} material={item.mat} />
      ))}
    </group>
  );
}

// 4. Main Page Component with Requested Heading
export default function ViewPaverBlock3D() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-4 font-sans">
      
      {/* Requested Heading */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          View Your Paver block in 3d
        </h2>
        <p className="text-sm text-slate-500">
          Interactive 3D Interlocking Preview • Drag to rotate, scroll to zoom
        </p>
      </div>

      {/* 3D Canvas Container */}
      <div className="w-full h-[450px] bg-[#f8fafc] rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative">
        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-700 font-mono border border-slate-200 shadow-sm">
          Tri-Hex Interlocking System • 60mm Thickness
        </div>

        <Canvas shadows camera={{ position: [0, 4.5, 5], fov: 45 }}>
          <color attach="background" args={['#f8fafc']} />

          {/* Realistic Lighting Setup */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[5, 10, 6]}
            intensity={1.8}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-5, 4, -4]} intensity={0.4} color="#cbd5e1" />

          <Center top>
            <PaverGridAssembly />
          </Center>

          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2.05}
          />
        </Canvas>
      </div>

    </div>
  );
}