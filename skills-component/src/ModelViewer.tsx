import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Html } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

interface ModelProps {
  modelPath: string;
}

const Asset: React.FC<ModelProps> = ({ modelPath }) => {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loader = new GLTFLoader();
    
    // Correct the path for relative serving if needed. Vite usually handles absolute well if on root.
    const finalPath = modelPath;

    loader.load(
      finalPath,
      (gltf) => {
        if (isMounted) setModel(gltf.scene);
      },
      undefined,
      (err) => {
        console.error('GLTF Load Error:', err);
        if (isMounted) setError(err.message || 'Unknown Load Error');
      }
    );

    return () => {
      isMounted = false;
    };
  }, [modelPath]);

  if (error) {
    return (
      <Html center>
        <div className="font-mono text-red-500 text-[10px] tracking-widest whitespace-nowrap px-3 py-1 bg-black/80 border border-red-500/30">
          [ CAD_LOAD_FAILED: {error.substring(0, 30)} ]
        </div>
      </Html>
    );
  }

  if (!model) {
    return (
      <Html center>
        <div className="font-mono text-yellow-500 text-[10px] tracking-widest whitespace-nowrap animate-pulse px-3 py-1 bg-black/80 border border-yellow-500/30 backdrop-blur-sm">
          [ DOWNLOADING_CAD_ASSET ]
        </div>
      </Html>
    );
  }

  return <primitive object={model} dispose={null} />;
};

export const ModelViewer: React.FC<ModelProps> = ({ modelPath }) => {
  return (
    <div className="w-full h-64 bg-neutral-900/30 border border-neutral-800 rounded-lg overflow-hidden relative">
      <Canvas dpr={[1, 2]} camera={{ fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <Stage environment="city" intensity={0.6} contactShadow={false}>
          <Asset modelPath={modelPath} />
        </Stage>
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          makeDefault 
        />
      </Canvas>
    </div>
  );
};
