import React, { useEffect } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

const Juls = ({ textureUrl, color }) => {
  const { nodes, materials } = useGLTF("./models/juls.gltf");

  // Dynamically load texture based on textureUrl
	const texture = textureUrl ? useTexture(textureUrl) : null;
	

  // Apply transformations to the texture if it exists
  if (texture) {
    texture.rotation = Math.PI; // Rotate the texture 180 degrees
    texture.center = new THREE.Vector2(0.5, 0.5); // Set the rotation center to the middle
    texture.encoding = THREE.sRGBEncoding; // Ensure proper color encoding for textures
  }

  // Apply color to other materials directly
  if (color) {
    if (materials["Plastic - Translucent Matte (Yellow)"]) {
      materials["Plastic - Translucent Matte (Yellow)"].color.set(color);
    }
    if (materials["Tough 2000 (with Formlabs SLA 3D Printers)"]) {
      materials["Tough 2000 (with Formlabs SLA 3D Printers)"].color.set(color);
    }
  }

  // Center the object programmatically
  useEffect(() => {
	  const bbox = new THREE.Box3().setFromObject(nodes.mimipaulaaaaaa);
	  console.log("Bounding Box: ", bbox);
    const center = new THREE.Vector3();
	  bbox.getCenter(center);
	  

    // Move the group to center the object
    nodes.mimipaulaaaaaa.position.sub(center);
  }, []);

  return (
    <group dispose={null} scale={35} position={[0, 0, 0]}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.001}>
        {/* First Mesh */}
        <mesh
          geometry={nodes.IEM1.geometry}
          material={materials["Plastic - Translucent Matte (Yellow)"]}
          scale={10}
        />
        {/* Second Mesh */}
        <mesh
          geometry={nodes["IEM1-cap"].geometry}
          material={materials["Tough 2000 (with Formlabs SLA 3D Printers)"]}
          scale={10}
        />
      </group>
      {/* Mimipaulaaaaaa Mesh with Applied Texture */}
      <mesh
			  geometry={nodes.mimipaulaaaaaa.geometry}
			  
			  position={[-0.005, 0.017, 0.018]}
			  
      >
        <meshStandardMaterial
          map={texture} // Apply texture if available
          color="white" // Default color
          transparent={!!texture?.image?.data} // Enable transparency if texture has alpha
          alphaTest={0.5} // Discard fully transparent pixels
          side={THREE.DoubleSide} // Render both front and back faces
        />
      </mesh>
    </group>
  );
};

useGLTF.preload("./models/juls.gltf");

export default Juls;