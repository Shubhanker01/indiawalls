"use client"
import React, { useState, useEffect } from 'react';
import * as THREE from 'three';

export function WavePlankWorker({ width, height, thickness, material }) {
    const [geometry, setGeometry] = useState(null);

    useEffect(() => {
        // 1. Instantiate the Worker
        const worker = new Worker(
            new URL('../workers/geometry.worker.js', import.meta.url),
            { type: 'module' }
        );

        // 2. Receive Processed Buffers from Worker
        worker.onmessage = (e) => {
            const { position, normal } = e.data;

            // Reconstruct Three.js BufferGeometry on Main Thread
            const bg = new THREE.BufferGeometry();
            bg.setAttribute('position', new THREE.BufferAttribute(position, 3));
            bg.setAttribute('normal', new THREE.BufferAttribute(normal, 3));

            setGeometry(bg);
            worker.terminate(); // Cleanup worker thread
        };

        // 3. Trigger Calculation
        worker.postMessage({ width, height, thickness });

        return () => worker.terminate();
    }, [width, height, thickness]);

    if (!geometry) return null; // Render nothing while calculating off-thread

    return (
        <mesh
            geometry={geometry}
            material={material}
            castShadow
            receiveShadow
        />
    );
}