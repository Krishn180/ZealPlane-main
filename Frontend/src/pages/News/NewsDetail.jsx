import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const NewsDetail = () => {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${apiBaseUrl}/news/${slug}`)
      .then(res => setNews(res.data))
      .catch(err => console.error(err));
  }, [slug]);

  if (!news) return <p>Loading...</p>;

  return (
    <div className="news-detail">
      <h1>{news.title}</h1>
      <p><strong>By:</strong> {news.author}</p>
      <div dangerouslySetInnerHTML={{ __html: news.content }} />
    </div>
  );
};

export default NewsDetail;
