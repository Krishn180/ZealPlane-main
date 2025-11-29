import React, { useState, useEffect } from "react";
import axios from "axios";
import PostList from "./Component/PostList";
import Header from "./Component/Header";
import Sidebar from "./Component/Sidebar";
import CuratedSidebar from "./Component/right-sidebar/right-sidebar"; // New CuratedSidebar Component
import "./style.scss";
import Spinner from "../../components/spinner/Spinner";
import axiosInstance from "../../Auth/Axios";
import ForumSkeleton from "./ForumSkeleton";

const Home = () => {
  const [posts, setPosts] = useState([]); // State for storing posts
  const [loading, setLoading] = useState(true); // State to track loading status
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get(`${apiBaseUrl}/posts`);
        console.log(response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchPosts();
  }, []);

  // Combine backend posts with dummy posts (optional)
  const combinedPosts = [...posts];

  return (
    <div className="home-container">
      <Header />
      <div className="main-layout">
        <div className="sidebar-component">
          <Sidebar />
        </div>
        <div className="main-content" style={{ marginTop: "55px" }}>
          <main className="content-container">
            {loading ? (
              <ForumSkeleton /> // Show spinner while data is loading
            ) : (
              <PostList initialPosts={combinedPosts} /> // Show posts when data is loaded
            )}
          </main>
        </div>
        <div className="curated-sidebar">
          <CuratedSidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
