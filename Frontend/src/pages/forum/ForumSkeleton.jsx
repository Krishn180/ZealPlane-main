import React from "react";
import "./ForumSkeleton.scss";

const ForumSkeleton = () => {
  return (
    <div className="forum-layout">
      {/* LEFT SIDEBAR GAP (same width as real left sidebar) */}
      <div className="left-sidebar-gap"></div>

      {/* MAIN POST AREA */}
      <div className="forum-left">
        <div className="sk-post-card">
          <div className="sk-title shimmer"></div>
          <div className="sk-posted shimmer"></div>
          <div className="sk-main-img shimmer"></div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="forum-right">
        <div className="sk-sidebar-title shimmer"></div>

        <div className="sk-side-box shimmer"></div>
        <div className="sk-side-box shimmer"></div>
        <div className="sk-side-box shimmer"></div>
        <div className="sk-side-box shimmer"></div>
        <div className="sk-side-box shimmer"></div>
        <div className="sk-side-box shimmer"></div>
      </div>
    </div>
  );
};

export default ForumSkeleton;
