import React, { useEffect, useState } from "react";

const DesignPanel = ({ onImageUpload, onColorChange, selectedImage, selectedColor }) => {
  const [localImage, setLocalImage] = useState(selectedImage || null);
  const [localColor, setLocalColor] = useState(selectedColor || "#ffffff");

  // Sync local state with props when they change
  useEffect(() => {
    setLocalImage(selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    setLocalColor(selectedColor);
  }, [selectedColor]);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result; // Get the base64 image URL
        console.log("Uploaded image URL:", imageUrl); // Debugging log
        onImageUpload(imageUrl); // Update global state
        setLocalImage(imageUrl); // Update local state
      };
      reader.onerror = () => console.error("Error reading file.");
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  // Handle reset
  const handleReset = () => {
    if (window.confirm("Are you sure you want to remove the current design?")) {
      onImageUpload(null); // Remove image
      onColorChange("#ffffff"); // Reset to default white
      setLocalImage(null); // Reset local image state
      setLocalColor("#ffffff"); // Reset local color state
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!localImage && localColor === "#ffffff") {
      alert("No changes to save. Please select a design or color.");
      return;
    }

    if (window.confirm("Are you sure you want to save this design?")) {
      try {
        // Prepare the data to send to the backend
        const designData = {
          color: localColor,
          image: localImage, // Base64 image data
        };

        console.log("Sending design data to backend:", designData); // Debugging log

        // Send the data to the CodeIgniter 4 backend
        const response = await fetch("http://localhost:8080/api/save-design", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(designData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Backend response:", result); // Debugging log
          alert(result.message || "Design saved successfully!");
        } else {
          const error = await response.json();
          console.error("Backend error:", error); // Debugging log
          alert(error.message || "Failed to save the design.");
        }
      } catch (error) {
        console.error("Error saving design:", error);
        alert("An error occurred while saving the design.");
      }
    }
  };

  return (
    <div className="design-panel" style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
      <h3>Customize Earphone</h3>

      {/* Color Picker */}
      <div className="color-picker" style={{ marginBottom: "10px" }}>
        <label htmlFor="color">Pick a Color:</label>
        <input
          type="color"
          id="color"
          value={localColor} // Use local state for the color picker
          onChange={(e) => {
            const color = e.target.value;
            console.log("Changing color to:", color); // Debugging log
            onColorChange(color); // Update global state
            setLocalColor(color); // Update local state
          }}
        />
      </div>

      {/* Image Upload */}
      <div className="image-upload" style={{ marginBottom: "10px" }}>
        <label htmlFor="upload">Upload Design:</label>
        <input type="file" id="upload" accept="image/*" onChange={handleImageUpload} />
        {localImage && (
          <div className="uploaded-image" style={{ marginTop: "10px" }}>
            <img
              src={localImage}
              alt="Selected Design"
              style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "5px" }}
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="buttons" style={{ display: "flex", gap: "10px" }}>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleReset}>Remove</button>
      </div>
    </div>
  );
};

export default DesignPanel;