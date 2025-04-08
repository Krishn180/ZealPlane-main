import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { PacmanLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import products from "../../../../../assets/product";
import ProductCard from "../../../../../components/product/ProductCard";

const Viewer = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const images = JSON.parse(decodeURIComponent(queryParams.get("images")));
  const startIndex = parseInt(queryParams.get("start"), 10);

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

  // Handle scrolling for navigation (swipe up = next, swipe down = prev)
  useEffect(() => {
    const handleTouch = (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      setTouchStart(touch.clientY);
    };

    const handleTouchEnd = (event) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      const touchEnd = touch.clientY;

      // Detect swipe direction
      if (touchStart - touchEnd > 50) {
        nextImage(); // Swipe up → Next
      } else if (touchEnd - touchStart > 50) {
        prevImage(); // Swipe down → Previous
      }
    };

    let touchStart = 0;
    document.addEventListener("touchstart", handleTouch);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouch);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex]);

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigate("/blank");
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div
      style={{
        textAlign: "center",
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
      }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
          }}
        >
          <PacmanLoader color="orange" size={50} />
        </div>
      )}

      <div
        style={{
          width: "100%",
          height: "100%",
          overflowY: "scroll",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={images[currentIndex]}
          alt={`Thumbnail ${currentIndex + 1}`}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "100vh",
            objectFit: "contain",
            cursor: "pointer",
          }}
          onLoad={handleImageLoad}
          onError={() => setLoading(false)}
          onClick={() => setShowOverlay(true)}
        />
      </div>

      {showOverlay && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: window.innerWidth > 768 ? "100%" : "auto",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "#fff",
            zIndex: 10,
            padding: "20px",
          }}
          onClick={() => setShowOverlay(false)}
        >
          <ProductCard product={products[currentIndex]} />
        </div>
      )}

      {/* Navigation Buttons (only on larger screens) */}
      {currentIndex > 0 && (
        <div
          onClick={prevImage}
          className="arrow-button"
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            padding: "10px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            zIndex: 1,
          }}
        >
          <FaChevronLeft size={30} />
        </div>
      )}

      <div
        onClick={nextImage}
        className="arrow-button"
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          cursor: "pointer",
          padding: "10px",
          borderRadius: "50%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
          zIndex: 1,
        }}
      >
        <FaChevronRight size={30} />
      </div>
    </div>
  );
};

export default Viewer;
