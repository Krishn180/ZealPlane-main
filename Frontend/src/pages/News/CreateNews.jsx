import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateNews.scss";

const CreateNews = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const newsData = {
      title,
      content,
      author,
      coverImage,
      tags: tags.split(",").map((tag) => tag.trim())
    };

    await axios.post(`${apiBaseUrl}/news`, newsData);
    alert("News added successfully!");
    navigate("/news"); // 🔁 Navigate to news listing
  } catch (err) {
    console.error("Error adding news:", err);
    alert("Failed to add news");
  }
};


  return (
    <div className="create-news-container">
      <h2>Add News</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cover Image URL"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit">Publish News</button>
      </form>
    </div>
  );
};

export default CreateNews;
