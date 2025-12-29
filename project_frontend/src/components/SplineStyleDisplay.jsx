// src/componets/SplineStyleDisplay.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, ContactShadows, Environment, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 1. The Hero Product Mesh
const HeroProduct = ({ src, rotationY = 0 }) => {
  const mesh = useRef();
  const texture = useTexture(src);
  
  useFrame((state) => {
    // Mouse Parallax (Look at cursor subtly)
    const { x, y } = state.pointer;
    if (mesh.current) {
        // Smoothly look at mouse
        mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, -y * 0.1, 0.1);
        mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, x * 0.1 + rotationY, 0.1);
    }
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[4.5, 6, 64, 64]} />
      {/* FIXED MATERIAL: 
         - Reduced roughness/metalness to stop the "White Blob" effect.
         - Added clearcoat for a premium "plastic bag" shine without glowing.
      */}
      <meshPhysicalMaterial 
        map={texture}
        transparent={true}
        roughness={0.4} 
        metalness={0.1}
        clearcoat={0.5}       // Plastic coating shine
        clearcoatRoughness={0.2}
        envMapIntensity={1.5} // Balanced reflections
      />
    </mesh>
  );
};

// 2. Main Component
const SplineStyleDisplay = ({ src }) => {
  if (!src) return null;

  return (
    <div className="w-full h-full min-h-[600px] relative z-10">
      <Canvas 
        camera={{ position: [0, 0, 9], fov: 35 }}
        dpr={[1, 2]} // Sharp resolution
        gl={{ 
            antialias: true, 
            toneMapping: THREE.ACESFilmicToneMapping, // Cinematic colors
            toneMappingExposure: 1.0 
        }}
      >
        {/* CINEMATIC LIGHTING SETUP */}
        {/* Soft Ambient Light */}
        <ambientLight intensity={0.3} />
        
        {/* Key Light (Warm Front) */}
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} color="#ffffff" castShadow />
        
        {/* Rim Light 1 (Cool Blue - Left Edge) */}
        <spotLight position={[-10, 0, -5]} angle={0.5} intensity={5} color="#4f46e5" distance={20} />
        
        {/* Rim Light 2 (Warm Gold - Right Edge) */}
        <spotLight position={[10, 0, -5]} angle={0.5} intensity={5} color="#d97706" distance={20} />

        {/* Floating Particles */}
        <Sparkles count={40} scale={10} size={3} speed={0.4} opacity={0.5} color="#d97706" />

        {/* Floating Animation */}
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
            <HeroProduct src={src} />
        </Float>

        {/* Shadows */}
        <ContactShadows position={[0, -3.5, 0]} opacity={0.6} scale={20} blur={2.5} far={4} color="black" />
        
        {/* Reflections */}
        <Environment preset="city" blur={1} />
      </Canvas>
    </div>
  );
};

export default SplineStyleDisplay;