'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function ProceduralWallModel() {
    const modelRef = useRef();
    const materials = useMemo(() => ({
        panel: new THREE.MeshStandardMaterial({ color: '#a84832', roughness: 0.82 }),
        edge: new THREE.MeshStandardMaterial({ color: '#d9785c', roughness: 0.72 }),
        groove: new THREE.MeshStandardMaterial({ color: '#451810', roughness: 0.9 }),
        post: new THREE.MeshStandardMaterial({ color: '#713022', roughness: 0.88 }),
    }), []);

    const panelWidth = 1.18;
    const panelHeight = 2.8;
    const panelGap = 0.08;
    const panelCount = 5;
    const wallWidth = panelCount * panelWidth + (panelCount - 1) * panelGap;
    const panelPositions = Array.from({ length: panelCount }, (_, index) => (
        (index - (panelCount - 1) / 2) * (panelWidth + panelGap)
    ));

    // Smooth continuous rotation on the Y-axis
    useFrame((_, delta) => {
        if (modelRef.current) {
            modelRef.current.rotation.y += delta * 0.18;
        }
    });

    return (
        <group
            ref={modelRef}
            scale={0.9}
            position={[0, -1.2, 0]}
        >
            {panelPositions.map((x) => (
                <group key={x} position={[x, panelHeight / 2, 0]}>
                    <mesh material={materials.panel} castShadow receiveShadow>
                        <boxGeometry args={[panelWidth, panelHeight, 0.28]} />
                    </mesh>
                    <mesh position={[0, 0, 0.15]} material={materials.edge} castShadow>
                        <boxGeometry args={[panelWidth - 0.12, panelHeight - 0.12, 0.025]} />
                    </mesh>
                    <mesh position={[0, 0, 0.18]} material={materials.groove}>
                        <boxGeometry args={[0.035, panelHeight - 0.35, 0.025]} />
                    </mesh>
                    <mesh position={[0, 0, 0.18]} rotation={[0, 0, Math.PI / 4]} material={materials.groove}>
                        <boxGeometry args={[0.035, 1.15, 0.025]} />
                    </mesh>
                </group>
            ))}

            {[-wallWidth / 2 - 0.1, wallWidth / 2 + 0.1].map((x) => (
                <mesh key={x} position={[x, panelHeight / 2, 0]} material={materials.post} castShadow receiveShadow>
                    <boxGeometry args={[0.22, panelHeight + 0.25, 0.42]} />
                </mesh>
            ))}

            <mesh position={[0, panelHeight + 0.13, 0]} material={materials.edge} castShadow>
                <boxGeometry args={[wallWidth + 0.38, 0.2, 0.42]} />
            </mesh>
        </group>
    );
}

export default function RenderDownloadedModel() {
    return (
        // Bright light-gray/slate-50 background for strong contrast against dark model
        <div className="absolute inset-0 z-0 w-full h-full bg-slate-50 pointer-events-none">
            <Canvas shadows camera={{ position: [0, 1.5, 6], fov: 45 }}>
                {/* Soft fill lighting */}
                <ambientLight intensity={0.8} />

                {/* Warm main key light to catch edge highlights */}
                <directionalLight
                    position={[6, 10, 5]}
                    intensity={2.8}
                    color="#f59e0b"
                    castShadow
                />

                {/* Cool rim light to separate the dark wall from background shadows */}
                <directionalLight
                    position={[-6, 4, -4]}
                    intensity={1.5}
                    color="#38bdf8"
                />

                <ProceduralWallModel />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>
        </div>
    );
}
