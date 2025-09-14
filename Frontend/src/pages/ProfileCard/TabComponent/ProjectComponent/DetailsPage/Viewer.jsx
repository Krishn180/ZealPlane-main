import { useState, useEffect, useRef } from "react";
import { PacmanLoader } from "react-spinners";
import { FaChevronDown } from "react-icons/fa";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { initGA, trackPageView } from "../../../../../Analytics";
import axiosInstance from "../../../../../Auth/Axios";
import { jwtDecode } from "jwt-decode";
import "./Viewer.scss";

const Viewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const imageRefs = useRef([]);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [scale, setScale] = useState(1);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const hasTrackedRef = useRef(false); // ✅ ensures view tracked only once

  const { projectSlug } = useParams();
  const projectId = projectSlug?.split("-")[0];

  const token = localStorage.getItem("token");
  let userId = null;
  let username = null;

  // Decode token
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      userId = decoded?.userId || null;
      username = decoded?.username || null;
    } catch (err) {
      console.error("Error decoding token:", err);
    }
  }

  // Zoom controls
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 1));
  const resetZoom = () => setScale(1);

  // Google Analytics
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

  // ✅ Track project view only once
useEffect(() => {
  if (!projectId || hasTrackedRef.current) return;

  const trackView = async () => {
    try {
      console.log("Tracking view for project:", projectId);
      const response = await axiosInstance.post(
        `/projects/${projectId}/view`,
        {},
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : undefined,
        }
      );
      console.log("View recorded:", response.data);
      hasTrackedRef.current = true;
    } catch (err) {
      console.error("Error tracking view:", err.response?.data || err.message);
    }
  };

  trackView();
}, [projectId]); // only projectId

  // Fetch images
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
          const res = await axiosInstance.get(`/projects/id/${projectId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            params: { userId, username },
          });

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
  }, [projectId, token, userId, username]);

  // Detect visible image while scrolling
  useEffect(() => {
    if (!images.length || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisible = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisible = entry.target;
          }
        });

        if (mostVisible) {
          const index = parseInt(mostVisible.dataset.index, 10);

          if (index !== startIndex) {
            setStartIndex(index);

            const url = new URL(window.location.href);
            url.searchParams.set("start", index);
            navigate(`${url.pathname}?${url.searchParams.toString()}`, { replace: true });
          }

          setShowOverlay(index === images.length - 1);
        }
      },
      {
        root: containerRef.current,
        threshold: Array.from({ length: 10 }, (_, i) => i / 10),
      }
    );

    imageRefs.current.forEach((img) => img && observer.observe(img));

    return () => {
      imageRefs.current.forEach((img) => img && observer.unobserve(img));
    };
  }, [images, startIndex, navigate]);

  return (
    <div className="viewer">
      <div className="viewer__container" ref={containerRef}>
        {loading && (
          <div className="viewer__loading-spinner">
            <PacmanLoader color="orange" size={50} />
          </div>
        )}

        {showScrollHint && (
          <div className="viewer__scroll-hint">
            <div className="viewer__scroll-icon">
              <FaChevronDown className="viewer__chevron" />
              <span className="viewer__scroll-text">Scroll down to read</span>
            </div>
          </div>
        )}

        <div className="viewer__scroll-wrapper">
          {Array.isArray(images) && images.length > 0 ? (
            images.map((img, index) => (
              <div
                key={index}
                className="viewer__image-wrapper"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                }}
              >
                <img
                  ref={(el) => (imageRefs.current[index] = el)}
                  data-index={index}
                  src={img}
                  alt={`Page ${index + 1}`}
                  className="viewer__image"
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
          <div className="viewer__overlay viewer__overlay--forum-cta">
            <p>
              Loved this comic? Join fellow fans in epic debates, share your theories,
              and discover hidden easter eggs you might have missed!
            </p>
            <button onClick={() => navigate(`/forum`)}>Join the Comic Community</button>
          </div>
        )}

        <div className="viewer__zoom-controls">
          <button onClick={zoomOut}>−</button>
          <button onClick={resetZoom}>⭮</button>
          <button onClick={zoomIn}>+</button>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
