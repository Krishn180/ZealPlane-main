import React, { useState } from "react";
import axios from "axios";

const ComicUploader = () => {
  const [pdfUrls, setPdfUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        if (type === "pdf") setPdfUrls(res.data.urls);
        else setImageUrls(res.data.urls);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>📚 Comic Upload & Viewer</h2>

      {/* PDF Upload */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            backgroundColor: "#e50914",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Upload PDF
          <input
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e, "pdf")}
          />
        </label>
      </div>

      {/* Image Upload */}
      <div>
        <label
          style={{
            backgroundColor: "#ff9800",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Upload Image
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFileUpload(e, "image")}
          />
        </label>
      </div>

      {loading && <p>Uploading... Please wait ⏳</p>}

      {/* Display PDF JPG pages */}
      {pdfUrls.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>📖 Comic Pages (from PDF)</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {pdfUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`page-${idx}`}
                style={{
                  width: "60%",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Display Uploaded Image */}
      {imageUrls.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3>🖼️ Uploaded Image</h3>
          <div>
            {imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`uploaded-${idx}`}
                style={{
                  width: "300px",
                  borderRadius: "8px",
                  margin: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComicUploader;
