import React, { useState } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import Julia from "./components/Julia";
import { OrbitControls, Environment } from "@react-three/drei";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [seriesType, setSeriesType] = useState("Vanilla"); 
  const [size, setSize] = useState("Medium"); 
  const [uOffset, setUOffset] = useState(0); 
  const [vOffset, setVOffset] = useState(0); 

  // Handle reserved image click
  const handleReservedImageClick = (imageUrl) => {
    console.log("Reserved image clicked:", imageUrl);
    setSelectedImage(imageUrl);
  };

  // Redirect to checkout page
  const handleProceedCheckout = () => {
    const checkoutUrl = "https://"; 
    window.location.href = checkoutUrl; 
  };

  return (
    <div className="App">
      <div className="container">
        {/* Left Container */}
        <div className="left-container">
          {/* Left Top - 3D Model */}
          <div className="left-top">
            <Canvas
              camera={{
                position: [0, 0, 50],
                fov: 50,
              }}
            >
              <ambientLight intensity={0.6} />
              <hemisphereLight skyColor="#ffffff" groundColor="#444444" intensity={0.8} />
              <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
              <directionalLight position={[-10, -10, -10]} intensity={0.5} />

              <Environment preset="city" />

              <group scale={35} position={[5, -15, 0]}>
							  <Julia
								  textureUrl={selectedImage}
								  color={selectedColor}
								  uOffset={uOffset}
							      vOffset={vOffset} />
              </group>

              <OrbitControls
                enableZoom={false}
                rotateSpeed={0.5}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI}
                enablePan={false}
              />
            </Canvas>
          </div>

          {/* Left Bottom - Reserved Images */}
          <div className="left-bottom">
            <div className="design-thumbnails">
              {[
                "/react-app/design/dinoo.png",
                "/react-app/design/dragon.png",
                "/react-app/design/lion.png",
              ].map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Design ${index + 1}`}
                  onClick={() => handleReservedImageClick(imageUrl)}
                  style={{ cursor: "pointer", width: "150px", height: "100px" }}
                />
              ))}
            </div>
          </div>

          {/* Image Upload Section Below Left Bottom */}
          <div className="image-upload-section">
            <div className="upload-container">
              <label htmlFor="upload">Upload Custom Design:</label>
              <input
                type="file"
                id="upload"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setSelectedImage(event.target.result);
                    };
                    reader.onerror = () => console.error("Error reading file.");
                    reader.readAsDataURL(file);
                  } else {
                    alert("Please upload a valid image file.");
                  }
                }}
              />
					  </div>

          </div>
			  </div>
			  
			  
			 

        {/* Right Container */}
        <div className="right-container">
          {/* Enhanced Color Picker */}
          <div className="color-picker-container">
            <label>Pick a Color:</label>
            <EnhancedColorPicker
              selectedColor={selectedColor}
              onColorChange={(color) => setSelectedColor(color)}
            />
				  </div>
				  

          {/* Series Type Dropdown */}
          <div className="dropdown-section">
            <label htmlFor="series-type">Series Type:</label>
            <select
              id="series-type"
              value={seriesType}
              onChange={(e) => setSeriesType(e.target.value)}
            >
              <option value="Vanilla">Vanilla</option>
              <option value="Stage">Stage</option>
            </select>
          </div>

          {/* Size Dropdown */}
          <div className="dropdown-section">
            <label htmlFor="size">Size:</label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          {/* Proceed to Checkout Button */}
          <button onClick={handleProceedCheckout}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}

// Enhanced Color Picker Component
const EnhancedColorPicker = ({ selectedColor, onColorChange }) => {
  const [hue, setHue] = useState(0); // Hue value (0-360)
  const [sv, setSv] = useState({ s: 100, v: 100 }); // Saturation (0-100) and Brightness (0-100)

  // Convert HEX to RGB
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  // Convert RGB to HSV
  const rgbToHsv = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max !== min) {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  };

  // Convert HSV to RGB
  const hsvToRgb = (h, s, v) => {
    s /= 100;
    v /= 100;

    const i = Math.floor(h / 60) % 6;
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r, g, b;
    switch (i) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  // Convert RGB to HEX
  const rgbToHex = (r, g, b) => {
    const toHex = (value) => value.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  // Handle Hue Slider Change
  const handleHueChange = (e) => {
    const newHue = Number(e.target.value);
    setHue(newHue);
    const rgb = hsvToRgb(newHue, sv.s, sv.v);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    onColorChange(hex);
  };

  // Handle SV Box Interaction
  const handleSvMouseDown = (e) => {
    const rect = e.target.getBoundingClientRect();
    const updateSv = (event) => {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const s = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const v = Math.max(0, Math.min(100, ((rect.height - y) / rect.height) * 100));

      setSv({ s, v });
      const rgb = hsvToRgb(hue, s, v);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      onColorChange(hex);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", updateSv);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", updateSv);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Get Current Color Information
  const rgb = hexToRgb(selectedColor);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  return (
    <div className="color-picker-wrapper">
      {/* SV Box */}
      <div
        className="sv-box"
        onMouseDown={handleSvMouseDown}
        style={{
          background: `linear-gradient(to right, hsl(${hue}, 0%, 100%), hsl(${hue}, 100%, 50%)),
                      linear-gradient(to bottom, #fff, transparent)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${sv.s}%`,
            top: `${100 - sv.v}%`,
            width: "20px",
            height: "20px",
            backgroundColor: "#fff",
            border: "2px solid #000",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
          }}
        ></div>
      </div>

      {/* Hue Slider */}
      <div className="hue-slider">
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={handleHueChange}
          className="slider"
        />
      </div>

      {/* Color Information */}
      <div className="color-info">
        {/* HEX Value */}
        <div className="color-info-item">
          <span>HEX:</span> {selectedColor}
        </div>

        {/* RGBA Value */}
        <div className="color-info-item">
          <span>RGBA:</span> {`${rgb.r}, ${rgb.g}, ${rgb.b}, 1`}
        </div>

        {/* HSL Value */}
        <div className="color-info-item">
          <span>HSL:</span> {`${hsl.h}, ${hsl.s}%, ${hsl.l}%`}
        </div>
      </div>
    </div>
  );
};

export default App;