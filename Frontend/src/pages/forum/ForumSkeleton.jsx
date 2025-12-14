import React from "react";
import "./ForumSkeleton.scss";

const ForumSkeleton = () => {
  return (
    <div className="forum-skeleton-wrapper">
      {/* LEFT SIDEBAR PLACEHOLDER */}
      <div className="skeleton-left-sidebar"></div>

      {/* CENTER POSTS */}
      <div className="skeleton-center">
        {[1, 2].map((_, i) => (
          <div className="sk-post-card" key={i}>
            <div className="sk-title shimmer"></div>
            <div className="sk-meta shimmer"></div>
            <div className="sk-content shimmer"></div>
            <div className="sk-actions shimmer"></div>
          </div>
        ))}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="skeleton-right-sidebar">
        <div className="sk-sidebar-title shimmer"></div>

        {[1, 2, 3, 4, 5].map((_, i) => (
          <div className="sk-side-card shimmer" key={i}></div>
        ))}
      </div>
    </div>
  );
};

export default ForumSkeleton;
