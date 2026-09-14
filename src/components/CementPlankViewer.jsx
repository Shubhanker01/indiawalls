'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

// 1. Procedural Concrete Texture Generator (No external images required)
function createConcreteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base grey
    ctx.fillStyle = '#a3a3a3';
    ctx.fillRect(0, 0, 512, 512);

    // Add subtle noise/grit for RCC finish
    for (let i = 0; i < 40000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const opacity = Math.random() * 0.15;
        const color = Math.random() > 0.5 ? 255 : 0;
        ctx.fillStyle = `rgba(${color},${color},${color},${opacity})`;
        ctx.fillRect(x, y, 1.5, 1.5);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 1);
    return texture;
}

// 2. The 3D Cement Plank Mesh
function CementPlank() {
    const meshRef = useRef(null);
    const texture = useMemo(() => createConcreteTexture(), []);

    // Scale dimensions in meters (Proportional to 6ft x 1ft x 2inch)
    // Length: ~1.83m | Height: ~0.30m | Thickness: ~0.05m
    const length = 1.828;
    const height = 0.304;
    const thickness = 0.050;

    // Slow auto-rotation
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <mesh ref={meshRef} castShadow receiveShadow>
            <boxGeometry args={[length, height, thickness]} />
            <meshStandardMaterial
                map={texture}
                roughness={0.85}
                metalness={0.05}
                color="#c2c2c2"
            />
        </mesh>
    );
}

// 3. Main 3D Viewer Component
export default function CementPlankViewer() {
    return (
        <div className="w-full h-[350px] bg-slate-100 rounded-xl overflow-hidden shadow-lg relative">
            <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-200 font-mono border border-slate-700">
                Interactive 3D • Drag to rotate / Scroll to zoom
            </div>

            <Canvas shadows camera={{ position: [2, 1.5, 2.5], fov: 45 }}>
                <color attach="background" args={['#f8fafc']} />

                {/* Lighting */}
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
                <pointLight position={[-5, -2, -5]} intensity={0.3} />

                {/* Center alignment */}
                <Center top>
                    <CementPlank />
                </Center>

                {/* User Interaction Controls */}
                <OrbitControls
                    enablePan={false}
                    minDistance={1.2}
                    maxDistance={4}
                />
            </Canvas>
        </div>
    );
}