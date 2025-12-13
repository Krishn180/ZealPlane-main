import React from "react";
import "./right-sidebar.scss";

const RightSidebarSkeleton = () => {
  return (
    <ul className="curated-posts-list">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <li key={i} className="curated-post-card skeleton">
          <div className="post-thumbnail skeleton-box" />
          <div className="post-info">
            <div className="skeleton-line title" />
            <div className="skeleton-line meta" />
            <div className="skeleton-line meta short" />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RightSidebarSkeleton;
