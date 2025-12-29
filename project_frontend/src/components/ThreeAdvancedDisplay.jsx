// src/componets/ThreeAdvancedDisplay.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Float, ContactShadows, Environment, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

// 1. The Product Mesh with Realistic (But Visible) Material
const CinematicBag = ({ src }) => {
  const mesh = useRef();
  const texture = useTexture(src);
  
  // Subtle sway animation based on mouse
  useFrame((state) => {
    const { x, y } = state.pointer;
    if(mesh.current) {
        // Very subtle rotation - feels heavy and premium
        mesh.current.rotation.y += (x * 0.15 - mesh.current.rotation.y) * 0.05;
        mesh.current.rotation.x += (-y * 0.15 - mesh.current.rotation.x) * 0.05;
    }
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[4.5, 6, 32, 32]} />
      {/* FIXED MATERIAL:
         - Reduced metalness/roughness to stop the "white blob" effect.
         - Lowered envMapIntensity so it doesn't reflect the whole world like a mirror.
      */}
      <meshStandardMaterial 
        map={texture}
        transparent={true}
        roughness={0.4}       // Less glossy, more matte paper/plastic mix
        metalness={0.1}       // Very low metalness
        envMapIntensity={0.8} // Subtle reflections only
      />
    </mesh>
  );
};

// 2. Interactive Light - Controlled Intensity
const MovingSpotlight = () => {
  const light = useRef();
  useFrame((state) => {
    const { x, y } = state.pointer;
    if (light.current) {
        light.current.position.x = x * 8;
        light.current.position.y = y * 8;
    }
  });

  return (
    <spotLight 
      ref={light} 
      position={[0, 0, 8]} 
      angle={0.3} 
      penumbra={1} 
      intensity={1.5} // Lowered from 3 to 1.5 to prevent blowout
      color="#ffffff" 
      castShadow 
    />
  );
};

// 3. Main Scene
const ThreeAdvancedDisplay = ({ src }) => {
  if (!src) return null;

  return (
    <div className="w-full h-[500px] md:h-[650px] relative z-10 cursor-move">
      {/* gl={{ toneMapping... }} fixes the over-exposure colors */}
      <Canvas 
        camera={{ position: [0, 0, 9], fov: 35 }} 
        gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.2 }}
        dpr={[1, 2]} // Crisp resolution on high DPI screens
      >
        
        {/* LIGHTING: Moody & Dramatic */}
        <ambientLight intensity={0.1} /> {/* Very dark ambient */}
        
        {/* Rim Light (Gold) - Hits the edge */}
        <spotLight position={[10, 5, -5]} angle={0.5} intensity={2} color="#D4AF37" />
        
        {/* Rim Light (Blue) - Hits the other edge for contrast */}
        <spotLight position={[-10, -5, -5]} angle={0.5} intensity={2} color="#1a2b3c" />

        {/* The Mouse Light */}
        <MovingSpotlight />

        {/* REFLECTIONS: Studio preset is cleaner than city */}
        <Environment preset="studio" blur={1} />

        {/* PARTICLES: Golden Dust */}
        <Sparkles 
            count={60} 
            scale={10} 
            size={4} 
            speed={0.4} 
            opacity={0.5} 
            color="#D4AF37" 
        />

        {/* FLOATING OBJECT */}
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
          <CinematicBag src={src} />
        </Float>

        {/* SHADOWS */}
        <ContactShadows position={[0, -3.5, 0]} opacity={0.6} scale={20} blur={2.5} far={4} color="#000000" />

        {/* POST-PROCESSING: Cinematic Film Look */}
        <EffectComposer disableNormalPass>
            {/* Bloom only on VERY bright hits (threshold 1.5) so the bag doesn't glow */}
            <Bloom luminanceThreshold={1.5} mipmapBlur intensity={0.5} radius={0.4} />
            
            {/* Film Grain for texture */}
            <Noise opacity={0.05} />
            
            {/* Darkens corners to focus eye */}
            <Vignette eskil={false} offset={0.1} darkness={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default ThreeAdvancedDisplay;