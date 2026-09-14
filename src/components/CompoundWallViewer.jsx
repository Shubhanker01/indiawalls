'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Concrete Texture Generator
function createConcreteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#b5b5b5';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 40000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const opacity = Math.random() * 0.12;
        const color = Math.random() > 0.5 ? 255 : 0;
        ctx.fillStyle = `rgba(${color},${color},${color},${opacity})`;
        ctx.fillRect(x, y, 1.5, 1.5);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
}

// Single Panel Assembly (Columns + Stacked Planks + Foundation)
function WallBay({ position }) {
    const texture = useMemo(() => createConcreteTexture(), []);

    // Dimensions scaled proportionally (1 unit = ~1 foot)
    const columnWidth = 0.5;   // 6x6 inches
    const columnHeight = 10;   // 10 ft total column length
    const plankLength = 6.0;   // 6 ft span between columns
    const plankHeight = 1.0;   // 1 ft plank height
    const plankThickness = 0.16; // 2 inches
    const undergroundDepth = 4; // 4 ft below ground

    return (
        <group position={position}>
            {/* 1. Left Post Column (10ft Total) */}
            <mesh position={[-plankLength / 2, (columnHeight / 2) - undergroundDepth, 0]} castShadow receiveShadow>
                <boxGeometry args={[columnWidth, columnHeight, columnWidth]} />
                <meshStandardMaterial map={texture} roughness={0.8} color="#9e9e9e" />
            </mesh>

            {/* 2. Right Post Column (10ft Total) */}
            <mesh position={[plankLength / 2, (columnHeight / 2) - undergroundDepth, 0]} castShadow receiveShadow>
                <boxGeometry args={[columnWidth, columnHeight, columnWidth]} />
                <meshStandardMaterial map={texture} roughness={0.8} color="#9e9e9e" />
            </mesh>

            {/* 3. Standard Stacked Planks (5 Planks = 5ft height above ground) */}
            {[0, 1, 2, 3, 4].map((index) => (
                <mesh
                    key={index}
                    position={[0, index * plankHeight + (plankHeight / 2), 0]}
                    castShadow
                    receiveShadow
                >
                    <boxGeometry args={[plankLength - 0.05, plankHeight - 0.02, plankThickness]} />
                    <meshStandardMaterial map={texture} roughness={0.85} color="#c8c8c8" />
                </mesh>
            ))}

            {/* 4. Top Decorative Wave Plank (6th Plank) */}
            <mesh position={[0, 5 * plankHeight + (plankHeight / 2), 0]} castShadow receiveShadow>
                <boxGeometry args={[plankLength - 0.05, plankHeight - 0.02, plankThickness]} />
                <meshStandardMaterial map={texture} roughness={0.85} color="#d4d4d4" />
            </mesh>

            {/* 5. Concrete Foundation Base (2ft x 2ft in-ground footing) */}
            <mesh position={[-plankLength / 2, -undergroundDepth + 1, 0]} receiveShadow>
                <boxGeometry args={[2.0, 2.0, 1.5]} />
                <meshStandardMaterial color="#8c3a34" roughness={0.9} />
            </mesh>
            <mesh position={[plankLength / 2, -undergroundDepth + 1, 0]} receiveShadow>
                <boxGeometry args={[2.0, 2.0, 1.5]} />
                <meshStandardMaterial color="#8c3a34" roughness={0.9} />
            </mesh>
        </group>
    );
}

// Main Compound Wall Assembly Group
function FullWallSystem() {
    const groupRef = useRef();

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <group ref={groupRef}>
            {/* 2 Continuous Wall Bays */}
            <WallBay position={[-3, 0, 0]} />
            <WallBay position={[3, 0, 0]} />
        </group>
    );
}

export default function CompoundWallViewer() {
    return (
        <div className="w-full h-[420px] bg-[#f8fafc] rounded-xl overflow-hidden shadow-sm border border-slate-200 relative">
            <div className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-600 font-mono border border-slate-200 shadow-sm">
                3D Assembly View • Drag to rotate / Scroll to zoom
            </div>

            <Canvas shadows camera={{ position: [0, 4, 14], fov: 40 }}>
                <color attach="background" args={['#f8fafc']} />

                <ambientLight intensity={0.75} />
                <directionalLight position={[8, 12, 8]} intensity={1.2} castShadow />
                <directionalLight position={[-8, 4, -8]} intensity={0.3} />

                <Center top>
                    <FullWallSystem />
                </Center>

                <OrbitControls enablePan={false} minDistance={6} maxDistance={20} />
            </Canvas>
        </div>
    );
}