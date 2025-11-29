import React from "react";
import "./DetailsSkeletonStyle.scss";

const DetailsSkeleton = () => {
  return (
    <div className="details-layout">
      {/* LEFT SIDE MAIN CONTENT */}
      <div className="details-left">
        {/* NEW — Title Above Banner */}
        <div className="sk-top-title shimmer"></div>
        <div className="sk-top-author shimmer"></div>

        {/* Banner */}
        <div className="sk-banner shimmer"></div>

        {/* User section */}
        <div className="sk-user">
          <div className="sk-avatar shimmer"></div>
          <div className="sk-username shimmer"></div>
        </div>

        {/* Thumbnails */}
        <div className="sk-thumbnails">
          <div className="sk-thumb shimmer"></div>
          <div className="sk-thumb shimmer"></div>
          <div className="sk-thumb shimmer"></div>
          <div className="sk-thumb shimmer"></div>
        </div>

        {/* Description */}
        <div className="sk-desc shimmer"></div>
        <div className="sk-desc shimmer"></div>
        <div className="sk-desc short shimmer"></div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="details-right">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="sk-right-card shimmer"></div>
        ))}
      </div>
    </div>
  );
};

export default DetailsSkeleton;
