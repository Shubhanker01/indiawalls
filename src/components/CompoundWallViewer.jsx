'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// 1. Procedural Concrete Texture
function createConcreteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#b0b0b0';
    ctx.fillRect(0, 0, 512, 512);

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
    texture.repeat.set(1, 4);
    return texture;
}

// 2. Extruded H-Beam Column Geometry
function ColumnMesh({ material }) {
    const size = 0.15;
    const height = 2.4; // Total post height (~8ft including footing depth)
    const flangeThick = 0.035;
    const webThick = 0.035;

    const geometry = useMemo(() => {
        const shape = new THREE.Shape();
        const half = size / 2;
        const wHalf = webThick / 2;
        const fInner = half - flangeThick;

        shape.moveTo(-half, -half);
        shape.lineTo(half, -half);
        shape.lineTo(half, -fInner);
        shape.lineTo(wHalf, -fInner);
        shape.lineTo(wHalf, fInner);
        shape.lineTo(half, fInner);
        shape.lineTo(half, half);
        shape.lineTo(-half, half);
        shape.lineTo(-half, fInner);
        shape.lineTo(-wHalf, fInner);
        shape.lineTo(-wHalf, -fInner);
        shape.lineTo(-half, -fInner);
        shape.closePath();

        // Steel wire holes
        const holeRadius = 0.006;
        const xOffsets = [-0.04, 0, 0.04];
        const yOffsets = [-0.055, 0.055];

        yOffsets.forEach((y) => {
            xOffsets.forEach((x) => {
                const hole = new THREE.Path();
                hole.absarc(x, y, holeRadius, 0, Math.PI * 2, true);
                shape.holes.push(hole);
            });
        });

        const extrudeSettings = {
            depth: height,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.002,
            bevelThickness: 0.002,
        };

        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.center();
        return geom;
    }, [size, height, flangeThick, webThick]);

    return (
        <mesh geometry={geometry} material={material} castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]} />
    );
}

