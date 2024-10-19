import React, { useState } from "react";
import "@tensorflow/tfjs"; // Make sure tensorflow.js is installed via npm/yarn
import "./style.css";
import './assets/styles/cnn.css';    // For convolution tool
import './assets/styles/index.css';  // For general styles
import './assets/styles/style.css';  // For other components

const FoodClassifier = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [ingredients, setIngredients] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target.result); // Update image source
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryClick = () => {
    document.getElementById("file-input").click(); // Trigger file input click
  };

  const handlePredict = () => {
    // Call your TensorFlow.js model prediction logic here
    // You can use setPrediction() and setIngredients() to update the UI based on the model output
    setPrediction("Prediction will appear here.");
    setIngredients("Ingredients will appear here.");
  };

  return (
      <div>
        <h1>Food Classifier Web</h1>

        {/* Display image */}
        <img id="image-view" src={imageSrc || "#"} alt="Image will be displayed here" />

        {/* Display prediction */}
        <div id="output-box">{prediction || "Prediction will appear here"}</div>

        {/* Display ingredients */}
        <div id="ingredients-box">{ingredients || "Ingredients will appear here"}</div>

        <div>
          {/* Buttons for selecting image and making predictions */}
          <button className="button" id="gallery-button" onClick={handleGalleryClick}>
            Select from Gallery
          </button>
          <button className="button" id="camera-button">
            Capture Image
          </button>
          <button className="button" id="predict-button" onClick={handlePredict}>
            Predict
          </button>
        </div>

        {/* Hidden file input for selecting an image */}
        <input
            type="file"
            id="file-input"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
        />
      </div>
  );
};

export default FoodClassifier;
