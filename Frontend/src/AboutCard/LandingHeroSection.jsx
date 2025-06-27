import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingHeroSecStyle.scss";

import hero1 from "../assets/dehek-eng.jpg";
import hero2 from "../assets/aghori9.jpg";
import hero3 from "../assets/lastasuran2-gaurav-shrivastav.jpg";
import hero4 from "../assets/dehek-hin-1.jpg";
import hero5 from "../assets/heroimge.jpg";
import hero6 from "../assets/landingimage.jpg";

const images = [hero1, hero2, hero3, hero4, hero5, hero6];

const LandingHeroSection = () => {
  const [currentImage, setCurrentImage] = useState(hero1);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => {
        const currentIndex = images.indexOf(prevImage);
        const nextIndex = (currentIndex + 1) % images.length;
        return images[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-hero-section">
      <div className="image-wrapper-landing">
        <div className="new-release-badge">New Release</div>
        <img src={currentImage} alt="Hero" className="hero-image" />
      </div>

      <div className="text-content">
        <h1>Enter the World of Comics!</h1>
        <p>
          Welcome to <strong>ComicPlane</strong>! The ultimate destination for
          comic lovers, artists, and dreamers. Explore thrilling stories,
          discuss your favorite characters, and connect with fellow fans.
        </p>
        <div className="cta-buttons">
          <button className="start-reading" onClick={() => navigate("/home")}>
            Start Reading
          </button>
          <button className="join-community" onClick={() => navigate("/forum")}>
            Join Community
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingHeroSection;