// 3. Complete Precast Assembly with 4 Pillars & 6 Horizontal Panels
function WallAssembly() {
    const assemblyRef = useRef();
    const texture = useMemo(() => createConcreteTexture(), []);

    const materials = useMemo(
        () => ({
            concrete: new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.8,
                metalness: 0.05,
                color: '#E2E2E2',
            }),
            groutFooting: new THREE.MeshStandardMaterial({
                color: '#424242',
                roughness: 0.95,
            }),
            ground: new THREE.MeshStandardMaterial({
                color: '#A5A391',
                roughness: 0.9,
            }),
            jointLine: new THREE.MeshStandardMaterial({
                color: '#666666',
                roughness: 0.9,
            }),
            dimensionLine: new THREE.MeshBasicMaterial({
                color: '#ef4444',
            }),
        }),
        [texture]
    );

    const pillarsCount = 4;
    const bayCount = pillarsCount - 1;
    const bayWidth = 1.8;
    const panelHeight = 0.3; // 6 panels * 0.3m = 1.8m (~6 feet above ground)
    const panelCount = 6;
    const panelThickness = 0.07;
    const groutDepth = 0.6; // ~2 feet below ground

    const totalLength = bayCount * bayWidth;

    // Gentle continuous rotation
    useFrame((_, delta) => {
        if (assemblyRef.current) {
            assemblyRef.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <group ref={assemblyRef}>
            {/* Dark Sub-ground Earth Layer */}
            <mesh position={[0, -groutDepth / 2, 0]} material={materials.ground} receiveShadow>
                <boxGeometry args={[totalLength + 1.2, groutDepth, 0.6]} />
            </mesh>

            {/* 4 Vertical Concrete H-Beam Columns + 2ft Grout Footings */}
            {Array.from({ length: pillarsCount }).map((_, i) => {
                const xPos = (i - (pillarsCount - 1) / 2) * bayWidth;
                return (
                    <group key={i} position={[xPos, 0, 0]}>
                        {/* Column Post */}
                        <group position={[0, (panelCount * panelHeight) / 2 - 0.1, 0]}>
                            <ColumnMesh material={materials.concrete} />
                        </group>

                        {/* 2 feet Grout Footing Block (Below Ground Level) */}
                        <mesh position={[0, -groutDepth / 2, 0]} material={materials.groutFooting} receiveShadow>
                            <boxGeometry args={[0.35, groutDepth, 0.35]} />
                        </mesh>
                    </group>
                );
            })}

            {/* 6 Horizontal Precast Wall Panels per Bay */}
            {Array.from({ length: bayCount }).map((_, bIdx) => {
                const bayX = (bIdx - (bayCount - 1) / 2) * bayWidth;
                return (
                    <group key={bIdx} position={[bayX, 0, 0]}>
                        {Array.from({ length: panelCount }).map((_, pIdx) => (
                            <group key={pIdx} position={[0, pIdx * panelHeight + panelHeight / 2, 0]}>
                                {/* Horizontal Plank */}
                                <mesh material={materials.concrete} castShadow receiveShadow>
                                    <boxGeometry args={[bayWidth - 0.08, panelHeight - 0.01, panelThickness]} />
                                </mesh>
                                {/* Joint Groove */}
                                <mesh position={[0, -panelHeight / 2, 0]} material={materials.jointLine}>
                                    <boxGeometry args={[bayWidth - 0.08, 0.008, panelThickness + 0.002]} />
                                </mesh>
                            </group>
                        ))}
                    </group>
                );
            })}

            {/* --- Dimension Indicators & Text Labels --- */}

            {/* 2 Feet Grout Label (Below Ground) */}
            <group position={[totalLength / 2 + 0.45, -groutDepth / 2, 0]}>
                <Html center position={[0.2, 0, 0]}>
                    <div className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                        2 FT GROUT (4 FOOTINGS)
                    </div>
                </Html>
                {/* Red Vertical Bracket Line */}
                <mesh position={[0, 0, 0]} material={materials.dimensionLine}>
                    <boxGeometry args={[0.015, groutDepth, 0.015]} />
                </mesh>
            </group>

            {/* 6 Feet Panel Wall Label (Above Ground) */}
            <group position={[totalLength / 2 + 0.45, (panelCount * panelHeight) / 2, 0]}>
                <Html center position={[0.2, 0, 0]}>
                    <div className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                        6 FT WALL (6 PANELS)
                    </div>
                </Html>
                {/* Blue Vertical Bracket Line */}
                <mesh position={[0, 0, 0]} material={materials.dimensionLine}>
                    <boxGeometry args={[0.015, panelCount * panelHeight, 0.015]} />
                </mesh>
            </group>

            {/* 6 Feet Panel Width Label */}
            <group position={[0, panelCount * panelHeight + 0.12, 0.05]}>
                <Html center position={[0, -0.08, 0]}>
                    <div className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                        6 FT PANEL WIDTH
                    </div>
                </Html>
                {/* Horizontal dimension line for one panel bay */}
                <mesh position={[0, 0, 0]} material={materials.dimensionLine}>
                    <boxGeometry args={[bayWidth, 0.015, 0.015]} />
                </mesh>
            </group>
        </group>
    );
}

// 4. Main Page Component
export default function ColumnViewer() {
    return (
        <div className="w-full max-w-5xl mx-auto p-2 space-y-2 font-sans">

            {/* 3D Canvas Container constrained inside frame */}
            <div className="w-full h-[450px] bg-[#f8fafc] rounded-xl overflow-hidden shadow-sm border border-slate-200 relative">
                <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-700 font-mono border border-slate-200 shadow-sm">
                    4 Pillars • 6 Panels per Bay • 2ft Grout Footing • Drag to rotate
                </div>

                <Canvas shadows camera={{ position: [0, -1.5, 8.5], fov: 42 }}>
                    <color attach="background" args={['#f8fafc']} />

                    {/* Lighting */}
                    <ambientLight intensity={0.85} />
                    <directionalLight
                        position={[6, 10, 6]}
                        intensity={1.6}
                        color="#ffffff"
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />
                    <directionalLight position={[-6, 4, -4]} intensity={0.4} color="#cbd5e1" />

                    {/* Center fit ensures whole model stays inside viewport frame */}
                    <Center fit>
                        <WallAssembly />
                    </Center>

                    <OrbitControls
                        enablePan={false}
                        minDistance={3}
                        maxDistance={10}
                        maxPolarAngle={Math.PI / 2.02}
                    />
                </Canvas>
            </div>

        </div>
    );
}