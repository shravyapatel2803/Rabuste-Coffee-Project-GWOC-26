import React, { useLayoutEffect } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import * as THREE from 'three';

const ThreeCoffeeCup = () => {
  const { viewport } = useThree();

  // 1. SIZE: INCREASED (Divisor 2.0 -> 1.5 makes it larger)
  // Max cap increased from 5.5 -> 7.5 for desktops
  const responsiveScale = Math.min(viewport.width / 1.75, 7.5);
  
  // Adjust Y position to keep it vertically centered as it gets bigger
  const responsiveY = responsiveScale * -0.6;

  const materials = useLoader(MTLLoader, '/models/coffee_cup_obj.mtl');
  const object = useLoader(OBJLoader, '/models/coffee_cup_obj.obj', (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  // 2. COLOR & VISIBILITY
  useLayoutEffect(() => {
    object.traverse((child) => {
      if (child.isMesh) {
        // Greyish/Silver Color
        child.material.color = new THREE.Color('#C0C0C0'); 
        
        // Emissive Glow for Dark Mode visibility
        child.material.emissive = new THREE.Color('#333333'); 
        child.material.emissiveIntensity = 0.55;

        child.material.needsUpdate = true;
      }
    });
  }, [object]);

  return (
    <primitive 
      object={object} 
      scale={responsiveScale} 
      position={[0, responsiveY, 0]} 
      rotation={[0, 0, 0]} 
    />
  );
};

export default ThreeCoffeeCup;