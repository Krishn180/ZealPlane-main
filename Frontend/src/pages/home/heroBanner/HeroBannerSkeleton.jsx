import React from "react";
import "./style.scss";

const HeroBannerSkeleton = () => {
  return (
    <>
      <div className="hero-skeleton-container">
        {/* HERO BOX */}
        <div className="hero-skeleton">
          <div className="hero-skeleton-bg"></div>

          <div className="hero-skeleton-content">
            <div className="hero-skeleton-title"></div>
            <div className="hero-skeleton-desc"></div>
            <div className="hero-skeleton-user"></div>
          </div>
        </div>
      </div>

      {/* PAGINATION DOTS */}
      <div className="hero-pagination-skeleton">
        <div className="dot"></div>
        <div className="dot active"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>

      {/* PAGINATION BAR */}
      <div className="hero-pagination-bar">
        <div className="hero-pagination-progress"></div>
      </div>
    </>
  );
};

export default HeroBannerSkeleton;
