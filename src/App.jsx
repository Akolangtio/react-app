import React, { useState, useEffect } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import Julia from "./components/Julia"; // Using Julia.jsx
import { OrbitControls } from "@react-three/drei";
import DesignPanel from "./components/DesignPanel";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  

  // Handle reserved image click
  const handleReservedImageClick = (imageUrl) => {
    console.log("Reserved image clicked:", imageUrl); // Debugging log
    setSelectedImage(imageUrl); // Update the global state
  };

  // Debugging: Log selectedImage updates
  useEffect(() => {
    console.log("Selected Image Updated:", selectedImage); // Debugging log
  }, [selectedImage]);

  return (
    <div className="App">
      <div className="container">
        {/* Left Container */}
        <div className="left-container" style={{ width: "100%", height: "100vh" }}>
          {/* Top Section for 3D Object */}
          <div className="left-top" style={{ width: "100%", height: "80%" }}>
            <Canvas
              camera={{
                position: [0, 0, 50], // Adjust camera position to center the object
                fov: 50,
              }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[2, 2, 2]} intensity={1} />
              <color attach="background" args={["#111111"]} />

              {/* Render the Julia component */}
              <group scale={35} position={[5, -15, 0]}>
                <Julia textureUrl={selectedImage} color={selectedColor} />
              </group>

              {/* Configure OrbitControls */}
              <OrbitControls
                enableZoom={false}
                rotateSpeed={0.5}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI}
                enablePan={false}
              />
            </Canvas>
          </div>

          {/* Bottom Section for Reserved Designs */}
          <div className="left-bottom" style={{ width: "100%", height: "20%" }}>
            <h3>Reserved Designs</h3>
            <div className="design-thumbnails">
              {[
                "/design/dinoo.png",
                "/design/dragon.png",
                "/design/lion.png",
              ].map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Design ${index + 1}`}
                  onClick={() => handleReservedImageClick(imageUrl)}
                  style={{ cursor: "pointer", width: "50px", height: "50px" }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Container */}
        <div className="right-container" style={{ width: "30%", height: "100vh" }}>
          <DesignPanel
            onImageUpload={setSelectedImage} // Pass the setter for selectedImage
            onColorChange={setSelectedColor} // Pass the setter for selectedColor
            selectedImage={selectedImage} // Pass the selected image to DesignPanel
            selectedColor={selectedColor} // Pass the selected color to DesignPanel
          />
        </div>
      </div>
    </div>
  );
}

export default App;