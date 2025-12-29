// src/componets/ThreeStudioDisplay.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useTexture, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const GlossyCard = ({ src }) => {
  const mesh = useRef();
  // Load texture
  const texture = useTexture(src);
  
  // Update light/reflection based on mouse
  useFrame((state) => {
    const { x, y } = state.pointer;
    // Subtly rotate the object based on mouse to catch reflections
    // Much stiffer/heavier feel than the previous tilt
    if(mesh.current) {
        mesh.current.rotation.y = x * 0.1; 
        mesh.current.rotation.x = -y * 0.1;
    }
  });

  return (
    <mesh ref={mesh}>
      {/* PlaneGeometry args: [width, height, segments]
         We add segments (32, 32) so lighting calculates smoothly across the surface
      */}
      <planeGeometry args={[4.5, 6, 32, 32]} />
      
      {/* MeshStandardMaterial allows for realistic lighting and reflections.
         - roughness: 0.2 (Makes it look like glossy plastic/foil)
         - metalness: 0.1 (Slight metallic tint for industrial feel)
      */}
      <meshStandardMaterial 
        map={texture}
        transparent={true}
        roughness={0.2} 
        metalness={0.1}
        envMapIntensity={1.5}
      />
    </mesh>
  );
};

const ThreeStudioDisplay = ({ src }) => {
  if (!src) return null;

  return (
    <div className="w-full h-[500px] md:h-[600px] relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
        {/* 1. Industrial Lighting Setup */}
        {/* Low ambient light for contrast */}
        <ambientLight intensity={0.2} />
        
        {/* Key Light (Warm/Gold) */}
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={2} 
          color="#D4AF37" 
        />
        
        {/* Rim Light (Cool/Blue-ish or White for edge definition) */}
        <spotLight 
          position={[-10, 5, -10]} 
          angle={0.5} 
          intensity={1} 
          color="#ffffff" 
        />

        {/* 2. Environment Reflection 
           'city' preset gives realistic building/studio reflections on the glossy bag 
        */}
        <Environment preset="city" />

        {/* 3. Heavy Float Animation */}
        <Float 
          speed={1.5}           // Slower speed = "Heavier" feel
          rotationIntensity={0.2} // Very subtle rotation
          floatIntensity={0.5}    // Subtle up/down
          floatingRange={[-0.1, 0.1]}
        >
          <GlossyCard src={src} />
        </Float>

        {/* 4. Sharp Shadow for grounding */}
        <ContactShadows 
          position={[0, -3.5, 0]} 
          opacity={0.7} 
          scale={20} 
          blur={1.5} 
          far={4} 
          color="#000000"
        />
      </Canvas>
    </div>
  );
};

export default ThreeStudioDisplay;