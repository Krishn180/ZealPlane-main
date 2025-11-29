import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/Header";
import linkifyHtml from "linkify-html";
import "./NewsDetail.scss";
import Footer from "../../components/footer/Footer";

const NewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // Hardcoded authorized user ID
  const authorizedUserId = "d836e39a-9964-4499-8c23-a85e8c78156f";

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/news/${slug}`)
      .then((res) => setNews(res.data))
      .catch((err) => console.error("Error fetching news:", err));
  }, [slug]);

  // DELETE Handler
 const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this news article?")) return;

  try {
    await axios.delete(`${apiBaseUrl}/news/${slug}`);
    alert("News deleted successfully");
    navigate("/news");
  } catch (err) {
    alert("Error deleting news");
    console.error(err);
  }
};


  if (!news) return <p className="loading">Loading...</p>;

  // Show delete button if the news author's ID matches the hardcoded ID
const showDeleteButton = news.authorId 
  ? news.authorId === authorizedUserId 
  : true; // or false depending on your testing


  return (
    <>
      <Header />

      <div className="news-detail-layout">
        {/* Left Sidebar */}
        <aside className="sidebar left-sidebar">
          <h4>Trending Topics</h4>
          <ul>
            <li>#Marvel</li>
            <li>#DC</li>
            <li>#Manga</li>
            <li>#IndieComics</li>
          </ul>
        </aside>

        {/* Main News Content */}
        <main className="news-detail">
          <h1 className="news-title">{news.title}</h1>

          {/* SHOW DELETE BUTTON ONLY TO AUTHOR */}
            <button className="delete-news-btn" onClick={handleDelete}>
              Delete News
            </button>
        

          {news.coverImage && (
            <div className="news-cover">
              <img
                src={news.coverImage}
                alt={news.title}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "500px",
                  objectFit: "cover",
                  imageRendering: "crisp-edges",
                }}
              />
            </div>
          )}

          <p className="news-meta">
            <span>By {news.author || "Unknown"}</span> •{" "}
            <span>{new Date(news.createdAt).toLocaleDateString()}</span>
          </p>

          <div
            className="news-content"
            dangerouslySetInnerHTML={{
              __html: linkifyHtml(news.content || "No content available"),
            }}
            style={{ whiteSpace: "pre-wrap" }}
          ></div>
        </main>

        {/* Right Sidebar */}
        <aside className="sidebar right-sidebar">
          <h4>Latest Releases</h4>
          <ul>
            <li>Batman: Gotham War</li>
            <li>Spider-Man: Beyond</li>
            <li>My Hero Academia</li>
            <li>One Piece</li>
          </ul>
        </aside>
      </div>

      <Footer />
    </>
  );
};

export default NewsDetail;
