import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingHeroSecStyle.scss";

import hero1 from "../assets/dehek-eng.jpg";
import hero2 from "../assets/sando.jpg";
import hero3 from "../assets/aghori9.jpg";
import hero4 from "../assets/chullu.jpg";
import hero5 from "../assets/gost1.jpg";
import hero6 from "../assets/heroimge.jpg";
import hero7 from "../assets/landingimage.jpg";

const images = [hero1, hero2, hero3, hero4, hero5, hero6, hero7];

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
    <section className="landing-hero-section" aria-label="Comic Homepage Hero">
      <div className="image-wrapper-landing">
        <div className="new-release-badge">New Release</div>
        <img
          src={currentImage}
          alt="Featured comic from ComicPlane platform"
          className="hero-image"
        />
      </div>

      <article className="text-content">
        <h1>Enter the World of Comics!</h1>
        <p>
          Discover bold stories, indie heroes, and fantastical adventures on{" "}
          <strong>ComicPlane</strong> — a place where creators and fans come
          together. Whether you're into dark fantasy, action thrillers, or
          heartwarming tales, there's something waiting just for you.
        </p>
        <div className="cta-buttons">
          <button className="start-reading" onClick={() => navigate("/home")}>
            Start Reading
          </button>
          <button className="join-community" onClick={() => navigate("/forum")}>
            Join Community
          </button>
        </div>
      </article>
    </section>
  );
};

export default LandingHeroSection;
