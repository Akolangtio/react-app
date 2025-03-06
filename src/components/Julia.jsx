

import React from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

const Julia = ({ textureUrl, color }) => {
    const { nodes, materials } = useGLTF("/react-app/models/julia.gltf");

  
  const texture = textureUrl ? useTexture(textureUrl) : null;

  
  if (texture) {
    texture.rotation = Math.PI; 
    texture.center = new THREE.Vector2(0.5, 0.5); 
    texture.encoding = THREE.SRGBColorSpace; 
  }

  
  if (color) {
    if (materials["Plastic - Translucent Matte (Yellow)"]) {
      materials["Plastic - Translucent Matte (Yellow)"].color.set(color);
    }
    if (materials["Tough 2000 (with Formlabs SLA 3D Printers)"]) {
      materials["Tough 2000 (with Formlabs SLA 3D Printers)"].color.set(color);
    }
  }
	

  return (
    <group dispose={null} scale={35} position={[0, 0, 0]}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.001}>
        
        <mesh
          geometry={nodes.IEM1.geometry}
          material={materials["Plastic - Translucent Matte (Yellow)"]}
          scale={10}
        />
    
        <mesh
          geometry={nodes["IEM1-cap"].geometry}
          material={materials["Tough 2000 (with Formlabs SLA 3D Printers)"]}
          scale={10}
        />
      </group>
      
      <mesh
        geometry={nodes.mimipaulaaaaaa.geometry}
        position={[-0.005, 0.017, 0.018]}
      >
        <meshStandardMaterial
          map={texture} 
          color="white" 
          transparent={!!texture?.image?.data} 
          alphaTest={0.5} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
};

useGLTF.preload("/react-app/models/julia.gltf");

export default Julia;