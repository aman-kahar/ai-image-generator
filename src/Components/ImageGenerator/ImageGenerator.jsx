import React, { useState } from "react";
import "./ImageGenerator.css";
import ai_img from "../Assets/aiImageGenerator.jpg";

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState("Modern AI Generator");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const query = async (data) => {
    setLoading(true); // Start loading
    setError(null);
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/anthienlong/flux_image_enhancer",
        {
          headers: {
            Authorization: "Bearer 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", // Your actual token
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.blob();
      const imgURL = URL.createObjectURL(result);
      setImageUrl(imgURL); // Set the image URL
    } catch (error) {
      console.error("Error:", error);
      setError("Error generating image. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSubmit = () => {
    query({ inputs: prompt });
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "generated_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        <span>Generate</span> Images with AI.
      </div>
      <div className="img-loading">
        <div className="image">
          <img
            src={imageUrl || ai_img} // Show default image if no image URL
            alt="Generated"
          />
        </div>
        {loading && (
          <div>
            <div className="loading-text">Loading, please wait...</div>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={handleDownload}
          className="download-btn"
          disabled={loading || !imageUrl} // Disable when loading or no image URL
        >
          Download Image
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="search-box">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="search-input"
          placeholder="Generate your ideas using AI"
        />
        <div>
          <button className="generate-btn" onClick={handleSubmit}>
            Let's Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
