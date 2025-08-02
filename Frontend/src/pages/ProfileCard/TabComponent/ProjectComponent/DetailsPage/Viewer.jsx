import { useState, useEffect } from "react";
import { PacmanLoader } from "react-spinners";
import ProductCard from "../../../../../components/product/ProductCard";
import { FaChevronDown } from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import { initGA, trackPageView } from "../../../../../Analytics";
import axiosInstance from "../../../../../Auth/Axios";
import "./Viewer.scss";

const Viewer = () => {
  const location = useLocation();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [scale, setScale] = useState(1);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendedComics, setRecommendedComics] = useState([]); // <-- For real backend comics

  const { projectSlug } = useParams();
  const projectId = projectSlug?.split("-")[0];

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 1));
  const resetZoom = () => setScale(1);

  // Google Analytics + scroll hint timers
  useEffect(() => {
    initGA();
    trackPageView(window.location.pathname + window.location.search);

    const timer = setTimeout(() => setLoading(false), 1000);
    const hintTimer = setTimeout(() => setShowScrollHint(false), 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hintTimer);
    };
  }, []);

  // Fetch comic images
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
          console.log("images are", res.data);

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

  // Fetch recommended comics
  useEffect(() => {
    const fetchRecommendedComics = async () => {
      try {
        const res = await axiosInstance.get(`/projects`);
        console.log("projects are", res.data);
        
        const validProjects = res.data.filter(
          (project) =>
            project.thumbnailImage && project.thumbnailImages.length > 0
        );

        // Shuffle projects and exclude the currently viewed project
        const shuffled = validProjects
          .filter((p) => p._id !== projectId)
          .sort(() => Math.random() - 0.5);

        setRecommendedComics(shuffled.slice(0, 3)); // Take only 3 recommended comics
      } catch (err) {
        console.error("Error fetching recommended comics", err);
      }
    };

    fetchRecommendedComics();
  }, [projectId]);

  // Detect scroll to bottom
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setShowRecommendation(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
          {/* Optional: If overlay needs dynamic comic data */}
        </div>
      )}

      <div className="zoom-controls">
        <button onClick={zoomOut}>−</button>
        <button onClick={resetZoom}>⭮</button>
        <button onClick={zoomIn}>+</button>
      </div>

      {showRecommendation && recommendedComics.length > 0 && (
        <div className="recommendation-section">
          <h3>Recommended Comics</h3>
          <div className="recommendation-cards">
            {recommendedComics.map((comic) => (
              <ProductCard key={comic._id} product={comic} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Viewer;
