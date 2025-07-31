import React, { useEffect, useState } from "react";
import { FaGift, FaStar, FaUserPlus } from "react-icons/fa";
import axios from "axios";
import "./right-sidebar.scss";
import { jwtDecode } from "jwt-decode";

const CuratedSidebar = () => {
  const [curatedPosts, setCuratedPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Check if token exists and decode it
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded.uniqueId) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    }
  }, []);

  // Fetch curated posts if logged in
  useEffect(() => {
    const fetchCuratedPosts = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/posts`);
        setCuratedPosts(res.data || []);
      } catch (error) {
        console.error("Failed to fetch curated posts:", error);
      }
    };

    if (isLoggedIn) {
      fetchCuratedPosts();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="curated-sidebar-container">
        <h3>🎁 Win Free Comic Books!</h3>
        <p>
          Register now to enter our exclusive <strong>monthly giveaway</strong>!
          First-time users stand a chance to get <strong>free physical comic copies</strong> delivered to their door!
        </p>
        <ul className="curated-benefits-list">
          <li><FaGift /> Monthly Comic Drops</li>
          <li><FaStar /> Exclusive Access to Collector Editions</li>
          <li><FaUserPlus /> Showcase or Sell Your Own Comics</li>
        </ul>
        <div className="register-now-button">
          <a href="/register" className="bold-register-button">
            Claim Your Gift Now 🚀
          </a>
        </div>
      </div>
    );
  }

  return (
 <div className="curated-sidebar-container">
  <h3>🔥 Curated For You</h3>
  {curatedPosts.length > 0 ? (
    <ul className="curated-posts-list">
      {curatedPosts.map((post) => {
        // Generate slug from title if backend does not provide one
        const slug = post.slug
          ? post.slug
          : post.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-") // replace spaces & special characters with "-"
              .replace(/(^-|-$)+/g, ""); // remove starting/ending hyphens

        return (
          <li key={post._id} className="curated-post-item">
            <a href={`/post/${slug}-${post._id}`}>{post.title}</a>
          </li>
        );
      })}
    </ul>
  ) : (
    <p>No curated posts yet. Check back soon!</p>
  )}
</div>
  );
};

export default CuratedSidebar;
