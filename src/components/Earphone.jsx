import React from "react";
import { useGLTF, useTexture } from "@react-three/drei";

const Earphone = ({ textureUrl, color }) => {
  const { nodes, materials } = useGLTF("./models/earphone.gltf");
	const texture = textureUrl ? useTexture(textureUrl) : null;
	console.log("Loaded texture:", texture);
if (texture && texture.image) {
  console.log("Texture dimensions:", texture.image.width, texture.image.height);
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

  return (
    <group dispose={null}>
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.001}>
        {/* First Mesh */}
        <mesh
          geometry={nodes.IEM1.geometry}
          material={materials["Plastic - Translucent Matte (Yellow)"]}
          position={[-9.48, 3.879, -3.302]}
          scale={10}
        />
        {/* Second Mesh */}
        <mesh
          geometry={nodes["IEM1-cap"].geometry}
          material={materials["Tough 2000 (with Formlabs SLA 3D Printers)"]}
          position={[-9.508, -5.195, -3.32]}
          scale={10}
        />
      </group>
      {/* Mimipaulaaaaaa Mesh with Applied Texture */}
      <mesh
        geometry={nodes.mimipaulaaaaaa.geometry}
        position={[-0.014, 0.021, 0.007]}
      >
        <meshStandardMaterial
          map={texture} // Apply texture if available
          color="white" // Avoid tinting the texture
          transparent={!!texture?.image?.data} // Enable transparency if texture has alpha
          opacity={1} // Ensure full opacity
        />
      </mesh>
    </group>
  );
};

useGLTF.preload("./models/earphone.gltf");
export default Earphone;
