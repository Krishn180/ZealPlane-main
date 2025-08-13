import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import "./NewsList.scss";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // ✅ Get userId from localStorage
  const userId = localStorage.getItem("Id");
  const allowedUserId = "63a87bd4-08ed-4c06-9080-2a891c0efbfa";

useEffect(() => {
  axios
    .get(`${apiBaseUrl}/news`)
    .then((res) => {
      console.log("news lists are", res.data);
      setNews(res.data);
    })
    .catch((err) => console.error(err));
}, []);

  return (
    <>
      <Header />

      <div className="news-layout">
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
        <main className="news-page">
          <div className="news-header">
            <h2>📰 Comic Book News</h2>

            {/* ✅ Show Create News button only for allowed user */}
            {userId === allowedUserId && (
              <button
                className="create-news-btn"
                onClick={() => navigate("/add-news")}
              >
                ➕ Create News
              </button>
            )}
          </div>

          {news.length > 0 ? (
            <ul className="news-list">
              {news.map((item) => (
                <li key={item._id} className="news-item">
                  <Link to={`/news/${item.slug}`}>
                    {item.coverImage && (
                      <img src={item.coverImage} alt={item.title} />
                    )}
                    <div className="news-details">
                      <h3>{item.title}</h3>
                      <p>{item.content.slice(0, 120)}...</p>
                      <span className="news-author">
                        By {item.author || "Unknown"}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No news available yet.</p>
          )}
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
    </>
  );
};

export default NewsList;
