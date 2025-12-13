import React, { useEffect, useState } from "react";
import {
  FaGift,
  FaStar,
  FaUserPlus,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import axios from "axios";
import "./right-sidebar.scss";
import { jwtDecode } from "jwt-decode";
import RightSidebarSkeleton from "./RightSidebarSkeleton";

const CuratedSidebar = () => {
  const [curatedPosts, setCuratedPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Check login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.uniqueId) {
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  // Fetch curated posts
  useEffect(() => {
    const fetchCuratedPosts = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/posts`);
        setCuratedPosts(res.data || []);
      } catch (error) {
        console.error("Failed to fetch curated posts:", error);
      }
    };

    if (isLoggedIn) fetchCuratedPosts();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="curated-sidebar-container">
        <div className="curated-sidebar-box">
          <h3>🎁 Win Free Comic Books!</h3>
          <p>
            Register now to enter our exclusive{" "}
            <strong>monthly giveaway</strong>! First-time users get{" "}
            <strong>free physical comic copies</strong> delivered!
          </p>
          <ul className="curated-benefits-list">
            <li>
              <FaGift /> Monthly Comic Drops
            </li>
            <li>
              <FaStar /> Collector Editions
            </li>
            <li>
              <FaUserPlus /> Showcase Your Comics
            </li>
          </ul>
          <div className="register-now-button">
            <a href="/register" className="bold-register-button">
              Claim Your Gift 🚀
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="curated-sidebar-container">
      <div className="curated-sidebar-box">
        <h3>🔥 Curated For You</h3>
        {curatedPosts.length > 0 ? (
          <ul className="curated-posts-list">
            {curatedPosts.map((post) => {
              const slug = post.slug
                ? post.slug
                : post.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "");
              return (
                <li key={post._id} className="curated-post-card">
                  <div className="post-thumbnail">
                    {post.image ? (
                      <img src={post.image} alt={post.title} />
                    ) : (
                      <div className="no-thumbnail">No Image</div>
                    )}
                  </div>
                  <div className="post-info">
                    <a
                      href={`/post/${slug}-${post._id}`}
                      className="post-title"
                    >
                      {post.title}
                    </a>
                    <div className="post-meta">
                      {/* <span className="subreddit">r/{post.subreddit}</span> • */}
                      <span className="author">
                        Posted by / {post.author || "Anonymous"}
                      </span>{" "}
                      <br />
                      <span className="timestamp">
                        {new Date(post.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {/* <div className="post-votes">
                      <FaArrowUp /> {post.ratings || 0} <FaArrowDown />
                    </div> */}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <RightSidebarSkeleton />
        )}
      </div>
    </div>
  );
};

export default CuratedSidebar;
