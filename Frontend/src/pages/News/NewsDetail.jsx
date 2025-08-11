import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/Header";
import linkifyHtml from "linkify-html";
import "./NewsDetail.scss";

const NewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/news/${slug}`)
      .then((res) => setNews(res.data))
      .catch((err) => console.error(err));
  }, [slug]);

  if (!news) return <p className="loading">Loading...</p>;

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
          {news.coverImage && (
            <div className="news-cover">
              <img src={news.coverImage} alt={news.title} />
            </div>
          )}

          <h1 className="news-title">{news.title}</h1>
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
    </>
  );
};

export default NewsDetail;
