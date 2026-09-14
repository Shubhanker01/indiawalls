'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 1. Component to build the top curved/waved plank
function WavePlank({ width, height, thickness, material }) {
    const geometry = useMemo(() => {
        const shape = new THREE.Shape();
        const halfW = width / 2;
        const baseH = height - 0.15; // Rectangular base height

        // Draw bottom rectangle
        shape.moveTo(-halfW, 0);
        shape.lineTo(halfW, 0);
        shape.lineTo(halfW, baseH);

        // Draw top sinusoidal crest (3 waves across span)
        const segments = 60;
        for (let i = 0; i <= segments; i++) {
            const x = halfW - (i / segments) * width;
            const progress = (i / segments) * Math.PI * 6; // 3 full wave periods
            const y = baseH + Math.abs(Math.sin(progress)) * 0.15;
            shape.lineTo(x, y);
        }

        shape.lineTo(-halfW, 0);

        const extrudeSettings = {
            depth: thickness,
            bevelEnabled: true,
            bevelSegments: 2,
            bevelSize: 0.005,
            bevelThickness: 0.005,
        };

        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.center(); // Center geometry
        return geom;
    }, [width, height, thickness]);

    return <mesh geometry={geometry} material={material} castShadow receiveShadow />;
}

// 2. Main Procedural Boundary Wall Assembly
function ProceduralWallModel() {
    const modelRef = useRef();

    // Authentic precast concrete materials
    const materials = useMemo(
        () => ({
            concretePlank: new THREE.MeshStandardMaterial({ color: '#c4c4c4', roughness: 0.85 }),
            concretePost: new THREE.MeshStandardMaterial({ color: '#9e9e9e', roughness: 0.8 }),
            jointLine: new THREE.MeshStandardMaterial({ color: '#686868', roughness: 0.95 }),
        }),
        []
    );

    // Real-world proportional specs
    const bayCount = 4; // Number of wall spans
    const bayWidth = 2.2; // ~6ft span
    const plankHeight = 0.35; // 1ft height
    const plankThickness = 0.08; // 2 inches
    const plankCount = 5; // 5 stacked flat planks + 1 wave plank on top

    const bayPositions = Array.from(
        { length: bayCount },
        (_, i) => (i - (bayCount - 1) / 2) * bayWidth
    );

    // Slow continuous preview rotation
    useFrame((_, delta) => {
        if (modelRef.current) {
            modelRef.current.rotation.y += delta * 0.12;
        }
    });

    return (
        <group ref={modelRef} scale={0.85} position={[0, -1.0, 0]}>
            {/* Loop through each wall section/bay */}
            {bayPositions.map((bayX) => (
                <group key={bayX} position={[bayX, 0, 0]}>
                    {/* Stacked Horizontal Flat Planks */}
                    {Array.from({ length: plankCount }).map((_, pIdx) => (
                        <group key={pIdx} position={[0, pIdx * plankHeight + plankHeight / 2, 0]}>
                            <mesh material={materials.concretePlank} castShadow receiveShadow>
                                <boxGeometry args={[bayWidth - 0.08, plankHeight - 0.015, plankThickness]} />
                            </mesh>
                            {/* Slot groove gap */}
                            <mesh position={[0, -plankHeight / 2, 0]} material={materials.jointLine}>
                                <boxGeometry args={[bayWidth - 0.08, 0.01, plankThickness + 0.002]} />
                            </mesh>
                        </group>
                    ))}

                    {/* Top Scalloped Wave Plank */}
                    <group position={[0, plankCount * plankHeight + 0.12, -plankThickness / 2]}>
                        <WavePlank
                            width={bayWidth - 0.08}
                            height={plankHeight + 0.08}
                            thickness={plankThickness}
                            material={materials.concretePlank}
                        />
                    </group>
                </group>
            ))}

            {/* Vertical Support H-Columns (Posts between spans) */}
            {Array.from({ length: bayCount + 1 }).map((_, i) => {
                const postX = (i - bayCount / 2) * bayWidth;
                const totalHeight = (plankCount + 1) * plankHeight + 0.15;
                return (
                    <mesh
                        key={i}
                        position={[postX, totalHeight / 2, 0]}
                        material={materials.concretePost}
                        castShadow
                        receiveShadow
                    >
                        <boxGeometry args={[0.2, totalHeight, 0.22]} />
                    </mesh>
                );
            })}
        </group>
    );
}

export default function PreCastWallCanvas() {
    return (
        <div className="precast-wall-pattern absolute inset-0 z-0 w-full h-full pointer-events-none">
            <Canvas shadows camera={{ position: [0, 2, 7], fov: 42 }}>
                <color attach="background" args={['#f8fafc']} />

                {/* Natural Sun & Ambient Lighting */}
                <ambientLight intensity={0.85} />
                <directionalLight
                    position={[8, 12, 6]}
                    intensity={1.8}
                    color="#fffbeb"
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />
                <directionalLight position={[-6, 4, -5]} intensity={0.4} color="#e2e8f0" />

                <ProceduralWallModel />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2.05}
                    minPolarAngle={Math.PI / 3.5}
                />
            </Canvas>
        </div>
    );
}