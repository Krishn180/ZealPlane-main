import { useState, useEffect } from "react";
import { PacmanLoader } from "react-spinners";
import ProductCard from "../../../../../components/product/ProductCard";
import products from "../../../../../assets/product";
import { FaChevronDown } from "react-icons/fa";
import "./Viewer.scss";

const Viewer = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const images = JSON.parse(decodeURIComponent(queryParams.get("images")));
  const startIndex = parseInt(queryParams.get("start"), 10) || 0;

  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [scale, setScale] = useState(1);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 1));
  const resetZoom = () => setScale(1);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    const hintTimer = setTimeout(() => setShowScrollHint(false), 5000); // auto-hide scroll hint
    return () => {
      clearTimeout(timer);
      clearTimeout(hintTimer);
    };
  }, []);

  return (
    <div className="viewer-container vertical">
      {loading && (
        <div className="loading-spinner">
          <PacmanLoader color="orange" size={50} />
        </div>
      )}

    {showScrollHint && (
  <div className="scroll-hint">
    <div className="scroll-icon">
      <FaChevronDown className="chevron" />
      <span className="scroll-text">Scroll down to read</span>
    </div>
  </div>
)}


      <div className="scroll-wrapper vertical">
        {images.map((img, index) => (
          <div
            key={index}
            className="image-wrapper"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top center",
            }}
          >
            <img
              src={img}
              alt={`Page ${index + 1}`}
              className="image"
              onClick={() => setShowOverlay(true)}
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          </div>
        ))}
      </div>

      {showOverlay && (
        <div className="overlay" onClick={() => setShowOverlay(false)}>
          <ProductCard product={products[startIndex]} />
        </div>
      )}

      <div className="zoom-controls">
        <button onClick={zoomOut}>−</button>
        <button onClick={resetZoom}>⭮</button>
        <button onClick={zoomIn}>+</button>
      </div>
    </div>
  );
};

export default Viewer;
