import { useState, useEffect } from "react";
import { PacmanLoader } from "react-spinners";
import ProductCard from "../../../../../components/product/ProductCard";
import products from "../../../../../assets/product";
import { FaChevronDown } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import { initGA, trackPageView } from "../../../../../Analytics";
import axiosInstance from "../../../../../Auth/Axios"; // Adjust path if needed
import "./Viewer.scss";

const Viewer = () => {
  // const { projectId } = useParams();
  const location = useLocation();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [scale, setScale] = useState(1);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const { projectSlug } = useParams(); // '684d5027f46df0ac975012d1-the-dark-night'

const projectId = projectSlug?.split("-")[0]; // Only get the ID part


  // Zoom controls
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 1));
  const resetZoom = () => setScale(1);

  useEffect(() => {
    // Google Analytics
    initGA();
    trackPageView(window.location.pathname + window.location.search);

    const timer = setTimeout(() => setLoading(false), 1000);
    const hintTimer = setTimeout(() => setShowScrollHint(false), 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hintTimer);
    };
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const queryImages = queryParams.get("images");
      const queryStartIndex = queryParams.get("start");

      if (queryStartIndex) {
        setStartIndex(parseInt(queryStartIndex, 10));
      }

      if (queryImages) {
        try {
          const parsedImages = JSON.parse(decodeURIComponent(queryImages));
          setImages(parsedImages || []);
          setLoading(false);
        } catch (err) {
          console.error("Error parsing images from query", err);
          setImages([]);
          setLoading(false);
        }
      } else if (projectId) {
        try {
          const res = await axiosInstance.get(`/projects/id/${projectId}`);
          console.log('images are', res.data);
          
          setImages(res.data.project.thumbnailImages || []);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching images from backend", err);
          setImages([]);
          setLoading(false);
        }
      }
    };

    fetchImages();
  }, [projectId]);

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
        {Array.isArray(images) && images.length > 0 ? (
          images.map((img, index) => (
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
          ))
        ) : (
          !loading && (
            <p style={{ color: "white", textAlign: "center" }}>
              No images available.
            </p>
          )
        )}
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
